import data_ops
import constants
# import signin.py
import requests

# token = signin.ACCESS_TOKEN
# header_token = {'Authorization': 'Bearer ' + token}

data = [['No Data', 'DTA', 'No Data', 'No Data', 'Citizenship Appointments (Dev)', 'UA-72722909-3'], ['No Data', 'DTA', 'No Data', 'No Data', 'Citizenship Appointments (Live)', 'UA-72722909-1'], ['No Data', 'DTA', 'No Data', 'No Data', 'Content Guide', 'UA-61222473-19'], ['No Data', 'DTA', 'No Data', 'No Data', 'DIBP Import Permits', 'UA-72722909-4'], ['No Data', 'DTA', 'No Data', 'No Data', 'DTA Website', 'UA-61222473-1'], ['No Data', 'DTA', 'No Data', 'No Data', 'DTO Dashboard', 'UA-61222473-3'], ['No Data', 'DTA', 'No Data', 'No Data', 'DTO Intranet', 'UA-61222473-4'], ['No Data', 'DTA', 'No Data', 'No Data', 'Design System', 'UA-61222473-15'], ['No Data', 'DTA', 'No Data', 'No Data', 'Digital Marketplace (dev)', 'UA-72722909-6'], ['No Data', 'DTA', 'No Data', 'No Data', 'Digital Marketplace (live)', 'UA-72722909-5'], ['No Data', 'DTA', 'No Data', 'No Data', 'Domainname.gov.au', 'UA-61222473-13'], ['No Data', 'DTA', 'No Data', 'No Data', 'GOV.AU Alpha', 'UA-72255206-1'], ['No Data', 'DTA', 'No Data', 'No Data', 'Guides', 'UA-98247312-1'], ['No Data', 'DTA', 'No Data', 'No Data', 'Service Handbook', 'UA-61222473-18'], ['No Data', 'DTA', 'No Data', 'No Data', 'Style Manual- Private Beta', 'UA-61222473-26'], ['No Data', 'DTA', 'No Data', 'No Data', 'api.gov.au', 'UA-61222473-22'], ['australia.gov.au', 'DTA', 'Department of Finance', 'No Data', 'australia.gov.au', 'UA-40319091-1'], ['cloud.gov.au', 'DTA', 'Digital Transformation Agency', 'No Data', 'cloud.gov.au', 'UA-61222473-14'], ['community.digital.gov.au', 'DTA', 'Digital Transformation Agency', 'No Data', 'community.digital.gov.au', 'UA-61222473-16'], ['data.gov.au', 'DTA', 'Department of Finance', 'No Data', 'data.gov.au', 'UA-38578922-1'], ['docs.cloud.gov.au', 'DTA', 'Digital Transformation Agency', 'No Data', 'docs.cloud.gov.au', 'UA-61222473-5'], ['No Data', 'DTA', 'No Data', 'No Data', 'lifeevents.digital.gov.au', 'UA-61222473-23'], ['No Data', 'DTA', 'No Data', 'No Data', 'notify.gov.au', 'UA-61222473-21']]


# data_ops.add_agency(constants.AGENCY_DATA)
# Get agency ID
agency_id = data_ops.get_agencyId_by_name(constants.AGENCY_NAME)
print(agency_id)
# print("Hello")

def prepare_data(data_, id_):
        output= []
        for datum in data_:
            domain_name,	agency_name,	agency_dept,	hostname,	service_name,	webproperty_id  = datum
            output.append(
                {"service_name": service_name, "domain": domain_name, "ua_id": webproperty_id, "agencyId": id_}
            )
        return output


data_out = prepare_data(data, agency_id)
# print(data_out)

# Delete properties for a agency
# for item in data_out:
#     print(item["ua_id"])
#     del_res = requests.delete(constants.PROPERTIES_ENDPOINT+ '/' + item["ua_id"], headers=data_ops.header_token)
#     print(del_res.json())

# Add properties
# response = requests.post(
#     constants.PROPERTIES_ENDPOINT, json=data_out, headers=data_ops.header_token)
# print(response.json())