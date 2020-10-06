import requests
import dobs_signin
import dobs_constants
import logging

token = dobs_signin.ACCESS_TOKEN
header_token = {'Authorization': 'Bearer ' + token}


def add_agency(agencyData):
    response = requests.post(dobs_constants.AGENCIES_ENDPOINT,
                             json=agencyData, headers=header_token)
    responseData = response.json()
    if responseData['statusCode'] != '400':
        logging.info('Error: ' + responseData['message'])
    else:
        logging.info("Data output written successfully: " + responseData)


def get_agencyId_by_name(agency_name):
    # logging.info(header_token)
    response = requests.get(
        f'{dobs_constants.AGENCIES_ENDPOINT}/{agency_name}', headers=header_token)
    responseData = response.json()
    agencyId = responseData['id']
    return agencyId


def get_all_agencies():
    response = requests.get(dobs_constants.AGENCIES_ENDPOINT,
                            headers=header_token)
    responseData = response.json()
    print(responseData)


def add_property(propertyData):
    response = requests.post(
        dobs_constants.PROPERTIES_ENDPOINT, json=propertyData, headers=header_token)
    responseData = response.json()
    if responseData['statusCode'] != '400':
        logging.info('Error: ' + responseData['message'])
    else:
        logging.info("Data output written successfully: " + responseData)


def get_all_properties():
    response = requests.get(dobs_constants.PROPERTIES_ENDPOINT,
                            headers=header_token)
    responseData = response.json()
    print(responseData)
    return response.raise_for_status()


def get_property_by_uaid(ua_id):
    response = requests.get(f'{dobs_constants.PROPERTIES_ENDPOINT}/{ua_id}')
    responseData = response.json()
    logging.info(responseData)
    return responseData


def delete_property_by_uaid(ua_id):
    del_res = requests.delete(dobs_constants.PROPERTIES_ENDPOINT+ '/' + ua_id, headers=header_token)
    logging.info(del_res.json())


def add_output(outData, uaid):
    response = requests.post(
        dobs_constants.OUTPUTS_ENDPOINT + uaid, json=outData, headers=header_token)
    responseData = response.json()
    if responseData['statusCode'] != '400':
        logging.info('Error: ' + responseData['message'])
    else:
        logging.info("Data output written successfully: " + responseData)