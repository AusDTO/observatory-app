import os
from pathlib import Path  # Python 3.6+ only
# from dotenv import load_dotenv
# import env

API_STAGING = "https://observatory-app.apps.y.cld.gov.au/api"
AGENCIES_ENDPOINT = "https://observatory-app.apps.y.cld.gov.au/api/agencies"
PROPERTIES_ENDPOINT = "https://observatory-app.apps.y.cld.gov.au/api/properties"
OUTPUTS_ENDPOINT = "https://observatory-app.apps.y.cld.gov.au/api/output/"


# Using environment variables
# load_dotenv()

# env_path = Path('.') / '.env'
# load_dotenv(dotenv_path=env_path)

# Make sure USERNAME and PASSWORD exist in .env file
# API_USERNAME = os.getenv("USERNAME")
# API_PASSWORD = os.getenv("PASSWORD")


DAGS_DIR = '/home/airflow/gcs/dags/'
if not os.path.isdir(DAGS_DIR):
    DAGS_DIR = '../../dags/'


# BigQuery Variables
DATASET_ID = 'dta_customers'
TABLE_ID = 'dta_ga_accounts'

DATASET_EXEC_BASICS = 'dta_customers'
TABLE_EXEC_TYPE1 = 'exec_basics_prototype_weekly'
TABLE_EXEC_TYPE1_1 = 'exec_basics_prototype_weekly_99993137'
TABLE_EXEC_TYPE1_2 = 'exec_basics_prototype_weekly_222282547'
TABLE_EXEC_TYPE1_3 = 'exec_basics_prototype_weekly_170387771'
TABLE_EXEC_TYPE1_4 = 'exec_basics_prototype_weekly_169220999'
TABLE_EXEC_TYPE1_5 = 'exec_basics_prototype_weekly_225103137'

TABLE_EXEC_TYPE2 = 'exec_basics_prototype_daily'
TABLE_EXEC_TYPE2_1 = 'exec_basics_prototype_daily_99993137'
TABLE_EXEC_TYPE2_2 = 'exec_basics_prototype_daily_222282547'
TABLE_EXEC_TYPE2_3 = 'exec_basics_prototype_daily_170387771'
TABLE_EXEC_TYPE2_4 = 'exec_basics_prototype_daily_169220999'
TABLE_EXEC_TYPE2_5 = 'exec_basics_prototype_daily_225103137'

TABLE_EXEC_TYPE3 = 'exec_basics_prototype_hourly'
TABLE_EXEC_TYPE3_1 = 'exec_basics_prototype_hourly_99993137'
TABLE_EXEC_TYPE3_2 = 'exec_basics_prototype_hourly_222282547'
TABLE_EXEC_TYPE3_3 = 'exec_basics_prototype_hourly_170387771'
TABLE_EXEC_TYPE3_4 = 'exec_basics_prototype_hourly_169220999'
TABLE_EXEC_TYPE3_5 = 'exec_basics_prototype_hourly_225103137'

AGENCY_NAME = 'DTA'

AGENCY_DATA = [{
            "name": "DTA",
            "emailHosts": ["@dta.gov.au", "@digital.gov.au"]
        }]

# Analytics output types
Analytics_TYPE1 = "exec_weekly"
Analytics_TYPE2 = "exec_daily"
Analytics_TYPE3 = "exec_hourly"