    /*
      BigQuery script delivering following knowledge product #3 outputs for analytics prototype tool
      Peak hour demand service usage - weekly aggregation
      -pageViews
      -sessions
      -time on page
      -Pages per session
      -Top ten traffic sources
      -Top ten pages visited

      BigQuery schedule: kp3_peakhour_demand_usage_weekly
    */
    BEGIN

      create temp table t_peakseries_kp3_weekly
      as
       select
          reg_domain,
          pageViews,
          sessions,
          visit_hour,
          dense_rank() over (PARTITION BY reg_domain order by pageViews desc, sessions desc) as peakRank
        from
          (
            select
              reg_domain,
              visit_hour,
              count(*) as pageViews,
              SUM(sessions) AS sessions
            from
            (
              select
              reg_domain,
              extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
              sessions
            from 
              (
                select
                  fullVisitorId,
                  visitStartTime,
                  reg_domain,
                  CASE
                  WHEN hitNumber = first_hit THEN visits
                  ELSE 0
                  END AS sessions
                from
                  (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.visits,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                  from
                      `99993137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                  WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))        
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.visits,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `222282547.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.visits,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `170387771.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.visits,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `169220999.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.visits,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `225103137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))           
          )
          where reg_domain in (select hostname from dta_customers.dta_properties_prototype)
              ))
          group by  reg_domain, visit_hour
          )
          -- order by reg_domain, peakRank
        ; 	


-- peak demand hour dimensions 
create temp table t_peakhour_weekly_1
      as
       select
          reg_domain,
          unique_visitors,
          pageViews,
          avg_time_on_page as timeOnPage,
          sessions,
          case when unique_visitors > 0 then sessions/unique_visitors 
          else 0
          end as aveSession,
          case when sessions > 0 then pageViews/sessions
          else 0
          end as pagesPerSession,
           case when sessions > 0 then total_time_on_page/sessions
          else 0
          end as aveSessionDuration,
          visit_hour,
          rank() over (PARTITION BY reg_domain order by reg_domain, pageViews desc, sessions desc) as peakRank
        from
          (
            select
              reg_domain,
              visit_hour,
              COUNT(distinct fullVisitorId) as unique_visitors,
              count(*) as pageViews,
              sum(time_on_page) as total_time_on_page,
              avg(time_on_page) as avg_time_on_page,
              SUM(sessions) AS sessions
            from
            (
              select
              fullVisitorId,
              visit_hour,
              hit_time,
              isExit,
              case
                when isExit is not null then last_interaction - hit_time
                else next_pageview - hit_time
              end as time_on_page,
              reg_domain,
              bounces,
              sessions
            from 
            (
              select
              fullVisitorId,
              visit_hour,
              reg_domain,
              hit_time,
              isExit,
              last_interaction,
              lead(hit_time) over (partition by fullVisitorId, visitStartTime order by hit_time) as next_pageview,
              bounces,
              sessions
              from
              (
                select
                  fullVisitorId,
                  visitStartTime,
                  visit_hour,
                  reg_domain,
                  hit_time,
                  isExit,
                  last_interaction,
                  CASE
                  WHEN hitNumber = first_interaction THEN bounces
                  ELSE 0
                  END AS bounces,
                  CASE
                  WHEN hitNumber = first_hit THEN visits
                  ELSE 0
                  END AS sessions
                from
                  (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.bounces,
                      totals.visits,
                      coalesce(cast(hits.isExit as string),"") as isExit,
                      hits.time/1000 as hit_time,
                      max( if( hits.isInteraction is not null, hits.time/1000, 0 ) ) over
                      (partition by fullVisitorId, visitStartTime) as last_interaction,
                      MIN(IF(hits.isInteraction IS NOT NULL,
                        hits.hitNumber,0)) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_interaction,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `99993137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.bounces,
                      totals.visits,
                      coalesce(cast(hits.isExit as string),"") as isExit,
                      hits.time/1000 as hit_time,
                      max( if( hits.isInteraction is not null, hits.time/1000, 0 ) ) over
                      (partition by fullVisitorId, visitStartTime) as last_interaction,
                      MIN(IF(hits.isInteraction IS NOT NULL,
                        hits.hitNumber,0)) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_interaction,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `222282547.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))   
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.bounces,
                      totals.visits,
                      coalesce(cast(hits.isExit as string),"") as isExit,
                      hits.time/1000 as hit_time,
                      max( if( hits.isInteraction is not null, hits.time/1000, 0 ) ) over
                      (partition by fullVisitorId, visitStartTime) as last_interaction,
                      MIN(IF(hits.isInteraction IS NOT NULL,
                        hits.hitNumber,0)) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_interaction,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `170387771.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))   
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.bounces,
                      totals.visits,
                      coalesce(cast(hits.isExit as string),"") as isExit,
                      hits.time/1000 as hit_time,
                      max( if( hits.isInteraction is not null, hits.time/1000, 0 ) ) over
                      (partition by fullVisitorId, visitStartTime) as last_interaction,
                      MIN(IF(hits.isInteraction IS NOT NULL,
                        hits.hitNumber,0)) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_interaction,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `169220999.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))   
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
                      coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
                      hits.hitNumber,
                      totals.bounces,
                      totals.visits,
                      coalesce(cast(hits.isExit as string),"") as isExit,
                      hits.time/1000 as hit_time,
                      max( if( hits.isInteraction is not null, hits.time/1000, 0 ) ) over
                      (partition by fullVisitorId, visitStartTime) as last_interaction,
                      MIN(IF(hits.isInteraction IS NOT NULL,
                        hits.hitNumber,0)) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_interaction,
                      MIN(hits.hitNumber) OVER (PARTITION BY fullVisitorId, visitStartTime) AS first_hit
                    from
                      `225103137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))   
          )
          where reg_domain in (select hostname from dta_customers.dta_properties_prototype)
          and visit_hour in (select visit_hour from t_peakseries_kp3_weekly where peakRank = 1)
              )))
    group by  reg_domain, visit_hour
  )
  -- order by reg_domain, peakRank
  ; 	


-- peak demand hour traffic source for top ten listing
    create temp table t_peakhour_weekly_2
    as
     select 
      reg_domain,
      peakCount,
      peakTraffic,
      visit_hour
     from 
     (
     select
        reg_domain,
        count(*) as peakCount,
        CONCAT(traffic_medium, ' | ' ,traffic_source) as peakTraffic,
         visit_hour
    from
    (
/* Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets
 */
       select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE     
        )
    where reg_domain in (select hostname from dta_customers.dta_properties_prototype)
    and visit_hour in (select visit_hour from t_peakseries_kp3_weekly where peakRank = 1)
    group by reg_domain, visit_hour , peakTraffic
     )
    -- order by peakCount desc
  ;


-- peak demand hour visited pages for top ten listing
create temp table t_peakhour_weekly_3
    as
    select
      reg_domain,
      peakCount,
      visited_page,
      pageTitle,
      visit_hour
    from (
     select
        reg_domain,
        count(*) as peakCount,
        pageTitle,
        CONCAT('https://www.',reg_domain,pagepath) as visited_page,
        visit_hour
    from
    (
/* Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets
 */
       select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            hits.page.pagetitle as pageTitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            hits.page.pagetitle as pageTitle
            from
              `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            hits.page.pagetitle as pageTitle
            from
              `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            hits.page.pagetitle as pageTitle
            from
              `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        union all     
        select
            fullvisitorId,
            extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            hits.page.pagetitle as pageTitle
            from
              `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        )
    where reg_domain in (select hostname from dta_customers.dta_properties_prototype)
    and visit_hour in (select visit_hour from t_peakseries_kp3_weekly where peakRank = 1)
    group by reg_domain, pagepath, visit_hour, pageTitle
    )
    -- order by peakCount desc
 ;


--
-- Shaping dataset for web analytics of each property
--

-- Property 1 dta.gov.au
    create or replace table dta_customers.ua_61222473_1_peakseries_24hrs_weekly
          OPTIONS (
            description = "Weekly 24hr peak series sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.pageViews,
          peak_hr.sessions,
          peak_hr.visit_hour,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-1'
    order by visit_hour;


    create or replace table dta_customers.ua_61222473_1_peakdemand_24hrs_weekly_1
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          peak_hr.pageViews,
          peak_hr.sessions,
          phw1.timeOnPage,
          phw1.aveSession,
          phw1.pagesPerSession,
          phw1.aveSessionDuration,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_1 phw1
        on peak_hr.reg_domain = phw1.reg_domain and peak_hr.visit_hour = phw1.visit_hour
    where prop.property_id = 'UA-61222473-1'
    and peak_hr.reg_domain = 'dta.gov.au' and peak_hr.peakRank =1
    ;


create or replace table dta_customers.ua_61222473_1_peakdemand_24hrs_weekly_2
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw2.peakTraffic,
          phw2.peakCount,
          rank() over (PARTITION BY phw2.reg_domain order by phw2.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_2 phw2
        on peak_hr.reg_domain = phw2.reg_domain and peak_hr.visit_hour = phw2.visit_hour
    where prop.property_id = 'UA-61222473-1'
    and peak_hr.reg_domain = 'dta.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;

create or replace table dta_customers.ua_61222473_1_peakdemand_24hrs_weekly_3
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw3.pageTitle,
          phw3.visited_page as pageUrl,
          phw3.peakCount as pageCount,
          rank() over (PARTITION BY phw3.reg_domain order by phw3.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_3 phw3
        on peak_hr.reg_domain = phw3.reg_domain and peak_hr.visit_hour = phw3.visit_hour
    where prop.property_id = 'UA-61222473-1'
    and peak_hr.reg_domain = 'dta.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;


-- Property 2 domainname.gov.au
    create or replace table dta_customers.ua_61222473_13_peakseries_24hrs_weekly
          OPTIONS (
            description = "Weekly 24hr peak series sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.pageViews,
          peak_hr.sessions,
          peak_hr.visit_hour,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-13'
    order by visit_hour;


    create or replace table dta_customers.ua_61222473_13_peakdemand_24hrs_weekly_1
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          peak_hr.pageViews,
          peak_hr.sessions,
          phw1.timeOnPage,
          phw1.aveSession,
          phw1.pagesPerSession,
          phw1.aveSessionDuration,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_1 phw1
        on peak_hr.reg_domain = phw1.reg_domain and peak_hr.visit_hour = phw1.visit_hour
    where prop.property_id = 'UA-61222473-13'
    and peak_hr.reg_domain = 'domainname.gov.au' and peak_hr.peakRank =1
    ;


create or replace table dta_customers.ua_61222473_13_peakdemand_24hrs_weekly_2
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw2.peakTraffic,
          phw2.peakCount,
          rank() over (PARTITION BY phw2.reg_domain order by phw2.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_2 phw2
        on peak_hr.reg_domain = phw2.reg_domain and peak_hr.visit_hour = phw2.visit_hour
    where prop.property_id = 'UA-61222473-13'
    and peak_hr.reg_domain = 'domainname.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;

create or replace table dta_customers.ua_61222473_13_peakdemand_24hrs_weekly_3
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw3.pageTitle,
          phw3.visited_page as pageUrl,          
          phw3.peakCount as pageCount,
          rank() over (PARTITION BY phw3.reg_domain order by phw3.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_3 phw3
        on peak_hr.reg_domain = phw3.reg_domain and peak_hr.visit_hour = phw3.visit_hour
    where prop.property_id = 'UA-61222473-13'
    and peak_hr.reg_domain = 'domainname.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;

-- Property 3 designsystem.gov.au
    create or replace table dta_customers.ua_61222473_15_peakseries_24hrs_weekly
          OPTIONS (
            description = "Weekly 24hr peak series sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.pageViews,
          peak_hr.sessions,
          peak_hr.visit_hour,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-15'
    order by visit_hour;


    create or replace table dta_customers.ua_61222473_15_peakdemand_24hrs_weekly_1
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          peak_hr.pageViews,
          peak_hr.sessions,
          phw1.timeOnPage,
          phw1.aveSession,
          phw1.pagesPerSession,
          phw1.aveSessionDuration,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_1 phw1
        on peak_hr.reg_domain = phw1.reg_domain and peak_hr.visit_hour = phw1.visit_hour
    where prop.property_id = 'UA-61222473-15'
    and peak_hr.reg_domain = 'designsystem.gov.au' and peak_hr.peakRank =1
    ;


create or replace table dta_customers.ua_61222473_15_peakdemand_24hrs_weekly_2
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw2.peakTraffic,
          phw2.peakCount,
          rank() over (PARTITION BY phw2.reg_domain order by phw2.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_2 phw2
        on peak_hr.reg_domain = phw2.reg_domain and peak_hr.visit_hour = phw2.visit_hour
    where prop.property_id = 'UA-61222473-15'
    and peak_hr.reg_domain = 'designsystem.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;

create or replace table dta_customers.ua_61222473_15_peakdemand_24hrs_weekly_3
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw3.pageTitle,
          phw3.visited_page as pageUrl,          
          phw3.peakCount as pageCount,
          rank() over (PARTITION BY phw3.reg_domain order by phw3.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_3 phw3
        on peak_hr.reg_domain = phw3.reg_domain and peak_hr.visit_hour = phw3.visit_hour
    where prop.property_id = 'UA-61222473-15'
    and peak_hr.reg_domain = 'designsystem.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;


-- Property 4 stylemanual.gov.au
    create or replace table dta_customers.ua_61222473_33_peakseries_24hrs_weekly
          OPTIONS (
            description = "Weekly 24hr peak series sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.pageViews,
          peak_hr.sessions,
          peak_hr.visit_hour,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-33'
    order by visit_hour;


    create or replace table dta_customers.ua_61222473_33_peakdemand_24hrs_weekly_1
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          peak_hr.pageViews,
          peak_hr.sessions,
          phw1.timeOnPage,
          phw1.aveSession,
          phw1.pagesPerSession,
          phw1.aveSessionDuration,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_1 phw1
        on peak_hr.reg_domain = phw1.reg_domain and peak_hr.visit_hour = phw1.visit_hour
    where prop.property_id = 'UA-61222473-33'
    and peak_hr.reg_domain = 'stylemanual.gov.au' and peak_hr.peakRank =1
    ;


create or replace table dta_customers.ua_61222473_33_peakdemand_24hrs_weekly_2
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw2.peakTraffic,
          phw2.peakCount,
          rank() over (PARTITION BY phw2.reg_domain order by phw2.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_2 phw2
        on peak_hr.reg_domain = phw2.reg_domain and peak_hr.visit_hour = phw2.visit_hour
    where prop.property_id = 'UA-61222473-33'
    and peak_hr.reg_domain = 'stylemanual.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;

create or replace table dta_customers.ua_61222473_33_peakdemand_24hrs_weekly_3
          OPTIONS (
            description = "Weekly 24hr peak demand dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
    )
    as
    select
          property_id as propertyId,
          peak_hr.reg_domain as hostname,
          peak_hr.visit_hour,
          phw3.pageTitle,
          phw3.visited_page as pageUrl,          
          phw3.peakCount as pageCount,
          rank() over (PARTITION BY phw3.reg_domain order by phw3.reg_domain, peakCount desc) as peakRank,
          FORMAT_DATE('%m-%d-%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as lastDay
    from 
       t_peakseries_kp3_weekly peak_hr
    inner join dta_customers.dta_properties_prototype prop 
        on peak_hr.reg_domain = prop.hostname
    inner join t_peakhour_weekly_3 phw3
        on peak_hr.reg_domain = phw3.reg_domain and peak_hr.visit_hour = phw3.visit_hour
    where prop.property_id = 'UA-61222473-33'
    and peak_hr.reg_domain = 'stylemanual.gov.au' and peak_hr.peakRank =1
    and peakRank < 11
    order by peakRank
    ;

END;
    