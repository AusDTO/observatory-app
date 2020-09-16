import requests
import json
import env
import constants


def daf_login():
    login_data = {"email": env.DTA_USERNAME, "password": env.DTA_PASSWORD}
    url_login = constants.API_STAGING + "/admin/login"
    # logging.info(url_q)
    res = requests.post(url_login, json=login_data)
    response = res.json()
    return response["accessToken"]


ACCESS_TOKEN=daf_login()