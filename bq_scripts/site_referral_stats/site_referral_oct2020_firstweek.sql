/*
Dimensions: Top 100 referral sources to gov.au domains
Metrics: users
Time period: weekly since last year October
Data automatically gathered on a weekly basis
*/

create or replace table dta_customers.site_referral_oct_2020_firstweek
          OPTIONS (
            description = "Top ten weekly site referral in first week of October 2020 for whole of government"
    )
as
select 
  traffic_referral,
  total_visitors,
  unique_visitors,
  unique_visitors_approx,
  visit_month,
  visit_year,
  rank() over (partition by visit_month order by total_visitors desc) as peak_traffic_source
from (
  select
        COUNT(fullVisitorId) as total_visitors,
        COUNT(distinct fullVisitorId) as unique_visitors,
        APPROX_COUNT_DISTINCT(fullVisitorId) as unique_visitors_approx,
        -- datetime_diff(datetime(current_timestamp),datetime(timestamp_seconds(min(visitStartTime))), DAY)  as total_days,
        sum(hit_count) as total_hits,
        traffic_source ,
        traffic_medium,
        CONCAT(traffic_medium, ' | ' ,traffic_source) as traffic_referral,
        current_timestamp as posted_timestamp,
        format_date("%b", date(timestamp_seconds(visitStartTime), 'Australia/Sydney')) as visit_month,
        format_date("%Y", date(timestamp_seconds(visitStartTime), 'Australia/Sydney')) as visit_year
    from
    (
/* Start - Datasets of Interest websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets to get final result set
 */
 /*** aeaguide.education.gov.au/ ***/
   select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `79438793.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** trove.nla.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `23233927.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** designsystem.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** jobsearch.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `72008433.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** https://www.idpwd.com.au/ ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `34154705.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** mychild.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `100180008.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.jobjumpstart.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `111564569.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** igt.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `212190958.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** whatsnext.employment.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `100585217.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** ebs.tga.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `88992271.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.employment.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `77614012.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.fsc.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `174497994.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** data.wgea.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `93868316.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** army.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `122418128.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** osb.homeaffairs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `110162521.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** Australia.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `71597546.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** data.gov.au - all data ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `69211100.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** abs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `73191096.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** disabilityadvocacyfinder.dss.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `86149663.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** domainname.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** asic.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `39020822.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** onlineservices.ato.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `121638199.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.dta.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** [STRUCT(dta, )] ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** health.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `169499927.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.asd.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `121386494.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** familyrelationships.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `34938005.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** webarchive.nla.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `70635257.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** trove.nla.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `199921542.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** ga.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `80842702.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** ato.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `114274207.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** ABRWeb ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `178007804.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** catologue.nla.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `6592309.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.aqf.edu.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `149444086.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** cd.defence.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `178909235.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.studentsfirst.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `80703744.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** consultation.business.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `48099294.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** https://serviceproviders.dss.gov.au/ ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `101163468.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** australianjobs.employment.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `124827135.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** engage.dss.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `90974611.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.ihpa.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `82020118.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** nla.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `2802109.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.learningpotential.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `106413345.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** safeworkaustralia.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `179394289.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** beta.abs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `186366587.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.artc.com.au\nAustralian Rail Track Corporation ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `225642503.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** [STRUCT(agency, artc)] ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `225642503.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.studyassist.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `53678167.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** govdex.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `77664740.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** covid19inlanguage.homeaffairs.gov.au (UA-61305954-25) – (View ID: 215803896) ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `215803896.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** maps.inlandrail.com.au/b2g-dec-2018#/\ninland rail map ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `186233756.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** [STRUCT(agency, inland_rail_map)] ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `186233756.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** airforce.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `122829809.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.tradesrecognitionaustralia.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `175869519.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** abcc.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `6533313.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** docs.education.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `77559172.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** jobaccess.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `104411629.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** eduportal.education.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `117867575.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** joboutlook.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `86630641.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** intercountryadoption.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `100832347.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** moneysmart.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `37548566.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** defence.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `5426088.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.education.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `77562775.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** ablis.business.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `78700159.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** defenceindustry.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `162370350.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** https://formerministers.dss.gov.au/ ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `53715324.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** communitybusinesspartnership.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `95014024.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** afsa.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `75255162.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** minister.homeaffairs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `116763821.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** govcms ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `134969186.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** eduportal.education.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `117865571.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** video defence.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `122841309.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** m.directory.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `70856817.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** scamwatch.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `103904192.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** immi.homeaffairs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `177457874.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** api.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `185106319.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** FWBC On Site ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `115980641.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** industry.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `175671120.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** http://www.companioncard.gov.au/ ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `31265425.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** humanservices.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `47586269.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** abr.business.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `94174429.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** librariesaustralia.nla.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `73966990.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** business.dmz.test.tga.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `98362688.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** myato ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `135414613.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** https://plan4womenssafety.dss.gov.au/ ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `104395490.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** news.defence.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `135989789.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** abf.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `177476111.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** Homeaffairs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `100095673.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** betterschools.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `63623150.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.asbfeo.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `118336527.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** Style Manual ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** humanservices.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `5289745.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** superfundlookup.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `94178846.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** rba.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `191126238.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** covid19.homeaffairs.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `214546690.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** dss.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `77084214.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** immi.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `100095166.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** minister.defence.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `6059849.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** guides.dss.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `85844330.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** data.wgea.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `94241432.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** tga.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `129200625.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** banknotes.rba.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `203109603.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** innovation.govspace.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `69522323.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** business.dmz.development.tga.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `98360372.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** business.tga.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `98349897.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** myGov_beta ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `218817760.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.business.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `133849100.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** Career Pathways ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** www.tisnational.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `74070468.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** atrc.com.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `89766970.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
            union all
/*** marketplace.service.gov.au ***/
select
                fullVisitorId,
                visitStartTime,
                totals.hits as hit_count,
                trafficSource.source as traffic_source,
                trafficSource.medium as traffic_medium
            from
              `130142010.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where regexp_contains( hits.page.hostname, "^.*.gov.au$") = TRUE
            and    type = 'PAGE'
            and   totals.visits = 1
            and _table_suffix between '20201001' and '20201007'
            -- and regexp_contains(trafficSource.medium,"referral") = TRUE
/* End - Datasets of Interest websites */
    )
     group by traffic_source, traffic_medium,visit_month,visit_year
  )
    order by peak_traffic_source, visit_year
;


