API_STAGING="https://observatory-app.apps.y.cld.gov.au/api"



## Using environment variables
from dotenv import load_dotenv
load_dotenv()

from pathlib import Path  # Python 3.6+ only
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)
import os

API_USERNAME = os.getenv("USERNAME")
API_PASSWORD = os.getenv("PASSWORD")
