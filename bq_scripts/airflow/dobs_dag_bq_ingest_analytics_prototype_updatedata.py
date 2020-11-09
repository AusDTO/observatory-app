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

    # bigquery_fetch_type1_1 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type1_1',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE1_1
    #     )
    
    bigquery_fetch_type1_1_toppages = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_1_toppages',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_1_TP
        )    

    bigquery_fetch_type1_1_topgrowth = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_1_topgrowth',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_1_TG
        )
    
    # bigquery_fetch_type1_2 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type1_2',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE1_2
    #     )
    
    # bigquery_fetch_type1_3 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type1_3',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE1_3
    #    )
    
    bigquery_fetch_type1_3_toppages = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_3_toppages',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_3_TP
        )

    bigquery_fetch_type1_3_topgrowth = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_3_topgrowth',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_3_TG
        )    

    # bigquery_fetch_type1_4 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type1_4',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE1_4
    #     )

    bigquery_fetch_type1_4_toppages = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_4_toppages',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_4_TP
        )

    bigquery_fetch_type1_4_topgrowth = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_4_topgrowth',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_4_TG
        )

    # bigquery_fetch_type1_5 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type1_5',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE1_5
    #     )

    bigquery_fetch_type1_5_toppages = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_5_toppages',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_5_TP
        )

    bigquery_fetch_type1_5_topgrowth = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type1_5_topgrowth',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE1_5_TG
        )    

# Type Daily BigQuery Tables Fetch
    bigquery_fetch_type2_1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1
        )
# Type Daily Top Pages
    bigquery_fetch_type2_1_tpgs_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY1
        )
    
    bigquery_fetch_type2_1_tpgs_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id=dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY2
        )
    
    bigquery_fetch_type2_1_tpgs_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY3
        )

    bigquery_fetch_type2_1_tpgs_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY4
        )
    
    bigquery_fetch_type2_1_tpgs_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY5
        )

    bigquery_fetch_type2_1_tpgs_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY6
        )

    bigquery_fetch_type2_1_tpgs_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tpgs_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TP_DAY7
        )

    # Type Daily Top Growth Pages
    bigquery_fetch_type2_1_tgw_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY1
        )
    
    bigquery_fetch_type2_1_tgw_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id=dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY2
        )
    
    bigquery_fetch_type2_1_tgw_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY3
        )

    bigquery_fetch_type2_1_tgw_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY4
        )
    
    bigquery_fetch_type2_1_tgw_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY5
        )

    bigquery_fetch_type2_1_tgw_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY6
        )

    bigquery_fetch_type2_1_tgw_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_1_tgw_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_1_TG_DAY7
        )

    # bigquery_fetch_type2_2 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type2_2',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE2_2
    #     )

    bigquery_fetch_type2_3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3
        )
    
    bigquery_fetch_type2_3_tpgs_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY1
        )

    bigquery_fetch_type2_3_tpgs_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY2
        )

    bigquery_fetch_type2_3_tpgs_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY3
        )

    bigquery_fetch_type2_3_tpgs_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY4
        )

    bigquery_fetch_type2_3_tpgs_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY5
        )

    bigquery_fetch_type2_3_tpgs_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY6
        )

    bigquery_fetch_type2_3_tpgs_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tpgs_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TP_DAY7
        )
    
    bigquery_fetch_type2_3_tgw_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY1
        )

    bigquery_fetch_type2_3_tgw_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY2
        )

    bigquery_fetch_type2_3_tgw_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY3
        )

    bigquery_fetch_type2_3_tgw_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY4
        )

    bigquery_fetch_type2_3_tgw_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY5
        )

    bigquery_fetch_type2_3_tgw_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY6
        )

    bigquery_fetch_type2_3_tgw_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_3_tgw_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_3_TG_DAY7
        )

    bigquery_fetch_type2_4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4
        )

    bigquery_fetch_type2_4_tpgs_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY1
        )
    
    bigquery_fetch_type2_4_tpgs_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY2
        )

    bigquery_fetch_type2_4_tpgs_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY3
        )

    bigquery_fetch_type2_4_tpgs_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY4
        )
    
    bigquery_fetch_type2_4_tpgs_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY5
        )
    
    bigquery_fetch_type2_4_tpgs_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY6
        )

    bigquery_fetch_type2_4_tpgs_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tpgs_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TP_DAY7
        )
    

    bigquery_fetch_type2_4_tgw_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY1
        )

    bigquery_fetch_type2_4_tgw_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY2
        )

    bigquery_fetch_type2_4_tgw_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY3
        )

    bigquery_fetch_type2_4_tgw_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY4
        )

    bigquery_fetch_type2_4_tgw_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY5
        )

    bigquery_fetch_type2_4_tgw_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY6
        )

    bigquery_fetch_type2_4_tgw_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_4_tgw_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_4_TG_DAY7
        )


    bigquery_fetch_type2_5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5
        )

    bigquery_fetch_type2_5_tpgs_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY1
        )
    
    bigquery_fetch_type2_5_tpgs_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY2
        )

    bigquery_fetch_type2_5_tpgs_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY3
        )

    bigquery_fetch_type2_5_tpgs_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY4
        )

    bigquery_fetch_type2_5_tpgs_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY5
        )

    bigquery_fetch_type2_5_tpgs_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY6
        )

    bigquery_fetch_type2_5_tpgs_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tpgs_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TP_DAY7
        )

    bigquery_fetch_type2_5_tgw_day1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY1
        )

    bigquery_fetch_type2_5_tgw_day2 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day2',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY2
        )

    bigquery_fetch_type2_5_tgw_day3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY3
        )

    bigquery_fetch_type2_5_tgw_day4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY4
        )

    bigquery_fetch_type2_5_tgw_day5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY5
        )

    bigquery_fetch_type2_5_tgw_day6 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day6',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY6
        )

    bigquery_fetch_type2_5_tgw_day7 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type2_5_tgw_day7',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE2_5_TG_DAY7
        )


    bigquery_fetch_type3_1 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type3_1',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE3_1
        )

    # bigquery_fetch_type3_2 = bigquery_get_data.BigQueryGetDataOperator(
    #     task_id='bigquery_fetch_type3_2',
    #     dataset_id= dobs_constants.DATASET_EXEC_BASICS,
    #     table_id= dobs_constants.TABLE_EXEC_TYPE3_2
    #     )

    bigquery_fetch_type3_3 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type3_3',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE3_3
        )

    bigquery_fetch_type3_4 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type3_4',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE3_4
        )

    bigquery_fetch_type3_5 = bigquery_get_data.BigQueryGetDataOperator(
        task_id='bigquery_fetch_type3_5',
        dataset_id= dobs_constants.DATASET_EXEC_BASICS,
        table_id= dobs_constants.TABLE_EXEC_TYPE3_5
        )


    # Prepare analytics data for delivery into RDS

    #Weekly data ouput transform function
    def prepare_outtype1(data_tp, data_tg):
        output =  []
        top10g = []
        top10p = []
        
        for datum in data_tp:
            property_id,	hostname,	users,	newUsers,	returningUsers,	pageviews,	time_on_page,	bounce_rate,sessions,	aveSession,	pagesPerSession,	aveSessionDuration,	pageviews_tp,	pagetitle_tp,	pageurl_tp,	trend_percent,	top_rank_tp,	week_start,	week_end = datum
            top10p.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews" : pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})

        for datum in data_tg:
            property_id, hostname, users, newUsers, returningUsers, pageviews, time_on_page, bounce_rate, sessions, aveSession, pagesPerSession, aveSessionDuration, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, week_start, week_end = datum
            top10g.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews" : pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        	
        property_id, hostname, users, newUsers, returningUsers, pageviews, time_on_page, bounce_rate, sessions, aveSession, pagesPerSession, aveSessionDuration, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, week_start, week_end = datum
        output.append({"dateEnding": week_end, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page,"bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession , "aveSessionDuration": aveSessionDuration, "newUsers": newUsers ,"returningUsers": returningUsers, "topTenGrowth": top10g, "topTenPageViews": top10p})

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum[0]


# Daily data output transform function
    def prepare_outtype2(data_, data_tp1, data_tg1,data_tp2, data_tg2,data_tp3, data_tg3,data_tp4, data_tg4, data_tp5, data_tg5,data_tp6, data_tg6,data_tp7, data_tg7):
        output =  []
        top10g1 = []
        top10p1 = []
        top10g2 = []
        top10p2 = []
        top10g3 = []
        top10p3 = []
        top10g4 = []
        top10p4 = []
        top10g5 = []
        top10p5 = []
        top10g6 = []
        top10p6 = []
        top10g7 = []
        top10p7 = []

        for datum_p1 in data_tp1:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p1
             top10p1.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g1 in data_tg1:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g1
            top10g1.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_1 = datum_g1[7]

        for datum_p2 in data_tp2:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p2
             top10p2.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g2 in data_tg2:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g2
            top10g2.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_2 = datum_g2[7]

        for datum_p3 in data_tp3:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p3
             top10p3.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g3 in data_tg3:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g3
            top10g3.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_3 = datum_g3[7]

        for datum_p4 in data_tp4:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p4
             top10p4.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g4 in data_tg4:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g4
            top10g4.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_4 = datum_g4[7]

        for datum_p5 in data_tp5:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p5
             top10p5.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g5 in data_tg5:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g5
            top10g5.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_5 = datum_g5[7]

        for datum_p6 in data_tp6:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p6
             top10p6.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g6 in data_tg6:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g6
            top10g6.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_6 = datum_g6[7]

        for datum_p7 in data_tp7:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_p7
             top10p7.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_g7 in data_tg7:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_g7
            top10g7.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_7 = datum_g7[7]

        for datum_ in data_:
            property_id, hostname, users, newUsers, returningUsers, pageviews, time_on_page, bounce_rate, sessions, aveSession, pagesPerSession, aveSessionDuration, visit_date, visit_weekday = datum_
            if datum_[12] == visitdate_1: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g1, "topTenPageViews": top10p1})
            if datum_[12] == visitdate_2: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g2, "topTenPageViews": top10p2})
            if datum_[12] == visitdate_3: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g3, "topTenPageViews": top10p3})
            if datum_[12] == visitdate_4: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g4, "topTenPageViews": top10p4})
            if datum_[12] == visitdate_5: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g5, "topTenPageViews": top10p5})
            if datum_[12] == visitdate_6: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g6, "topTenPageViews": top10p6})
            if datum_[12] == visitdate_7: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g7, "topTenPageViews": top10p7})
            # else:
            #     output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": [], "topTenPageViews": []})

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum_[0]


# Hourly data output transform function
    def prepare_outtype3(data_):
        output = []
        for datum in data_:
             property_id, hostname, users, newUsers, returningUsers, pageviews, time_on_page, bounce_rate, sessions, aveSession, pagesPerSession, aveSessionDuration, visit_hour, visit_weekday = datum
             output.append({"visit_hour": visit_hour, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession , "aveSessionDuration": aveSessionDuration, "newUsers": newUsers ,"returningUsers": returningUsers}
            )

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum[0]


# Weekly data output streaming
    def update_output_type1(**context):
        # Load output of respective agency's property into RDS
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_1_toppages')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_1_topgrowth')
        if xcom_data_1 or xcom_data_2 :
            data_out, uaid = prepare_outtype1(xcom_data_1, xcom_data_2)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE1)

        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_2')
        # if xcom_data_2:
        #     data_out, uaid = prepare_outtype1(xcom_data_2)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE1)

        xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_3_toppages')
        xcom_data_6 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_3_topgrowth')
        if xcom_data_5 or xcom_data_6:
            data_out, uaid = prepare_outtype1(xcom_data_5, xcom_data_6)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE1)

        xcom_data_7 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_4_toppages')
        xcom_data_8 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_4_topgrowth')
        if xcom_data_7 or xcom_data_8:
            data_out, uaid = prepare_outtype1(xcom_data_7, xcom_data_8)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE1)

        xcom_data_9 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_5_toppages')
        xcom_data_10 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type1_5_topgrowth')
        if xcom_data_9 or xcom_data_10:
            data_out, uaid = prepare_outtype1(xcom_data_9, xcom_data_10)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE1)

# Daily data output streaming
    def update_output_type2(**context):
        # Load output of respective agency's property into RDS
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')

        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day1')
        
        xcom_data_4 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day2')
        xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day2')
        
        xcom_data_6 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day3')
        xcom_data_7 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day3')
        
        xcom_data_8 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day4')
        xcom_data_9 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day4')
        
        xcom_data_10 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day5')
        xcom_data_11 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day5')

        xcom_data_12 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day6')
        xcom_data_13 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day6')
        
        xcom_data_14 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day7')
        xcom_data_15 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day7')

        if xcom_data_1 and (xcom_data_2 or xcom_data_3 or xcom_data_4 or xcom_data_5 or xcom_data_6 or xcom_data_7 or xcom_data_8 or xcom_data_9 or xcom_data_10 or xcom_data_11 or xcom_data_12 or xcom_data_13 or xcom_data_14 or xcom_data_15):
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3, xcom_data_4, xcom_data_5, xcom_data_6, xcom_data_7, xcom_data_8, xcom_data_9, xcom_data_10, xcom_data_11, xcom_data_12, xcom_data_13, xcom_data_14, xcom_data_15)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day1')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day1')
        
        # xcom_data_4 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day2')
        # xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day2')
        
        # xcom_data_6 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day3')
        # xcom_data_7 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day3')
        
        # xcom_data_8 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day4')
        # xcom_data_9 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day4')
        
        # xcom_data_10 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day5')
        # xcom_data_11 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day5')

        # xcom_data_12 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day6')
        # xcom_data_13 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day6')
        
        # xcom_data_14 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day7')
        # xcom_data_15 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day7')

        # if xcom_data_1 and (xcom_data_2 or xcom_data_3 or xcom_data_4 or xcom_data_5 or xcom_data_6 or xcom_data_7 or xcom_data_8 or xcom_data_9 or xcom_data_10 or xcom_data_11 or xcom_data_12 or xcom_data_13 or xcom_data_14 or xcom_data_15):
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3, xcom_data_4, xcom_data_5, xcom_data_6, xcom_data_7, xcom_data_8, xcom_data_9, xcom_data_10, xcom_data_11, xcom_data_12, xcom_data_13, xcom_data_14, xcom_data_15)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day1')
        
        xcom_data_4 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day2')
        xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day2')
        
        xcom_data_6 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day3')
        xcom_data_7 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day3')
        
        xcom_data_8 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day4')
        xcom_data_9 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day4')
        
        xcom_data_10 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day5')
        xcom_data_11 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day5')

        xcom_data_12 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day6')
        xcom_data_13 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day6')
        
        xcom_data_14 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day7')
        xcom_data_15 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day7')

        if xcom_data_1 and (xcom_data_2 or xcom_data_3 or xcom_data_4 or xcom_data_5 or xcom_data_6 or xcom_data_7 or xcom_data_8 or xcom_data_9 or xcom_data_10 or xcom_data_11 or xcom_data_12 or xcom_data_13 or xcom_data_14 or xcom_data_15):
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3, xcom_data_4, xcom_data_5, xcom_data_6, xcom_data_7, xcom_data_8, xcom_data_9, xcom_data_10, xcom_data_11, xcom_data_12, xcom_data_13, xcom_data_14, xcom_data_15)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day1')
        
        xcom_data_4 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day2')
        xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day2')
        
        xcom_data_6 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day3')
        xcom_data_7 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day3')
        
        xcom_data_8 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day4')
        xcom_data_9 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day4')
        
        xcom_data_10 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day5')
        xcom_data_11 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day5')

        xcom_data_12 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day6')
        xcom_data_13 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day6')
        
        xcom_data_14 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day7')
        xcom_data_15 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day7')

        if xcom_data_1 and (xcom_data_2 or xcom_data_3 or xcom_data_4 or xcom_data_5 or xcom_data_6 or xcom_data_7 or xcom_data_8 or xcom_data_9 or xcom_data_10 or xcom_data_11 or xcom_data_12 or xcom_data_13 or xcom_data_14 or xcom_data_15):
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3, xcom_data_4, xcom_data_5, xcom_data_6, xcom_data_7, xcom_data_8, xcom_data_9, xcom_data_10, xcom_data_11, xcom_data_12, xcom_data_13, xcom_data_14, xcom_data_15)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
            
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day1')
        
        xcom_data_4 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day2')
        xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day2')
        
        xcom_data_6 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day3')
        xcom_data_7 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day3')
        
        xcom_data_8 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day4')
        xcom_data_9 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day4')
        
        xcom_data_10 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day5')
        xcom_data_11 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day5')

        xcom_data_12 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day6')
        xcom_data_13 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day6')
        
        xcom_data_14 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day7')
        xcom_data_15 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day7')

        if xcom_data_1 and (xcom_data_2 or xcom_data_3 or xcom_data_4 or xcom_data_5 or xcom_data_6 or xcom_data_7 or xcom_data_8 or xcom_data_9 or xcom_data_10 or xcom_data_11 or xcom_data_12 or xcom_data_13 or xcom_data_14 or xcom_data_15):
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3, xcom_data_4, xcom_data_5, xcom_data_6, xcom_data_7, xcom_data_8, xcom_data_9, xcom_data_10, xcom_data_11, xcom_data_12, xcom_data_13, xcom_data_14, xcom_data_15)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)


# Hourly data output streaming
    def update_output_type3(**context):
        # Load output of respective agency's property into RDS
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type3_1')
        if xcom_data_1:
            data_out, uaid = prepare_outtype3(xcom_data_1)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE3)
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type3_2')
        # if xcom_data_2:
        #     data_out, uaid = prepare_outtype3(xcom_data_2)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE3)
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type3_3')
        if xcom_data_3:
            data_out, uaid = prepare_outtype3(xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE3)
        xcom_data_4 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type3_4')
        if xcom_data_4:
            data_out, uaid = prepare_outtype3(xcom_data_4)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE3)
        xcom_data_5 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type3_5')
        if xcom_data_5:
            data_out, uaid = prepare_outtype3(xcom_data_5)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE3)


    # DAGs - Write data to RDS
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

# bigquery_data_type1 >> bigquery_fetch_type1_1
bigquery_data_type1 >> bigquery_fetch_type1_1_toppages >> update_type1_to_rds
bigquery_data_type1 >> bigquery_fetch_type1_1_topgrowth >> update_type1_to_rds
# bigquery_data_type1 >> bigquery_fetch_type1_2
# bigquery_data_type1 >> bigquery_fetch_type1_3
bigquery_data_type1 >> bigquery_fetch_type1_3_toppages >> update_type1_to_rds
bigquery_data_type1 >> bigquery_fetch_type1_3_topgrowth >> update_type1_to_rds
# bigquery_data_type1 >> bigquery_fetch_type1_4
bigquery_data_type1 >> bigquery_fetch_type1_4_toppages >> update_type1_to_rds
bigquery_data_type1 >> bigquery_fetch_type1_4_topgrowth >> update_type1_to_rds
# bigquery_data_type1 >> bigquery_fetch_type1_5
bigquery_data_type1 >> bigquery_fetch_type1_5_toppages >> update_type1_to_rds
bigquery_data_type1 >> bigquery_fetch_type1_5_topgrowth >> update_type1_to_rds

bigquery_data_type2 >> bigquery_fetch_type2_1 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day1 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day2 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day3 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day4 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day5 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day6 
bigquery_data_type2 >> bigquery_fetch_type2_1_tpgs_day7 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day1 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day2 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day3 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day4 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day5 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day6 
bigquery_data_type2 >> bigquery_fetch_type2_1_tgw_day7 >> update_type2_to_rds

# bigquery_data_type2 >> bigquery_fetch_type2_2 

bigquery_data_type2 >> bigquery_fetch_type2_3
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day1  
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day2
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day3 
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day4 
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day5 
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day6 
bigquery_data_type2 >> bigquery_fetch_type2_3_tpgs_day7 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day1 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day2 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day3 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day4 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day5 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day6 
bigquery_data_type2 >> bigquery_fetch_type2_3_tgw_day7 >> update_type2_to_rds

bigquery_data_type2 >> bigquery_fetch_type2_4
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day1 
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day2 
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day3 
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day4 
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day5 
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day6 
bigquery_data_type2 >> bigquery_fetch_type2_4_tpgs_day7 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day1 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day2 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day3 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day4 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day5 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day6 
bigquery_data_type2 >> bigquery_fetch_type2_4_tgw_day7 >> update_type2_to_rds

bigquery_data_type2 >> bigquery_fetch_type2_5
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day1 
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day2 
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day3 
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day4 
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day5 
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day6 
bigquery_data_type2 >> bigquery_fetch_type2_5_tpgs_day7 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day1 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day2 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day3 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day4 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day5 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day6 
bigquery_data_type2 >> bigquery_fetch_type2_5_tgw_day7 >> update_type2_to_rds

bigquery_data_type3 >> bigquery_fetch_type3_1
# bigquery_data_type3 >> bigquery_fetch_type3_2
bigquery_data_type3 >> bigquery_fetch_type3_3
bigquery_data_type3 >> bigquery_fetch_type3_4
bigquery_data_type3 >> bigquery_fetch_type3_5 >> update_type3_to_rds