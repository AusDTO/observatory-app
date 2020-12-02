    /*
      BigQuery script delivering following outputs for analytics prototype tool
      Page URL usage - weekly
      -New users
      -Returning users
      -Ratio of Returning Users/Total Users
      -Average Time on page
      -Mobile users
      -desktop users
      -tablet users
      -organic source
      -referral source
      -other sources
    */

-- Property 1
-- Page URL usage of property UA-61222473-1 - dta.gov.au
Begin

     create temp table t_urlsnap_prototype_weekly_1
      as
       select
          reg_domain,
          CONCAT('www.',reg_domain,pagepath) as pagepath,
          newUsers,
          returningUsers,
          total_users,
          round(returningUsers/total_users,1) as ratio,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
        from
          (
            select
              reg_domain,
              pagepath,
              count(fullvisitorid) as total_users,
              SUM(newUsers) AS newUsers,
              SUM(returningUsers) AS returningUsers
            from
            (
              select
              fullVisitorId,
              coalesce(net.reg_domain(hostname),'') as reg_domain,
              pagepath,
              newUsers,
              returningUsers
            from
            (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      hits.page.pagePath as pagepath,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `99993137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
                      and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
                 )
          )
          group by  reg_domain, pagepath
          )
        ; 	


       create temp table t_urlsnap_prototype_weekly_2
      as
       select
          reg_domain,
          unique_visitors,
          CONCAT('www.',reg_domain,pagepath) as pagepath,
          avg_time_on_page as time_on_page,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
        from
          (
            select
              reg_domain,
              pagePath,
              COUNT(distinct fullVisitorId) as unique_visitors,
              sum(time_on_page) as total_time_on_page,
              avg(time_on_page) as avg_time_on_page
            from
            (
              select
              fullVisitorId,
              visitStartTime,
              pagePath,
              hit_time,
              isExit,
              case
                when isExit is not null then last_interaction - hit_time
                else next_pageview - hit_time
              end as time_on_page,
              coalesce(net.reg_domain(hostname),'') as reg_domain
            from 
            (
              select
              fullVisitorId,
              visitStartTime,
              hostname,
              pagePath,
              hit_time,
              isExit,
              last_interaction,
              lead(hit_time) over (partition by fullVisitorId, visitStartTime order by hit_time) as next_pageview
              from
              (
                select
                  fullVisitorId,
                  visitStartTime,
                  hostname,
                  pagePath,
                  hit_time,
                  isExit,
                  last_interaction
                from
                  (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      hits.page.pagePath as pagepath,
                      hits.hitNumber,
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
                      and regexp_contains(hits.page.pagePath, 'error|search') = FALSE    
                    )
              )))
          group by  reg_domain, pagepath
          )
        ; 	
        
      create temp table t_urlsnap_prototype_weekly_3
    as
      select
            sum(case when device_category in ('mobile') then 1 else 0
                end) as mobile_count,
            sum(case when device_category in ('desktop') then 1 else 0
                end) as desktop_count,
            sum(case when device_category in ('tablet') then 1 else 0
                end) as tablet_count,
            reg_domain,
            CONCAT('www.',reg_domain,pagepath) as pagepath,
            count(fullvisitorid) as device_category_count,
            FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
            FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
      from
        (
/*  Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets
*/
          select
            fullvisitorId,
            visitStartTime,
            device.deviceCategory as device_category,
            hits.page.pagePath as pagepath,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain
          from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
          where hits.type = 'PAGE'
          and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
          and totals.visits =1
          and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        )
      group by reg_domain, pagepath
      ;


    
    create temp table t_urlsnap_prototype_weekly_4
    as
        select
        sum(case 
            when traffic_medium not in ('organic','referral') then 1 else 0
        end ) as traffic_other,
        sum(case 
                when traffic_medium in ('organic') then 1 else 0
            end ) as traffic_organic,
        sum(case 
                when traffic_medium in ('referral') then 1 else 0
            end ) as traffic_referral,
        reg_domain,
        CONCAT('www.',reg_domain,pagepath) as pagepath,
        count(fullvisitorid) as medium_count,
        FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
        FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
    from
    (
/* Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets
 */
       select
            fullvisitorId,
            visitStartTime,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            -- trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        )
      group by reg_domain, pagepath
      ;
         

-- Property 2
-- Storing Page URLs weekly aggregated dimensions in BigQuery
  create or replace table dta_customers.ua_61222473_1_urlpage_usage_weekly
      OPTIONS (
            description = "Weekly url page usage dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
  )
    as
        select
          uw4.week_end as date,
          uw4.pagepath as page_url,
          uw4.traffic_organic as organic,
          uw4.traffic_referral as referral,
          uw4.traffic_other as other,

          uw3.mobile_count as mobile,
          uw3.desktop_count as desktop,
          uw3.tablet_count as tablet,

          uw2.time_on_page,

          uw1.newUsers as new_users,
          uw1.returningUsers as returning_users,
          uw1.ratio
          from t_urlsnap_prototype_weekly_4 uw4
          inner join t_urlsnap_prototype_weekly_3 uw3
            on uw4.reg_domain = uw3.reg_domain and uw4.pagepath = uw3.pagepath
          inner join t_urlsnap_prototype_weekly_2 uw2
            on uw4.reg_domain = uw2.reg_domain and uw4.pagepath = uw2.pagepath
          inner join t_urlsnap_prototype_weekly_1 uw1
            on uw4.reg_domain = uw1.reg_domain and uw4.pagepath = uw1.pagepath;
End;


-- Page URL usage of property UA-61222473-15 - designsystem.gov.au
Begin

     create temp table t_urlsnap_prototype_weekly_1
      as
       select
          reg_domain,
          CONCAT('www.',reg_domain,pagepath) as pagepath,
          newUsers,
          returningUsers,
          total_users,
          round(returningUsers/total_users,1) as ratio,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
        from
          (
            select
              reg_domain,
              pagepath,
              count(fullvisitorid) as total_users,
              SUM(newUsers) AS newUsers,
              SUM(returningUsers) AS returningUsers
            from
            (
              select
              fullVisitorId,
              coalesce(net.reg_domain(hostname),'') as reg_domain,
              pagepath,
              newUsers,
              returningUsers
            from
            (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      hits.page.pagePath as pagepath,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `170387771.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
                      and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
                 )
          )
          group by  reg_domain, pagepath
          )
        ; 	


       create temp table t_urlsnap_prototype_weekly_2
      as
       select
          reg_domain,
          unique_visitors,
          CONCAT('www.',reg_domain,pagepath) as pagepath,
          avg_time_on_page as time_on_page,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
          FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
        from
          (
            select
              reg_domain,
              pagePath,
              COUNT(distinct fullVisitorId) as unique_visitors,
              sum(time_on_page) as total_time_on_page,
              avg(time_on_page) as avg_time_on_page
            from
            (
              select
              fullVisitorId,
              visitStartTime,
              pagePath,
              hit_time,
              isExit,
              case
                when isExit is not null then last_interaction - hit_time
                else next_pageview - hit_time
              end as time_on_page,
              coalesce(net.reg_domain(hostname),'') as reg_domain
            from 
            (
              select
              fullVisitorId,
              visitStartTime,
              hostname,
              pagePath,
              hit_time,
              isExit,
              last_interaction,
              lead(hit_time) over (partition by fullVisitorId, visitStartTime order by hit_time) as next_pageview
              from
              (
                select
                  fullVisitorId,
                  visitStartTime,
                  hostname,
                  pagePath,
                  hit_time,
                  isExit,
                  last_interaction
                from
                  (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      hits.page.pagePath as pagepath,
                      hits.hitNumber,
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
                      and regexp_contains(hits.page.pagePath, 'error|search') = FALSE    
                    )
              )))
          group by  reg_domain, pagepath
          )
        ; 	
        
      create temp table t_urlsnap_prototype_weekly_3
    as
      select
            sum(case when device_category in ('mobile') then 1 else 0
                end) as mobile_count,
            sum(case when device_category in ('desktop') then 1 else 0
                end) as desktop_count,
            sum(case when device_category in ('tablet') then 1 else 0
                end) as tablet_count,
            reg_domain,
            CONCAT('www.',reg_domain,pagepath) as pagepath,
            count(fullvisitorid) as device_category_count,
            FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
            FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
      from
        (
/*  Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets
*/
          select
            fullvisitorId,
            visitStartTime,
            device.deviceCategory as device_category,
            hits.page.pagePath as pagepath,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain
          from
              `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
          where hits.type = 'PAGE'
          and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
          and totals.visits =1
          and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        )
      group by reg_domain, pagepath
      ;


    
    create temp table t_urlsnap_prototype_weekly_4
    as
        select
        sum(case 
            when traffic_medium not in ('organic','referral') then 1 else 0
        end ) as traffic_other,
        sum(case 
                when traffic_medium in ('organic') then 1 else 0
            end ) as traffic_organic,
        sum(case 
                when traffic_medium in ('referral') then 1 else 0
            end ) as traffic_referral,
        reg_domain,
        CONCAT('www.',reg_domain,pagepath) as pagepath,
        count(fullvisitorid) as medium_count,
        FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
        FORMAT_DATE('%F',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
    from
    (
/* Start - Datasets of agencies' websites
    Insert Here Google Analytics Dataset of Websites of Interest and 'Union All' query result sets
 */
       select
            fullvisitorId,
            visitStartTime,
            coalesce(net.reg_domain(hits.page.hostname),'') as reg_domain,
            hits.page.pagePath as pagepath,
            -- trafficSource.source as traffic_source,
            trafficSource.medium as traffic_medium
            from
              `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits
            where hits.type = 'PAGE'
             and regexp_contains(hits.page.hostname, ".*.gov.au$") = true
             and totals.visits =1 
             and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             and regexp_contains(hits.page.pagePath, 'error|search') = FALSE
        )
      group by reg_domain, pagepath
      ;
         

-- Storing Page URLs weekly aggregated dimensions in BigQuery
  create or replace table dta_customers.ua_61222473_15_urlpage_usage_weekly
      OPTIONS (
            description = "Weekly url page usage dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 24 HOUR)
  )
    as
        select
          uw4.week_end as date,
          uw4.pagepath as page_url,
          uw4.traffic_organic as organic,
          uw4.traffic_referral as referral,
          uw4.traffic_other as other,

          uw3.mobile_count as mobile,
          uw3.desktop_count as desktop,
          uw3.tablet_count as tablet,

          uw2.time_on_page,

          uw1.newUsers as new_users,
          uw1.returningUsers as returning_users,
          uw1.ratio
          from t_urlsnap_prototype_weekly_4 uw4
          inner join t_urlsnap_prototype_weekly_3 uw3
            on uw4.reg_domain = uw3.reg_domain and uw4.pagepath = uw3.pagepath
          inner join t_urlsnap_prototype_weekly_2 uw2
            on uw4.reg_domain = uw2.reg_domain and uw4.pagepath = uw2.pagepath
          inner join t_urlsnap_prototype_weekly_1 uw1
            on uw4.reg_domain = uw1.reg_domain and uw4.pagepath = uw1.pagepath;
End;