import os
from pathlib import Path  # Python 3.6+ only
from dotenv import load_dotenv

API_STAGING = "https://observatory-app.apps.y.cld.gov.au/api"
AGENCIES_ENDPOINT = "https://observatory-app.apps.y.cld.gov.au/api/agencies"
PROPERTIES_ENDPOINT = "https://observatory-app.apps.y.cld.gov.au/api/properties"


# Using environment variables
load_dotenv()

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Make sure USERNAME and PASSWORD exist in .env file
API_USERNAME = os.getenv("USERNAME")
API_PASSWORD = os.getenv("PASSWORD")
