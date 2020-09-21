import requests
# import env
import signin
import constants

token = signin.ACCESS_TOKEN
header_token = {'Authorization': 'Bearer ' + token}


def add_agency(agencyData):
    # data = [{
    #     "name": "DTA Comms",
    #     "emailHosts": ["@dta.gov.au", "@digital.gov.au"]
    # }]
    response = requests.post(constants.AGENCIES_ENDPOINT,
                             json=agencyData, headers=header_token)
    responseData = response.json()
    print(responseData)


def get_agencyId_by_name(agency_name):
    response = requests.get(
        f'{constants.AGENCIES_ENDPOINT}/{agency_name}', headers=header_token)
    responseData = response.json()
    print(responseData)
    if(response.status != 200):
        # handle error, may want to do it another way
        print("ERROR not found")
    else:
        agencyId = responseData.id
        return agencyId


def get_all_agencies():
    response = requests.get(constants.AGENCIES_ENDPOINT,
                            headers=header_token)
    responseData = response.json()
    print(responseData)


def add_property(propertyData):
    # data = [{"service_name": "Design system",
    #          "domain": "www.designsystem.gov.au", "ua_id": "UA-1234", "agencyId": "12s2-213d-h8d9-hhj9"}]
    response = requests.post(
        constants.PROPERTIES_ENDPOINT, json=propertyData, headers=header_token)
    responseData = response.json()
    print(responseData)


def get_all_properties():
    response = requests.get(constants.PROPERTIES_ENDPOINT,
                            headers=header_token)
    responseData = response.json()
    print(responseData)
    return response.raise_for_status()


def get_property_by_uaid(ua_id):
    response = requests.get(f'{constants.PROPERTIES_ENDPOINT}/{ua_id}')
    responseData = response.json()
    print(responseData)
    return responseData
