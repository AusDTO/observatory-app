# Pyhton 3.6.4 script to ingest accounts data stream from BigQuery to DTA
# cloud.gov RDS

# schedule interval for datasets are as follows

from __future__ import print_function
import datetime
import os
# import tablib
import pathlib

from airflow import models
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
import env
import signin
import constants
import data_ops

token = signin.ACCESS_TOKEN
header_token = {'Authorization': 'Bearer ' + token}

default_dag_args = {
    # The start_date describes when a DAG is valid / can be run. Set this to a
    # fixed point in time rather than dynamically, since it is evaluated every
    # time a DAG is parsed. See:
    # https://airflow.apache.org/faq.html#what-s-the-deal-with-start-date
    'start_date': datetime.datetime(2020, 9, 20),
    'retries': 2,
    'retry_delay': datetime.timedelta(minutes=5)
}

with models.DAG(
        'bigquery_data_export_rds',
        # schedule_interval=datetime.timedelta(days=1),
        schedule_interval='0 20 * * *',
        catchup=False,
        default_args=default_dag_args) as dag:
    project_id = models.Variable.get('GCP_PROJECT', 'dta-ga-bigquery')

    # BSQL script to pull the data from BigQuery
    bigquery_data_script = bigquery_operator.BigQueryOperator(
        task_id='bigquery_data_script',
        bql=pathlib.Path(constants.DAGS_DIR + "/bq_observatory_service/bq_sql_ga_accounts_data_query.sql").read_text(), use_legacy_sql=False)

    # BigQuery data fetch
    bigquery_data_fetch = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_data_fetch',
        dataset_id= constants.DATASET_ID,
        table_id= constants.TABLE_ID
        )


    def prepare_data(data_, id_):
        output= []
        for datum in data_:
            domain_name,	agency_name,	agency_dept,	hostname,	service_name,	webproperty_id = datum
            logging.info(domain_name,	agency_name,	agency_dept,	hostname,	service_name,	webproperty_id)
            output.append( {"service_name": service_name,
                    "domain": domain_name, "ua_id": webproperty_id, "agency_id": id_} )
        return output


    def add_property(**context):
        data_ops.add_agency(constants.AGENCY_DATA)
        agency_id = data_ops.get_agencyId_by_name(constants.AGENCY_NAME)
        xcom_data = context['ti'].xcom_pull(task_ids='bigquery_data_fetch')
        data_out = prepare_data(xcom_data, agency_id)
        response = requests.post(
            constants.PROPERTIES_ENDPOINT, json=data_out, headers=header_token)
        logging.info(response.json())


    # Write data to RDS
    post_data_to_rds = python_operator.PythonOperator(
        task_id='post_data_to_rds',
        python_callable=add_property,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )

    
bigquery_data_fetch >> post_data_to_rds

