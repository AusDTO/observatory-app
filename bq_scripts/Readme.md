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
   - weekly slice
   - daily slice
   - hourly slice

The BigQuery module has SQL scripts that aggregates select dimensions of Agency's GA360 data scheme in BigQuery. The script aggregates each agency website service data with varying time duration of weekly, daily and hourly. The output tables produced by the script are stored in BigQuery for delivery to front-end.

2. Python data transformation
   The python file provides following functionalities
   - translating the BigQuery tables into JSON format
   - script to deliver JSON output to RDS using RESTAPI endpoints

The Airflow python module executes the SQL scripts in BigQuery as mentioned below. The BigQuery output tables are fetched by python script and translated into JSON format. The JSON formatted data is delivered to RDS using RESTAPI for front-end visualisation.

3. Airflow DAG schedule
   - tasks run on daily schedule at 6am Sydney/Australia time
   - Airflow DAG tasks for scheduling the data flow
   

### Environment variable

Add a `.env` in the root directory for Google Cloud credential. Also, the Google Cloud and Airflow credentials keys to be setup in Airflow environment.

```
USERNAME= 
PASSWORD=
AIRFLOW_BUCKET=
GCP_PROJECT=
```
