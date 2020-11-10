---------------------------
-- top pageview sites
---------------------------
-- Day 1 and Day 2
create or replace table dta_customers.exec_basics_prototype_daily_225103137_toppages_day1
          OPTIONS (
            description = "Daily executive basics dimensions on daily schedule",
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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
            expiration_timestamp = TIMESTAMP_ADD(current_timestamp, INTERVAL 1 HOUR)
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