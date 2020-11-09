# Scripts documentation Guide


**Stack**

- [Big query](https://cloud.google.com/bigquery/docs/introduction)
- [Airflow with python](https://airflow.apache.org/docs/stable/)


The scripts in Airflow folder are ready for production
The test folder has scripts for code testing and output data quality check purpose.



The data pipeline scripts comprises of three modules
1. BigQuery scripts
2. Python data transformation
3. Airflow DAG schedule

The BigQuery scripts are organised to deliver output tables in Google BigQuery by weekly, daily and hourly.

The python code is splitted into new and update script for updating the prototype backend RDS

The python file provides following functionalities
- Airflow DAG tasks for scheduling the data flow 
- Translating the BigQuery tables into JSON format
- Delivering data using RESTAPI endpoints to backend RDS service
