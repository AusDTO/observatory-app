-- BigQuery SQL script
-- Script for listing Google Analytics account data of agencies of whole of government


create or replace table dta_customers.dta_ga_accounts
as
SELECT 
agency_name,
property_id,
net.reg_domain( property_url ) as reg_domain,
hostname,
property_name as service_name
FROM `dta-ga-bigquery.dta_customers.dta_properties_prototype` 
order by service_name;