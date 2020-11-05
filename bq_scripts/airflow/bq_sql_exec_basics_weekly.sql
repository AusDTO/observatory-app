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
      create temp table t_exec_basics_prototype_weekly_1
      as
       select
          net.reg_domain(hostname) as reg_domain,
          newUsers,
          returningUsers,
          FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
          FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
        from
          (
            select
              hostname,
              SUM(newUsers) AS newUsers,
              SUM(returningUsers) AS returningUsers
            from
            (
              select
              fullVisitorId,
              hostname,
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
          group by  hostname
          )
        ; 	


      create temp table t_exec_basics_prototype_weekly_2
      as
       select
          net.reg_domain(hostname) as reg_domain,
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
          FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_start,
          FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_end
        from
          (
            select
              hostname,
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
              visitStartTime,
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
          )
              )))
          group by  hostname
          )
        ; 	

create temp table t_prototype_week_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      count(*) as pageviews
    from
    (
      select
      pagePath,
      pagetitle,
      hostname
     from 
     (
      select
      hostname,
      pagePath,
      pagetitle
      from
      (
        select
          fullVisitorId,
          visitStartTime,
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
               and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
             union all
             select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
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
              hits.page.pagePath,
              hits.page.pagetitle
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
              hits.page.pagePath,
              hits.page.pagetitle
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
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
               and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
            )
        )
        )
    )
    group by  pagepath ,pagetitle, hostname;


create temp table t_prototype_preweek_pagetitle_top10
as
    select
      net.reg_domain(hostname) as reg_domain,
      pagePath,
      pagetitle,
      count(*) as pageviews
    from
    (
      select
      pagePath,
      pagetitle,
      hostname
     from 
     (
      select
      hostname,
      pagePath,
      pagetitle
      from
      (
        select
          fullVisitorId,
          visitStartTime,
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
            and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
           union all
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `222282547.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
            and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
           union all
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `170387771.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
            and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
           union all
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `169220999.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
            and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY))
           union all
           select
              fullVisitorId,
              visitStartTime,
              hits.page.hostname as hostname,
              hits.page.pagePath,
              hits.page.pagetitle
            from
              `225103137.ga_sessions_*` AS GA,
              UNNEST(GA.hits) AS hits 
            WHERE
              type = 'PAGE'
            and _table_suffix between FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)) and FORMAT_DATE('%Y%m%d',DATE_SUB(CURRENT_DATE(), INTERVAL 8 DAY)) 
            )
        )
        )
    )
    group by  pagepath ,pagetitle, hostname;


-- Delta rank sites
create temp table temp_topdelta
as
select
  reg_domain,
  pageviews as pageviews_tg,
  pagetitle as pagetitle_tg,
  concat("https://",reg_domain,pagePath) as pageurl_tg,
  growth_percent,
  top_rank as top_rank_tg,
  week_startdate, week_enddate
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
      dense_rank() over (partition by week_startdate, week_enddate,reg_domain  order by week_startdate, week_enddate, delta desc, reg_domain  ) as top_rank,
      row_number() over (partition by week_startdate, week_enddate,reg_domain  order by week_startdate, week_enddate, delta desc, reg_domain  ) as top_row,
      week_startdate, week_enddate
  from (
    select
      wk.reg_domain,
      wk.pageviews,
      wk.pagetitle,
      wk.pagePath,
      wk.pageviews - pre.pageviews as delta,
      round(((wk.pageviews - pre.pageviews)/wk.pageviews)*100,1) as growth_percent,
      FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_startdate,
      FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_enddate
  from
        t_prototype_week_pagetitle_top10 wk
        inner join t_prototype_preweek_pagetitle_top10 pre
          on wk.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
        on wk.reg_domain = prop.hostname
  where wk.pagePath = pre.pagePath
  and wk.pagetitle = pre.pagetitle
  )
)
where 
          top_rank < 11
  and   top_row < 11
  order by  reg_domain, top_rank;



-- top pageview sites
create temp table temp_toppages
as
with pt as 
(
  select
      reg_domain,
      pageviews,
      pagetitle,
      pagePath,
      dense_rank() over (partition by week_startdate, week_enddate,reg_domain  order by week_startdate, week_enddate, pageviews desc, reg_domain  ) as top_rank,
      row_number() over (partition by week_startdate, week_enddate,reg_domain  order by week_startdate, week_enddate, pageviews desc, reg_domain  ) as top_row,
      week_startdate, week_enddate
  from (
    select
      reg_domain,
    --   hostname,
    --   net.public_suffix(hostname) as tld,
      pageviews,
      pagetitle,
      pagePath,
      FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)) as week_startdate,
      FORMAT_DATE('%d%m%Y',DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)) as week_enddate
      -- avg_time_on_page,
      -- total_time_on_page
      -- current_timestamp as record_timestamp
    from t_prototype_week_pagetitle_top10
  )
)
select 
      pt.reg_domain,
      pt.pageviews as pageviews_tp,
      pt.pagetitle as pagetitle_tp,
      concat("https://",pt.reg_domain,pt.pagePath) as pageurl_tp,
      round(((pt.pageviews - pre.pageviews)/pt.pageviews)*100,1) as trend_percent,
      top_rank as top_rank_tp,
      pt.week_startdate,
      pt.week_enddate
from
        pt
        inner join t_prototype_preweek_pagetitle_top10 pre
          on pt.reg_domain = pre.reg_domain
        inner join dta_customers.dta_properties_prototype prop 
          on pt.reg_domain = prop.hostname
  where 
          top_rank < 11
  and   top_row < 11
  and   pt.pagePath = pre.pagePath  
  and   pt.pagetitle = pre.pagetitle
  order by  top_rank;



--     create or replace table dta_customers.exec_basics_prototype_weekly
--           OPTIONS (
--             description = "Weekly executive basics dimensions on daily schedule",
--             expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 23 HOUR)
--     )
--     as
--     select
--           property_id,
--           exec_1.reg_domain as hostname,
--           unique_visitors as users,
--           newUsers,
--           returningUsers,
--           pageviews,
--           time_on_page,
--           bounce_rate*100 as bounce_rate,
--           sessions,
--           aveSession,
--           pagesPerSession ,
--           aveSessionDuration ,
--           td.topTenGrowth,
--           tpgs.topTenPageViews,          
--           exec_1.week_start,
--           exec_1.week_end
--     from 
--       t_exec_basics_prototype_weekly_1 exec_1
--       inner join dta_customers.dta_properties_prototype prop 
--         on exec_1.reg_domain = prop.hostname
--       inner join t_exec_basics_prototype_weekly_2 exec_2
--         on exec_2.reg_domain = prop.hostname  
--       inner join temp_topdelta td
--         on td.reg_domain = prop.hostname
--       inner join temp_toppages tpgs
--         on tpgs.reg_domain = prop.hostname
--     where exec_1.week_start = exec_2.week_start
-- ;


  create or replace table dta_customers.exec_basics_prototype_weekly_99993137_topgrowth
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
              td.pageviews_tg,
              td.pagetitle_tg,
              td.pageurl_tg,
              td.growth_percent,
              td.top_rank_tg,
              exec_1.week_start,
              exec_1.week_end
        from 
          t_exec_basics_prototype_weekly_1 exec_1
          inner join dta_customers.dta_properties_prototype prop 
            on exec_1.reg_domain = prop.hostname
          inner join t_exec_basics_prototype_weekly_2 exec_2
            on exec_2.reg_domain = prop.hostname  
          inner join temp_topdelta td
            on td.reg_domain = prop.hostname
        where prop.property_id = 'UA-61222473-1'
        order by top_rank_tg
;

create or replace table dta_customers.exec_basics_prototype_weekly_99993137_toppages
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
              aveSessionDuration,
              tpgs.pageviews_tp,
              tpgs.pagetitle_tp,
              tpgs.pageurl_tp,
              tpgs.trend_percent,
              tpgs.top_rank_tp,
              exec_1.week_start,
              exec_1.week_end
        from 
          t_exec_basics_prototype_weekly_1 exec_1
          inner join dta_customers.dta_properties_prototype prop 
            on exec_1.reg_domain = prop.hostname
          inner join t_exec_basics_prototype_weekly_2 exec_2
            on exec_2.reg_domain = prop.hostname  
          inner join temp_toppages tpgs
            on tpgs.reg_domain = prop.hostname
        where prop.property_id = 'UA-61222473-1'
        order by top_rank_tp
;



    create or replace table dta_customers.exec_basics_prototype_weekly_222282547_topgrowth
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          td.pageviews_tg,
          td.pagetitle_tg,
          td.pageurl_tg,
          td.growth_percent,
          td.top_rank_tg,  
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_topdelta td
            on td.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-32'
    order by top_rank_tg
    ;

  create or replace table dta_customers.exec_basics_prototype_weekly_222282547_toppages
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          tpgs.pageviews_tp,
          tpgs.pagetitle_tp,
          tpgs.pageurl_tp,
          tpgs.trend_percent,
          tpgs.top_rank_tp,
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_toppages tpgs
            on tpgs.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-32'
    order by top_rank_tp
    ;


    create or replace table dta_customers.exec_basics_prototype_weekly_170387771_topgrowth
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          td.pageviews_tg,
          td.pagetitle_tg,
          td.pageurl_tg,
          td.growth_percent,
          td.top_rank_tg,  
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_topdelta td
            on td.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-15'
    order by top_rank_tg
    ;
  

  create or replace table dta_customers.exec_basics_prototype_weekly_170387771_toppages
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          tpgs.pageviews_tp,
          tpgs.pagetitle_tp,
          tpgs.pageurl_tp,
          tpgs.trend_percent,
          tpgs.top_rank_tp,
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_toppages tpgs
            on tpgs.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-15'
    order by top_rank_tp
    ;

    create or replace table dta_customers.exec_basics_prototype_weekly_169220999_topgrowth
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          td.pageviews_tg,
          td.pagetitle_tg,
          td.pageurl_tg,
          td.growth_percent,
          td.top_rank_tg,  
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_topdelta td
            on td.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-13'
    order by top_rank_tg
    ;

    create or replace table dta_customers.exec_basics_prototype_weekly_169220999_toppages
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          tpgs.pageviews_tp,
          tpgs.pagetitle_tp,
          tpgs.pageurl_tp,
          tpgs.trend_percent,
          tpgs.top_rank_tp,
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_toppages tpgs
            on tpgs.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-13'
    order by top_rank_tp
    ;

   create or replace table dta_customers.exec_basics_prototype_weekly_225103137_topgrowth
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          td.pageviews_tg,
          td.pagetitle_tg,
          td.pageurl_tg,
          td.growth_percent,
          td.top_rank_tg,  
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_topdelta td
            on td.reg_domain = prop.hostname
    where prop.property_id = 'UA-61222473-33'
    order by top_rank_tg
    ;

create or replace table dta_customers.exec_basics_prototype_weekly_225103137_toppages
          OPTIONS (
            description = "Weekly executive basics dimensions on daily schedule",
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
          tpgs.pageviews_tp,
          tpgs.pagetitle_tp,
          tpgs.pageurl_tp,
          tpgs.trend_percent,
          tpgs.top_rank_tp,
          exec_1.week_start,
          exec_1.week_end
    from 
      t_exec_basics_prototype_weekly_1 exec_1
      inner join dta_customers.dta_properties_prototype prop 
        on exec_1.reg_domain = prop.hostname
      inner join t_exec_basics_prototype_weekly_2 exec_2
        on exec_2.reg_domain = prop.hostname
      inner join temp_toppages tpgs
            on tpgs.reg_domain = prop.hostname  
    where prop.property_id = 'UA-61222473-33'
    order by top_rank_tp;

END;
    