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
      create temp table t_exec_basics_prototype_daily_1
      as
       select
          net.reg_domain(hostname) as reg_domain,
          newUsers,
          returningUsers,
          visit_weekday,
          visit_date
        from
          (
            select
              hostname,
              visit_weekday,
              visit_date,
              SUM(newUsers) AS newUsers,
              SUM(returningUsers) AS returningUsers
            from
            (
              select
              fullVisitorId,
              hostname,
              format_date('%A', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_weekday,
              format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
            )
          )
          group by  hostname, visit_weekday, visit_date
          )
        ; 	


      create temp table t_exec_basics_prototype_daily_2
      as
       select
          net.reg_domain(hostname) as reg_domain,
          unique_visitors,
          pageviews,
          total_time_on_page,
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
          visit_date
        from
          (
            select
              hostname,
              visit_weekday,
              visit_date,
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
              format_date('%A', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_weekday,
              format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
              hit_time,
              isExit,
              case
                when isExit is not null then last_interaction - hit_time
                else next_pageview - hit_time
              end as time_on_page,
              hostname,
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
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
                      and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          )
              )))
          group by  hostname, visit_weekday, visit_date
          )
        ; 	

-- -------------------------------------------------------------------------
-- Script to extract Seven days pagetitle and pagepath data
-- -------------------------------------------------------------------------

-- Day 1 is latest day of the week
create temp table t_prototype_day1_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;         


-- Day 2
  create temp table t_prototype_day2_pagetitle_top10
  as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       


-- Day 3
create temp table t_prototype_day3_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       

-- Day 4
create temp table t_prototype_day4_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       

-- Day 5
create temp table t_prototype_day5_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       


-- Day 6
create temp table t_prototype_day6_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY))
            union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY))
union all
select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       


-- Day 7
create temp table t_prototype_day7_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
          union all
          select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
         )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       


-- Day 8
create temp table t_prototype_day8_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      visit_date,
      count(*) as pageviews
    from
    (
        select
          fullVisitorId,
          format_date('%F', (date(timestamp_seconds(visitStartTime), 'Australia/Sydney'))) as visit_date,
          hostname,
          pagePath,
          pagetitle
        from
          (
/* Start - Datasets of DTA websites */
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `99993137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
            union all
            select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix = FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
                   )
   )
    group by  pagepath ,pagetitle, hostname, visit_date;       


-- Executive dimensions
  create or replace table dta_customers.exec_basics_prototype_daily_99993137
          OPTIONS (
            description = "Daily 24hr executive basics dimensions of past 7 days on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
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
          aveSession ,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_date,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_daily_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_daily_2 exec_2
        on exec_2.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-1'
    and exec_1.visit_weekday = exec_2.visit_weekday
    and exec_1.visit_date = exec_2.visit_date
    order by hostname, visit_date desc;


---------------------------
-- top pageview sites
---------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day1_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day2_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day2_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day3_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day3_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day4_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day4_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day5_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;  


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day5_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day6_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day6_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day7_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_99993137_toppages_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day7_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day8_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- ---------------------------------
-- top growth of pages delta
-- Delta rank sites
-- ---------------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day1_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day2_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;



-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day2_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day3_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day3_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day4_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day4_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day5_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day5_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day6_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day6_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day7_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_99993137_topgrowth_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day7_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day8_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-1'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Executive dimensions
    create or replace table dta_customers.exec_basics_prototype_daily_222282547
          OPTIONS (
            description = "Daily 24hr executive basics dimensions of past 7 days on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
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
          aveSessionDuration ,
          exec_1.visit_date,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_daily_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_daily_2 exec_2
        on exec_2.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-32'
    and exec_1.visit_weekday = exec_2.visit_weekday
    and exec_1.visit_date = exec_2.visit_date
    order by hostname, visit_date desc;


---------------------------
-- top pageview sites
---------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day1_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day2_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day2_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day3_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day3_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day4_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day4_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day5_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;  


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day5_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day6_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day6_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day7_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_222282547_toppages_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day7_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day8_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- ---------------------------------
-- top growth of pages delta
-- Delta rank sites
-- ---------------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day1_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day2_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;



-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day2_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day3_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day3_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day4_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day4_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day5_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day5_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day6_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day6_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day7_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_222282547_topgrowth_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day7_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day8_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-32'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;



-- Executive dimensions
  create or replace table dta_customers.exec_basics_prototype_daily_170387771
          OPTIONS (
            description = "Daily 24hr executive basics dimensions of past 7 days on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
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
          aveSession ,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_date,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_daily_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_daily_2 exec_2
        on exec_2.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-15'
    and exec_1.visit_weekday = exec_2.visit_weekday
    and exec_1.visit_date = exec_2.visit_date
    order by hostname, visit_date desc;


---------------------------
-- top pageview sites
---------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day1_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day2_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day2_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day3_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day3_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day4_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day4_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day5_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;  


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day5_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day6_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day6_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day7_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_170387771_toppages_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day7_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day8_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- ---------------------------------
-- top growth of pages delta
-- Delta rank sites
-- ---------------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day1_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day2_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;



-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day2_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day3_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day3_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day4_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day4_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day5_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day5_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day6_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day6_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day7_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_170387771_topgrowth_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day7_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day8_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-15'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Executive dimensions
  create or replace table dta_customers.exec_basics_prototype_daily_169220999
          OPTIONS (
            description = "Daily 24hr executive basics dimensions of past 7 days on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
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
          aveSession ,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_date,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_daily_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_daily_2 exec_2
        on exec_2.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-13'
    and exec_1.visit_weekday = exec_2.visit_weekday
    and exec_1.visit_date = exec_2.visit_date
    order by hostname, visit_date desc;


---------------------------
-- top pageview sites
---------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day1_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day2_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day2_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day3_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day3_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day4_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day4_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day5_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;  


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day5_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day6_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day6_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day7_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_169220999_toppages_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day7_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day8_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- ---------------------------------
-- top growth of pages delta
-- Delta rank sites
-- ---------------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day1_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day2_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;



-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day2_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day3_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day3_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day4_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day4_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day5_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day5_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day6_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day6_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day7_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_169220999_topgrowth_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day7_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day8_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-13'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Executive dimensions
  create or replace table dta_customers.exec_basics_prototype_daily_225103137
          OPTIONS (
            description = "Daily 24hr executive basics dimensions of past 7 days on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
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
          aveSession ,
          pagesPerSession ,
          aveSessionDuration ,
          exec_1.visit_date,
          exec_1.visit_weekday
    from 
      t_exec_basics_prototype_daily_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_daily_2 exec_2
        on exec_2.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-33'
    and exec_1.visit_weekday = exec_2.visit_weekday
    and exec_1.visit_date = exec_2.visit_date
    order by hostname, visit_date desc;

---------------------------
-- top pageview sites
---------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day1_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day2_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day2_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day3_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day3_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day4_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
  prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day4_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day5_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;  


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day5_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day6_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day6_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day7_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date, reg_domain  order by visit_date, pageviews desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      visit_date
    from t_prototype_day7_pagetitle_top10
  )
)
select 
      property_id,
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.visit_date
from
        pt
        inner join t_prototype_day8_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where
  prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;


-- ---------------------------------
-- top growth of pages delta
-- Delta rank sites
-- ---------------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day1_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day2_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;



-- Day 2 and Day 3
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day2
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day2_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day3_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 3 and Day 4
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day3
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day3_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day4_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 4 and Day 5
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day4
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day4_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day5_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 5 and Day 6
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day5
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day5_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day6_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 6 and Day 7
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day6
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day6_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day7_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;


-- Day 7 and Day 8
create or replace table dta_customers.exec_basics_prototype_daily_225103137_topgrowth_day7
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 6 HOUR)
  )
as
select
  property_id,
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  visit_date
  -- current_timestamp as record_timestamp
from
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      delta,
      growth_percent,
      dense_rank() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by visit_date,reg_domain  order by visit_date, delta desc, reg_domain  ) as top_row,
      visit_date
  from (
    select
      wd.reg_domain,
      wd.pageviews,
      wd.pagetitle,
      wd.pagePath,
      wd.pageviews - pre.pageviews as delta,
      round(((wd.pageviews - pre.pageviews)/wd.pageviews)*100,1) as growth_percent,
     wd.visit_date
  from
        t_prototype_day7_pagetitle_top10 wd
        inner join dta_customers.dta_properties_prototype prop 
        on wd.reg_domain = prop.hostname
        inner join t_prototype_day8_pagetitle_top10 pre
        on wd.reg_domain = pre.reg_domain
  where wd.pagePath = pre.pagePath
  and wd.pagetitle = pre.pagetitle
  )
) as tpgs
inner join dta_customers.dta_properties_prototype prop   
            on tpgs.reg_domain = prop.hostname
where prop.property_id = 'UA-61222473-33'
  and   top_rank < 11
  and   top_row < 11
  order by  top_rank;
  
END;
    