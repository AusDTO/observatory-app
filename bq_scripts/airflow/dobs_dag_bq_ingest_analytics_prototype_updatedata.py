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
    #Weekly data ouput transform
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


# Daily data output transform
    def prepare_outtype2(data_, data_tp, data_tg):
        output =  []
        top10g = []
        top10p = []

        for datum_1 in data_tp:
             property_id, reg_domain, pageviews_tp, pagetitle_tp, pageurl_tp, trend_percent, top_rank_tp, visit_date = datum_1
             top10p.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews": pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent})
        
        for datum_2 in data_tg:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_2
            top10g.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews": pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})
        
        visitdate_ = datum_2[7]

        for datum_3 in data_:
             property_id, hostname, users, newUsers, returningUsers, pageviews, time_on_page, bounce_rate, sessions, aveSession, pagesPerSession, aveSessionDuration, visit_date, visit_weekday = datum_3
             if datum_3[12] == visitdate_: 
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g, "topTenPageViews": top10p})
                break;

        jdata =   {
            "output": output
        }   
        logging.info(jdata)
        return jdata, datum_3[0]

# Hourly data output transform
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
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day2')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day2')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day3')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day3')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day4')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day4')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day5')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day5')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day6')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day6')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tpgs_day7')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_1_tgw_day7')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        xcom_data_1 = []
        xcom_data_2 = []
        xcom_data_3 = []

        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day1')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day1')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day2')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day2')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day3')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day3')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day4')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day4')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day5')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day5')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day6')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day6')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        # xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2')
        # xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tpgs_day7')
        # xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_2_tgw_day7')
        # if xcom_data_1 and xcom_data_2 and xcom_data_3:
        #     data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
        #     dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        # xcom_data_1 = []
        # xcom_data_2 = []
        # xcom_data_3 = []
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day1')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day2')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day2')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day3')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day3')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day4')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day4')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day5')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day5')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day6')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day6')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tpgs_day7')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_3_tgw_day7')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        xcom_data_1 = []
        xcom_data_2 = []
        xcom_data_3 = []

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day1')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day2')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day2')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day3')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day3')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day4')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day4')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day5')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day5')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day6')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day6')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tpgs_day7')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_4_tgw_day7')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        xcom_data_1 = []
        xcom_data_2 = []
        xcom_data_3 = []
            
        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day1')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day1')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day2')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day2')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day3')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day3')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day4')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day4')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day5')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day5')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day6')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day6')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)

        xcom_data_1 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5')
        xcom_data_2 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tpgs_day7')
        xcom_data_3 = context['ti'].xcom_pull(task_ids='bigquery_fetch_type2_5_tgw_day7')
        if xcom_data_1 and xcom_data_2 and xcom_data_3:
            data_out, uaid = prepare_outtype2(xcom_data_1, xcom_data_2, xcom_data_3)
            dobs_data_ops.update_output(data_out, uaid, dobs_constants.Analytics_TYPE2)
        xcom_data_1 = []
        xcom_data_2 = []
        xcom_data_3 = []


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