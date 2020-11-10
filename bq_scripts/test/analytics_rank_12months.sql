/*
BigQuery SQL Script
Script to output device operating system to interact with agency's websites - Daily Run
*/

/* Schedule: Daily run for full snapshot of agencies' dataset */

BEGIN
    create temp table t_12months_snapshot_opsys_monthlydelta_doi
    as
       select 
        t.device_opsys,
        t.month_year,
        t.opsys_count,
        round((t.opsys_count / (sum(t.opsys_count) over (partition by t.visit_year, t.visit_month order by t.visit_year, t.visit_month)) * 100),2) as percent_month,
        dense_rank() over (partition by t.visit_year, t.visit_month order by t.visit_year, t.visit_month ,t.opsys_count desc) as top_device_opsys,
        t.visit_year,
        t.visit_month
      from (
        select
            coalesce(device_opsys,"unknown") as device_opsys,
            count(distinct fullvisitorid) as opsys_count,
            extract(MONTH from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_month,
            extract(YEAR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_year,
            format_date('%b %Y', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as month_year
    from
    (
/* Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets to get final result set
 */
    select
              fullvisitorid,
              visitStartTime,
              device.operatingSystem as device_opsys
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
             and totals.visits =1 
            union all
    select
              fullvisitorid,
              visitStartTime,
              device.operatingSystem as device_opsys
            from
              `6533313.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
             and totals.visits =1 
            union all
    select
              fullvisitorid,
              visitStartTime,
              device.operatingSystem as device_opsys
            from
              `73191096.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
             and totals.visits =1 
            union all
    select
              fullvisitorid,
              visitStartTime,
              device.operatingSystem as device_opsys
            from
              `103904192.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
             and totals.visits =1 
            union all
    select
              fullvisitorid,
              visitStartTime,
              device.operatingSystem as device_opsys
            from
              `88992271.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
             and totals.visits =1 
/* End - Datasets of agencies' websites */
    )
    GROUP BY   
                        device_opsys,
                        visit_year,
                        visit_month,
                        month_year
    ) as t
   ;

   create or replace table dta_project_ursa_major.device_opsys_yearly_snapshot_month_delta_doi
    OPTIONS (
        description = "Monthly delta snapshot of past 12 months",
        expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
    )
    as
    select
      device_opsys,
      month_year,
      opsys_count,
      percent_month,
      current_timestamp as post_stamp
      from (
            select 
                  device_opsys,
                  month_year,
                  opsys_count,
                  percent_month,
                  visit_year, visit_month
            from  t_12months_snapshot_opsys_monthlydelta_doi  
            where top_device_opsys < 6
            union all
            select  
                  "Others" as device_opsys,
                  month_year,
                  sum(opsys_count) as opsys_count,
                  round(sum(percent_month),2) as percent_month,
                  visit_year, visit_month
            from  t_12months_snapshot_opsys_monthlydelta_doi
            where top_device_opsys > 5
            group by month_year, visit_year, visit_month
    )
    order by 
          visit_year,
          visit_month,
          opsys_count desc
;
    
END;