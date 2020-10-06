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
TABLE_EXEC_TYPE2 = 'exec_basics_prototype_daily'

AGENCY_NAME = 'DTA'

AGENCY_DATA = [{
            "name": "DTA",
            "emailHosts": ["@dta.gov.au", "@digital.gov.au"]
        }]

# Analytics output types
Analytics_TYPE1 = "exec_weekly"
Analytics_TYPE2 = "exec_daily"
Analytics_TYPE3 = "exec_hourly"