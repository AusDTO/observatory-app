import requests
import env
import signin
import constants

token = signin.ACCESS_TOKEN


def read_bq():
    

def add_data(token):
    header_token = {'Authorization': 'Bearer ' + token}
    data = [{
        "name": "DTA Comms",
        "emailHosts": ["@dta.gov.au", "@digital.gov.au"]
        }]
    url_add_data = constants.API_STAGING + '/agencies'
    response = requests.post(url_add_data, json=data, headers=header_token)
    print(response.json())
    response.raise_for_status()


add_data(token)
