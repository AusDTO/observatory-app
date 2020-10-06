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
        'bigquery_output_prototype',
        # schedule_interval=datetime.timedelta(days=1),
        schedule_interval=None,
        catchup=False,
        default_args=default_dag_args) as dag:
    project_id = models.Variable.get('GCP_PROJECT', 'dta-ga-bigquery')

    # BSQL script to pull the data from BigQuery
    bigquery_data_script = bigquery_operator.BigQueryOperator(
        task_id='bigquery_data_script',
        bql=pathlib.Path(dobs_constants.DAGS_DIR + "/bq_observatory_service/bq_sql_exec_basics_daily.sql").read_text(), use_legacy_sql=False)

    # BigQuery data fetch
    bigquery_data_fetch = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_data_fetch',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2
        )


    def prepare_outdata(data_, analytics_type):
        output = []
        for datum in data_:
             property_id, hostname, users, pageviews, time_on_page, bounce_rate, bounces, sessions, visit_date,visit_weekday = datum
             output.append({"date": visit_date, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions}
            )

        jdata =   {
            "type": analytics_type,
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum[0]
        

    def add_output_type2(**context):
        # Load output of respective agency's property into RDS
        xcom_data = context['ti'].xcom_pull(task_ids='bigquery_data_fetch')
        data_out, uaid = prepare_outdata(xcom_data, dobs_constants.Analytics_TYPE2)
        dobs_data_ops.add_output(data_out, uaid)
        

    # Write data to RDS
    add_output_to_rds = python_operator.PythonOperator(
        task_id='add_output_to_rds',
        python_callable=add_output_type2,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )


bigquery_data_script >> bigquery_data_fetch >> add_output_to_rds

