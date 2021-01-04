# Scripts Documentation Guide

**Stack**

- [BigQuery](https://cloud.google.com/bigquery/docs/introduction)
- [Airflow with Python](https://airflow.apache.org/docs/stable/)

The scripts in the [Airflow folder](https://github.com/AusDTO/observatory-service/tree/develop/bq_scripts/airflow) are ready for production.
The [Test folder](https://github.com/AusDTO/observatory-service/tree/develop/bq_scripts/test) has scripts for code testing and are used to check data quality.

The BigQuery scripts are developed to deliver output tables in Google BigQuery by weekly, daily and hourly slices, optimising data processing for a cost-effective solution.

The python code is split into new and update script for updating the prototype backend RDS.

The data pipeline scripts comprises of three modules:

1. BigQuery scripts

The BigQuery module has SQL scripts that aggregates select dimensions of Agency's GA360 data scheme in BigQuery. The script aggregates each agency website service data with varying time duration of weekly, daily and hourly. The output tables produced by the script are stored in BigQuery for delivery to front-end.

   - weekly slice
   - daily slice
   - hourly slice



2. Python data transformation

The Airflow python module executes the SQL scripts in BigQuery as mentioned below. The BigQuery output tables are fetched by python script and translated into JSON format. The JSON formatted data is delivered to RDS using RESTAPI for front-end visualisation.

   - translating the BigQuery tables into JSON format
   - script to deliver JSON output to RDS using RESTAPI endpoints

3. Airflow DAG schedule
   - tasks run on daily schedule at 6am Sydney/Australia time (AEDT)
   - Airflow DAG tasks for scheduling the data flow

### Environment variable

Add a `.env` in the root directory for Google Cloud credential. Also, the Google Cloud and Airflow credentials keys to be setup in the Airflow environment.

```
USERNAME=
PASSWORD=
AIRFLOW_BUCKET=
GCP_PROJECT=
```
