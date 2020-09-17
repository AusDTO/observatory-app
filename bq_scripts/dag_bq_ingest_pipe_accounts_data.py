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

from google.cloud import bigquery

from galileo import galileo, searchconsole, ga

import logging
import json
import requests
import re
import six
import logging
from requests.exceptions import HTTPError
# import pandas
# import data_ops
# import signin

# token = signin.ACCESS_TOKEN

default_dag_args = {
    # The start_date describes when a DAG is valid / can be run. Set this to a
    # fixed point in time rather than dynamically, since it is evaluated every
    # time a DAG is parsed. See:
    # https://airflow.apache.org/faq.html#what-s-the-deal-with-start-date
    'start_date': datetime.datetime(2020, 9, 17),
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
        bql=pathlib.Path(galileo.DAGS_DIR + "/bq_scripts_sandbox/bq_sql_ga_accounts_data_query.sql").read_text(), use_legacy_sql=False)

    # BigQuery data fetch
    bigquery_data_fetch = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_data_fetch',
        dataset_id='dta_customers',
        table_id='dta_ga_accounts'
        # selected_fields=['domain_name', 'agency']
        )

    # Write data to RDS
    # post_data_to_rds = python_operator.PythonOperator(
    #     task_id='post_data_to_rds',
    #     python_callable=data_ops.add_data(token),
    #     dag=dag
    # )

    def print_context(**context):
        xcom_pull = context['ti'].xcom_pull(task_ids='bigquery_data_fetch')
        logging.info('logging ' + json.dumps(xcom_pull))


    t2 = python_operator.PythonOperator(
        task_id='print_result',
        python_callable=print_context,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )

bigquery_data_fetch >> t2

