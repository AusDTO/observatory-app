    /*
      BigQuery script delivering following outputs for analytics prototype tool
      Basics for executive - weekly, daily, hourly/24hrs
      -pageviews
      -sessions
      -users
      -bounce rate
      -time on page
    */
    BEGIN
      create temp table t_exec_basics_prototype_hourly_1
      as
       select
          reg_domain,
          newUsers,
          returningUsers,
          visit_weekday,
          visit_hour
        from
          (
            select
              reg_domain,
              visit_weekday,
              visit_hour,
              SUM(newUsers) AS newUsers,
              SUM(returningUsers) AS returningUsers
            from
            (
              select
              fullVisitorId,
              coalesce(net.reg_domain(hostname),'') as reg_domain,
              extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
              format_date('%A', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_weekday,
              newUsers,
              returningUsers
            from
            (
        /* Start - Datasets of DTA websites */
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `99993137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `225103137.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `222282547.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `170387771.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
                      case when totals.newVisits=1 then 1 else 0 end as newUsers,
                      case when totals.newVisits is null then 1 else 0 end as returningUsers
                    from
                      `169220999.ga_sessions_*` AS GA,
                      UNNEST(GA.hits) AS hits 
                    WHERE
                      type = 'PAGE'
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
            )
          )
          group by  reg_domain, visit_weekday, visit_hour
          )
        ; 	


      create temp table t_exec_basics_prototype_hourly_2
      as
       select
          reg_domain,
          unique_visitors,
          pageviews,
          avg_time_on_page as time_on_page,
          CASE
            WHEN sessions = 0 THEN 0
            ELSE bounces / sessions
          END AS bounce_rate,
          bounces,
          sessions,
          case when unique_visitors > 0 then sessions/unique_visitors 
          else 0
          end as aveSession,
          case when sessions > 0 then pageviews/sessions
          else 0
          end as pagesPerSession,
           case when sessions > 0 then total_time_on_page/sessions
          else 0
          end as aveSessionDuration,
          visit_weekday,
          visit_hour
        from
          (
            select
              reg_domain,
              visit_weekday,
              visit_hour,
              COUNT(distinct fullVisitorId) as unique_visitors,
              count(*) as pageviews,
              sum(time_on_page) as total_time_on_page,
              avg(time_on_page) as avg_time_on_page,
              SUM(bounces) AS bounces,
              SUM(sessions) AS sessions
            from
            (
              select
              fullVisitorId,
              extract(HOUR from timestamp_seconds(visitStartTime) at Time Zone 'Australia/Sydney') as visit_hour,
              format_date('%A', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_weekday,
              hit_time,
              isExit,
              case
                when isExit is not null then last_interaction - hit_time
                else next_pageview - hit_time
              end as time_on_page,
              coalesce(net.reg_domain(hostname),'') as reg_domain,
              bounces,
              sessions
            from 
            (
              select
              fullVisitorId,
              visitStartTime,
              hostname,
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
                  hostname,
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
                      hits.page.hostname as hostname,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
                  union all
                  select
                      fullVisitorId,
                      visitStartTime,
                      hits.page.hostname as hostname,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) and FORMAT_DATE('%Y%m%d',CURRENT_DATE())
          )
              )))
          group by  reg_domain, visit_weekday, visit_hour
          )
        ; 	


    create or replace table dta_customers.exec_basics_prototype_hourly
          OPTIONS (
            description = "Daily 24hr executive basics dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 23 HOUR)
    )
    as
    select
          property_id,
          exec_1.reg_domain as hostname,
          unique_visitors as users,
          newUsers,
          returningUsers,
          pageviews,
          time_on_page,
          bounce_rate*100 as bounce_rate,
          bounces,
          sessions,
          aveSession,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_hour,
          exec_1.visit_weekday
    from 
       t_exec_basics_prototype_hourly_1 exec_1
    inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
    inner join t_exec_basics_prototype_hourly_2 exec_2
        on exec_2.reg_domain = prop.hostname  
    where exec_1.visit_weekday = exec_2.visit_weekday
      and exec_1.visit_hour = exec_2.visit_hour
    order by hostname, visit_hour;


    create or replace table dta_customers.exec_basics_prototype_hourly_99993137
          OPTIONS (
            description = "Daily 24hr executive basics dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
    )
    as
    select
          property_id,
          exec_1.reg_domain as hostname,
          unique_visitors as users,
          newUsers,
          returningUsers,
          pageviews,
          time_on_page,
          bounce_rate*100 as bounce_rate,
          sessions,
          aveSession,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_hour,
          exec_1.visit_weekday
    from 
       t_exec_basics_prototype_hourly_1 exec_1
    inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
    inner join t_exec_basics_prototype_hourly_2 exec_2
        on exec_2.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-1'
      and exec_1.visit_weekday = exec_2.visit_weekday
      and exec_1.visit_hour = exec_2.visit_hour
    order by hostname, visit_hour;

  create or replace table dta_customers.exec_basics_prototype_hourly_222282547
          OPTIONS (
            description = "Daily 24hr executive basics dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
    )
    as
    select
          property_id,
          exec_1.reg_domain as hostname,
          unique_visitors as users,
          newUsers,
          returningUsers,
          pageviews,
          time_on_page,
          bounce_rate*100 as bounce_rate,
          sessions,
          aveSession,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_hour,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_hourly_1 exec_1
    inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
    inner join t_exec_basics_prototype_hourly_2 exec_2
        on exec_2.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-32'
      and exec_1.visit_weekday = exec_2.visit_weekday
      and exec_1.visit_hour = exec_2.visit_hour
    order by hostname, visit_hour;

  create or replace table dta_customers.exec_basics_prototype_hourly_170387771
          OPTIONS (
            description = "Daily 24hr executive basics dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
    )
    as
    select
          property_id,
          exec_1.reg_domain as hostname,
          unique_visitors as users,
          newUsers,
          returningUsers,
          pageviews,
          time_on_page,
          bounce_rate*100 as bounce_rate,
          sessions,
          aveSession,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_hour,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_hourly_1 exec_1
    inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
    inner join t_exec_basics_prototype_hourly_2 exec_2
        on exec_2.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-15'
      and exec_1.visit_weekday = exec_2.visit_weekday
      and exec_1.visit_hour = exec_2.visit_hour
    order by hostname, visit_hour;

    create or replace table dta_customers.exec_basics_prototype_hourly_169220999
          OPTIONS (
            description = "Daily 24hr executive basics dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
    )
    as
    select
          property_id,
          exec_1.reg_domain as hostname,
          unique_visitors as users,
          newUsers,
          returningUsers,
          pageviews,
          time_on_page,
          bounce_rate*100 as bounce_rate,
          sessions,
          aveSession,
          pagesPerSession,
          aveSessionDuration,
          exec_1.visit_hour,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_hourly_1 exec_1
    inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
    inner join t_exec_basics_prototype_hourly_2 exec_2
        on exec_2.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-13'
      and exec_1.visit_weekday = exec_2.visit_weekday
      and exec_1.visit_hour = exec_2.visit_hour
    order by hostname, visit_hour;

  create or replace table dta_customers.exec_basics_prototype_hourly_225103137
          OPTIONS (
            description = "Daily 24hr executive basics dimensions sliced in an hour on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
    )
    as
    select
          property_id,
          exec_1.reg_domain as hostname,
          unique_visitors as users,
          newUsers,
          returningUsers,
          pageviews,
          time_on_page,
          bounce_rate*100 as bounce_rate,
          sessions,
          aveSession,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_hour,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_hourly_1 exec_1
    inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
    inner join t_exec_basics_prototype_hourly_2 exec_2
        on exec_2.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-33'
      and exec_1.visit_weekday = exec_2.visit_weekday
      and exec_1.visit_hour = exec_2.visit_hour
    order by hostname, visit_hour;

END;
    