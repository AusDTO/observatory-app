-- BigQuery SQL script
-- Script for listing Google Analytics account data of agencies of whole of government


create or replace table dta_customers.dta_ga_accounts
as
SELECT  
  coalesce(domain_name, "No Data") as domain_name,
  agency_name,
  coalesce(agency, "No Data") as agency_dept,
  "No Data" as hostname,
  coalesce(service_name, "No Data") as service_name,
  coalesce(ap.ga_id, "No Data") as webproperty_id
FROM `dta-ga-bigquery.dta_customers.domain_agency_map` dap
right join dta_customers.analytics_account_properties_2020_08_dta ap on ap.service_name = dap.domain_name 
where ap.agency_name = 'DTA'
order by service_name;