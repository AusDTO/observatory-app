# Scripts documentation Guide


**Stack**

- [Big query](https://cloud.google.com/bigquery/docs/introduction)
- [Airflow with python](https://airflow.apache.org/docs/stable/)


The scripts in [Airflow folder](https://github.com/AusDTO/observatory-service/tree/site-snapshot-bq-scripts/bq_scripts/airflow) are ready for production
The test folder has scripts for code testing and output data quality check purpose.

The BigQuery scripts are developed and organised to deliver output tables in Google BigQuery by weekly, daily and hourly, optimising the data processing producing cost-effective solution.

The python code is splitted into new and update script for updating the prototype backend RDS

The data pipeline scripts comprises of three modules
1. BigQuery scripts
   a. weekly slice
   b. daily slice
   c. hourly slice
   
2. Python data transformation
   The python file provides following functionalities
   - translating the BigQuery tables into JSON format
   - script to deliver JSON output to RDS using RESTAPI endpoints

3. Airflow DAG schedule
   - tasks run on daily schedule at 6am Sydney/Australia time
   - Airflow DAG tasks for scheduling the data flow
