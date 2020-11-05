# import data_ops
# import constants
# import signin.py
# import requests

# token = signin.ACCESS_TOKEN
# header_token = {'Authorization': 'Bearer ' + token}

data_1 = [
    ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '5047', 'Digital Transformation Agency', 'https://dta.gov.au/', '-2.5', '1', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '922', 'Australian Government Style Manual | Digital Transformation Agency', 'https://dta.gov.au/our-projects/australian-government-style-manual', '1.5', '10', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '2863', 'Australian Defence Force Cyber Gap Program | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/learning-and-development/start-your-digital-career-government/australian-defence-force-cyber-gap-program', '22.1', '2', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '1900', 'Join our team | Digital Transformation Agency', 'https://dta.gov.au/join-our-team', '5.7', '3', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '1155', 'Digital Transformation Strategy | Digital Transformation Agency', 'https://dta.gov.au/digital-transformation-strategy', '4.1', '7', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '1006', 'About us | Digital Transformation Agency', 'https://dta.gov.au/about-us', '-3.2', '8', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '1861', 'Eligible qualifications for the ADF Cyber Gap Program | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/learning-and-development/start-your-digital-career-government/australian-defence-force-cyber-gap-program/eligible-qualifications-adf-cyber-gap-program', '19.5', '4', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '991', 'Digital Service Standard criteria | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/digital-service-standard/digital-service-standard-criteria', '22.2', '9', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '1208', 'About the Digital Service Standard | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/about-digital-service-standard', '20.9', '6', '20201021', '20201027'], ['UA-61222473-1', 'dta.gov.au', '9473', '29817', '28274', '58091', '220.02683930385081', '0.32737144682210156', '12524', '1.3220732608466168', '4.6383743213030977', '1020.5668414244649', '1238', 'Digital Identity | Digital Transformation Agency', 'https://dta.gov.au/our-projects/digital-identity', '-12.8', '5', '20201021', '20201027']
]

data_2 = [['UA-61222473-1', 'dta.gov.au', '1870', 'Australian Defence Force Cyber Gap Program | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/learning-and-development/start-your-digital-career-government/australian-defence-force-cyber-gap-program', '-24.5', '1', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '909', 'Digital Transformation Agency', 'https://dta.gov.au/', '-1.0', '2', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '654', 'Eligible qualifications for the ADF Cyber Gap Program | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/learning-and-development/start-your-digital-career-government/australian-defence-force-cyber-gap-program/eligible-qualifications-adf-cyber-gap-program', '2.4', '3', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '451', 'Join our team | Digital Transformation Agency', 'https://dta.gov.au/join-our-team', '-7.8', '4', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '226', 'Digital Identity | Digital Transformation Agency', 'https://dta.gov.au/our-projects/digital-identity', '-10.6', '6', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '202', 'Digital Service Standard criteria | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/digital-service-standard/digital-service-standard-criteria', '23.8', '7', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '189', 'About the Digital Service Standard | Digital Transformation Agency', 'https://dta.gov.au/help-and-advice/about-digital-service-standard', '12.7', '8', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '180', 'Australian Government Style Manual | Digital Transformation Agency', 'https://dta.gov.au/our-projects/australian-government-style-manual', '5.6', '9', '2020-11-03'], ['UA-61222473-1', 'dta.gov.au', '148', 'The Trusted Digital Identity Framework | Digital Transformation Agency', 'https://dta.gov.au/our-projects/digital-identity/trusted-digital-identity-framework', '7.4', '10', '2020-11-03']]

data_3 = [['UA-61222473-15', 'designsystem.gov.au', '113', '254', '213', '467', '199.60791862955023', '36.220472440944881', '127', '1.1238938053097345', '3.6771653543307088', '733.99132283464542', '2020-11-03', 'Tuesday'], ['UA-61222473-15', 'designsystem.gov.au', '108', '283', '267', '550', '212.09027636363635', '38.636363636363633', '132', '1.2222222222222223', '4.166666666666667', '883.70948484848486', '2020-11-02', 'Monday'], ['UA-61222473-15', 'designsystem.gov.au', '36', '108', '14', '122', '90.5853852459016', '59.45945945945946', '37', '1.0277777777777777', '3.2972972972972974', '298.68694594594587', '2020-11-01', 'Sunday'], ['UA-61222473-15', 'designsystem.gov.au', '42', '83', '78', '161', '108.87868322981365', '48.07692307692308', '52', '1.2380952380952381', '3.0961538461538463', '337.10515384615388', '2020-10-31', 'Saturday'], ['UA-61222473-15', 'designsystem.gov.au', '110', '310', '241', '551', '145.92301996370236', '38.167938931297712', '131', '1.1909090909090909', '4.2061068702290072', '613.7678167938933', '2020-10-30', 'Friday'], ['UA-61222473-15', 'designsystem.gov.au', '150', '228', '361', '589', '207.23880475382009', '45.2513966480447', '179', '1.1933333333333334', '3.2905027932960893', '681.91986592178785', '2020-10-29', 'Thursday'], ['UA-61222473-15', 'designsystem.gov.au', '146', '486', '258', '744', '266.58927822580642', '38.787878787878789', '165', '1.13013698630137', '4.5090909090909088', '1202.0752909090907', '2020-10-28', 'Wednesday']]

# data_ops.add_agency(constants.AGENCY_DATA)
# Get agency ID
# agency_id = data_ops.get_agencyId_by_name(constants.AGENCY_NAME)
# print(agency_id)
# print("Hello")

def prepare_outtype1(data_tp, data_tg):
        output =  []
        top10g = []
        top10p = []
        
        
        for datum_1 in data_tp:
             	property_id,	hostname,	users,	newUsers,	returningUsers,	pageviews,	time_on_page,	bounce_rate,sessions,	aveSession,	pagesPerSession,	aveSessionDuration,	pageviews_tp,	pagetitle_tp,	pageurl_tp,	trend_percent,	top_rank_tp,	week_start,	week_end = datum_1
                top10p.append({"pageUrl": pageurl_tp, "pageTitle": pagetitle_tp, "pageViews" : pageviews_tp, "rank": top_rank_tp, "percentage": trend_percent}
            )

        for datum_2 in data_tg:
            property_id, reg_domain, pageviews_tg, pagetitle_tg, pageurl_tg, growth_percent, top_rank_tg, visit_date = datum_2
            top10g.append({"pageUrl": pageurl_tg, "pageTitle": pagetitle_tg, "pageViews" : pageviews_tg, "rank": top_rank_tg, "percentage": growth_percent})

        date_v = datum_2[7]
        
        for datum_3 in data_3:
            property_id, hostname, users, newUsers, returningUsers, pageviews, time_on_page, bounce_rate, sessions, aveSession, pagesPerSession, aveSessionDuration, visit_date, visit_weekday = datum_3
            if datum_3[12] == date_v:  
                output.append({"date": visit_date, "users": users, "pageViews": pageviews, "timeOnPage": time_on_page, "bounceRate": bounce_rate, "sessions": sessions, "aveSessionsPerUser": aveSession, "pagesPerSession": pagesPerSession, "aveSessionDuration": aveSessionDuration, "newUsers": newUsers, "returningUsers": returningUsers, "topTenGrowth": top10g, "topTenPageViews": top10p})
                break;

        jdata =   {
            "output": output
        }

        print(datum_3[12], datum_2[7], datum_3)
        print("\n\n")  
        # logging.info(jdata)
        return jdata, datum_3[0]


data_out, id_ = prepare_outtype1(data_1, data_2)
print(id_, data_out)
print("\n")

# Delete properties for a agency
# for item in data_out:
#     print(item["ua_id"])
#     del_res = requests.delete(constants.PROPERTIES_ENDPOINT+ '/' + item["ua_id"], headers=data_ops.header_token)
#     print(del_res.json())

# Add properties
# response = requests.post(
#     constants.PROPERTIES_ENDPOINT, json=data_out, headers=data_ops.header_token)
# print(response.json())