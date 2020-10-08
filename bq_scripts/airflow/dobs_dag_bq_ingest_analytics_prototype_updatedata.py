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
        'bigquery_output_update_prototype',
        # schedule_interval=datetime.timedelta(days=1),
        schedule_interval='0 20 * * *',
        catchup=False,
        on_failure_callback = None,
        default_args=default_dag_args) as dag:
    project_id = models.Variable.get('GCP_PROJECT', 'dta-ga-bigquery')

    # BSQL script to pull the data from BigQuery
    bigquery_data_type1 = bigquery_operator.BigQueryOperator(
        task_id='bigquery_data_type1',
        priority='BATCH',
        bql=pathlib.Path(dobs_constants.DAGS_DIR + "/bq_observatory_service/bq_sql_exec_basics_weekly.sql").read_text(), use_legacy_sql=False)

    bigquery_data_type2 = bigquery_operator.BigQueryOperator(
        task_id='bigquery_data_type2',
        priority='BATCH',
        bql=pathlib.Path(dobs_constants.DAGS_DIR + "/bq_observatory_service/bq_sql_exec_basics_daily.sql").read_text(), use_legacy_sql=False)

    bigquery_data_type3 = bigquery_operator.BigQueryOperator(
        task_id='bigquery_data_type3',
        priority='BATCH',
        bql=pathlib.Path(dobs_constants.DAGS_DIR + "/bq_observatory_service/bq_sql_exec_basics_hourly.sql").read_text(), use_legacy_sql=False)

    # BigQuery data fetch
    bigquery_fetch_type1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1
        )
    
    bigquery_fetch_type2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2
        )

    bigquery_fetch_type3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE3
        )


    # Prepare analytics data for delivery into RDS
    def prepare_outtype1(data_):
        output = []
        for datum in data_:
             property_id, hostname, users, pageviews, time_on_page, bounce_rate, bounces, sessions, week_start, week_end = datum
             output.append({"dateEnding": week_end, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions}
            )

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum[0]


    def prepare_outtype2(data_):
        output = []
        for datum in data_:
             property_id, hostname, users, pageviews, time_on_page, bounce_rate, bounces, sessions, visit_date,visit_weekday = datum
             output.append({"date": visit_date, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions}
            )

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum[0]
    

    def prepare_outtype3(data_):
        output = []
        for datum in data_:
             property_id, hostname, users, pageviews, time_on_page, bounce_rate, bounces, sessions, visit_hour,visit_weekday = datum
             output.append({"visit_hour": visit_hour, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions}
            )

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum[0]


    def update_output_type1(**context):
        # Load output of respective agency's property into RDS
        xcom_data = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1')
        data_out, uaid = prepare_outtype1(xcom_data)
        dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE1)


    def update_output_type2(**context):
        # Load output of respective agency's property into RDS
        xcom_data = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2')
        data_out, uaid = prepare_outtype2(xcom_data)
        dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)


    def update_output_type3(**context):
        # Load output of respective agency's property into RDS
        xcom_data = context['ti'].xcom_pull(task_ids='bigquery_fetch_type3')
        data_out, uaid = prepare_outtype3(xcom_data)
        dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE3)


    # Write data to RDS
    update_type1_to_rds = python_operator.PythonOperator(
        task_id='update_type1_to_rds',
        python_callable=update_output_type1,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )

    update_type2_to_rds = python_operator.PythonOperator(
        task_id='update_type2_to_rds',
        python_callable=update_output_type2,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )

    update_type3_to_rds = python_operator.PythonOperator(
        task_id='update_type3_to_rds',
        python_callable=update_output_type3,
        provide_context=True,
        op_kwargs=None,
        dag=dag,
    )

bigquery_data_type1 >> bigquery_fetch_type1 >> update_type1_to_rds
bigquery_data_type2 >> bigquery_fetch_type2 >> update_type2_to_rds
bigquery_data_type3 >> bigquery_fetch_type3 >> update_type3_to_rds

