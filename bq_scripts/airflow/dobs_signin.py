import requests
import json
import dobs_constants
import logging
from airflow.models import Variable


def daf_login():
    login_data = {"email": Variable.get('DTA_USERNAME'), "password": Variable.get('DTA_PASSWORD')}
    url_login = dobs_constants.API_STAGING + "/admin/login"
    res = requests.post(url_login, json=login_data)
    response = res.json()
    logging.info("DTA analytics tool sign in successful")
    return response["accessToken"]


ACCESS_TOKEN=daf_login()