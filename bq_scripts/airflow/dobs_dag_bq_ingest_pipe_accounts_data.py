# Pyhton 3.6.4 script to ingest accounts data stream from BigQuery to DTA
# cloud.gov RDS

# schedule interval for datasets are as follows

from __future__ import print_function
import datetime
import os
# import tablib
import pathlib

from airflow import models
from airflow.models import Variable
from airflow.operators import python_operator
from airflow.contrib.operators import bigquery_operator
from airflow.contrib.operators import bigquery_get_data

import logging
import json
import requests
import re
import six
import logging
from requests.exceptions import HTTPError
import dobs_signin
import dobs_constants
import dobs_data_ops

# token = signin.ACCESS_TOKEN
# header_token = {'Authorization': 'Bearer ' + token}

default_dag_args = {
    # The start_date describes when a DAG is valid / can be run. Set this to a
    # fixed point in time rather than dynamically, since it is evaluated every
    # time a DAG is parsed. See:
    # https://airflow.apache.org/faq.html#what-s-the-deal-with-start-date
    'start_date': datetime.datetime(2020, 9, 20),
    'retries': 0,
    'retry_delay': datetime.timedelta(minutes=5)
}

with models.DAG(
        'bigquery_data_export_rds',
        # schedule_interval=datetime.timedelta(days=1),
        schedule_interval=None,
        catchup=False,
        default_args=default_dag_args) as dag:
    project_id = models.Variable.get('GCP_PROJECT', 'dta-ga-bigquery')

    # BSQL script to pull the data from BigQuery
    bigquery_data_script = bigquery_operator.BigQueryOperator(
        task_id='bigquery_data_script',
        bql=pathlib.Path(dobs_constants.DAGS_DIR + "/bq_observatory_service/bq_sql_ga_accounts_data_query.sql").read_text(), use_legacy_sql=False)

    # BigQuery data fetch
    bigquery_data_fetch = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_data_fetch',
        dataset_id= dobs_constants.DATASET_ID,
        table_id= dobs_constants.TABLE_ID
        )


    def prepare_data(data_, id_):
        output= []
        for datum in data_:
            agency_name, webproperty_id, domain_name,	hostname,	service_name	 = datum
            output.append( {"service_name": service_name,
                    "domain": hostname, "ua_id": webproperty_id, "agencyId": id_} )
        logging.info(output)
        return output


    def add_property(**context):
        # Add agency add
        # dobs_data_ops.add_agency(dobs_constants.AGENCY_DATA)

        # Get agency ID
        agency_id = dobs_data_ops.get_agencyId_by_name(dobs_constants.AGENCY_NAME)
        logging.info(agency_id)
       
        # Load properties of respective agency into RDS
        xcom_data = context['ti'].xcom_pull(task_ids='bigquery_data_fetch')
        data_out = prepare_data(xcom_data, agency_id)
        
        response = requests.post(
            dobs_constants.PROPERTIES_ENDPOINT, json=data_out, headers=dobs_data_ops.header_token)
        logging.info(response.json())


    # Write data to RDS
    post_data_to_rds = python_operator.PythonOperator(
        task_id='post_data_to_rds',
        python_callable=add_property,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )

    
bigquery_data_script >> bigquery_data_fetch >> post_data_to_rds

