import React from "react";
interface Props {}
export const Glossary: React.FC<Props> = () => {
  return (
    <>
      <section className="au-body max-42">
        <h2>Glossary</h2>

        <h3 className="au-inpage-nav-section">
          Pageviews
          <a
            id="pageviews-def"
            className="au-inpage-nav-section-link"
            href="#top"
          >
            Back to top
          </a>
        </h3>
        <dl aria-label="Pageviews">
          <dt>Definition</dt>
          <dd>
            A pageview (or pageview hit, page tracking hit) is an instance of a
            page being loaded in a browser. 'Pageviews' is a metric defined as
            the total number of times a page has been loaded.
          </dd>
          <dt>Explanatioin</dt>
          <dd>
            Pageviews will show you the number of times that a specific page is
            loaded in a time period. It is a useful metric in determining how
            'popular' a page on your property is; a high page view might suggest
            that the page is readily found and viewed (due to things like SEO,
            display prominence on your site, or a good site navigation).
          </dd>
          <dt>Limitations</dt>
          <dd>
            Pageviews do not tell you how many users have visited the page, only
            how many times a page has been viewed.
          </dd>
          <dt>Caution</dt>
          <dd>
            <ul>
              <li>
                Repeated views of a page are counted independently. For example,
                a user who refreshes the page on their browser would create two
                pageviews, not one. Same would apply for users who reload the
                page after being elsewhere on – or off – your site.
              </li>
              <li>
                Pageviews can be artificially inflated by pageview hits from
                bots and web crawlers. Bot filtering settings in Google
                Analytics can help reduce this, but it cannot remove all bots.
              </li>
              <li>
                Pageviews can be inflated if a Google Analytics tracking code is
                installed more than once on the specific page (a Bounce rate
                close to 0.0% is a strong indicator this might be happening).
              </li>
              <li>
                Be wary of equating pageviews with actual number of visitors.
                Cross-reference pageviews with metrics like Users to get a more
                accurate picture of how many times pages may have been viewed.
              </li>
              <li>
                Having a high number of pageviews might not be a positive thing.
                Is it good that you have a lot of views? Does it mean that
                people like to read a lot of pages on your site? Or does it mean
                that they cannot find what they're looking for? Try comparing
                with Unique Pageviews, which is the number of sessions that
                include a view of the page.
              </li>
            </ul>
          </dd>
        </dl>
      </section>
      <section className="au-body max-42 mt-2">
        <h3 className="au-inpage-nav-section">
          Sessions
          <a
            id="sessions-def"
            className="au-inpage-nav-section-link"
            href="#top"
          >
            Back to top
          </a>
        </h3>
        <dl aria-label="Sessions">
          <dt>Definition</dt>
          <dd>
            A session is a grouping of interactions one user takes within a
            given time frame on your website (Google Analytics defaults that
            time frame to 30 minutes.) Whatever the user does on your website
            (browse pages, download resources, complete forms, etc.) before they
            leave is done in one 'session'.
          </dd>
          <dt>Explanation</dt>
          <dd>
            A visitor can have single or multiple sessions when they visit and
            interact with your website, based on the defined session time frame.
            Within a session they may do a variety of things: they could look
            through multiple pages (Pageviews), they could access resources
            (Views), or interact with specifically tracked features on the site
            like forms (Events). Because a session is a combination of
            interactions over a period, it is important to think of a session as
            representing an archetypal user interaction. When using Sessions in
            your analyses, it can help you create hypotheses about common user
            behaviours based on the shape and structure of what you see in their
            sessions. For example, if the number of pageviews are high in a
            session this might suggest users are consuming lots of content (or
            going through multiple stages of a task or investigation). If the
            average time on pages during a session is in decline, this suggests
            people are spending less time looking through content (which could
            be good or bad, depending on context). In this way Sessions help you
            understand the general user experience on your site.
          </dd>
          <dt>Limitations</dt>
          <dd>
            <ul>
              <li>
                Sessions cannot tell you about specific cohorts, or user types,
                if the user type is not defined. Instead, it gives you a general
                overview of what happens within the given time frame.
              </li>
              <li>
                The session cannot determine outcomes of interactions users
                performed on pages for services (unlike e-commerce sites where
                payment for goods could determine the outcome of a sale).
              </li>
            </ul>
          </dd>
          <dt>Caution</dt>
          <dd>
            Sessions also break over midnight, so a person viewing a website at
            11:50pm will have a new session at 12:00am.
          </dd>
        </dl>
      </section>
      <section className="au-body max-42 mt-2">
        <h3 className="au-inpage-nav-section">
          Time on page
          <a
            id="time-on-page-def"
            className="au-inpage-nav-section-link"
            href="#top"
          >
            Back to top
          </a>
        </h3>
        <dl>
          <dt>Definition</dt>
          <dd>
            Average time on page is defined as the average amount of time all
            users spend on a single page.
          </dd>
          <dt>Explanation</dt>
          <dd>
            When users visit a site, Google Analytics tracks the amount of time
            they spend on the site as well as how many pages they visit, and is
            able to create timestamps (a measurement of time) every time users
            change pages. When users change pages, the clock stops ticking and
            captures the length of time the user spent on the page. (It also
            restarts the clock for the next page.) This is how Time on Page is
            captured, and an average time across all visitors can be determined.
            This is particularly useful when you want to understand how long
            users are interacting with a page, and to assess whether the content
            is easily understood, or provides clear call-to-actions that help
            users efficiently navigate the site to achieve their goals.
          </dd>
          <dt>Limitations</dt>
          <dd>
            <ul>
              <li>
                Time on Page is an average, and does not include other
                descriptive statistics like the minimum and maximum time, or
                Standard Deviation.
              </li>
              <li>
                Time on Page cannot tell you anything about the nature of the
                user interaction. It cannot determine whether a user even
                interacted with the page, only that it was open for a period of
                time.
              </li>
              <li>
                Tabbed browsing will affect this metric. If a person logs on to
                a page, changes tabs, then returns to the page and continues
                browsing before the 30-minute Session expiration point it may
                show that the user has spent longer on the page than the actual
                time.
              </li>
            </ul>
          </dd>
          <dt>Caution</dt>
          <dd>
            <ul>
              <li>
                Averages can be skewed significantly by a few rare occurrences –
                especially if the number of views is low. For example, a dozen
                users may look at 'Page X' for 30 seconds, but if a few users
                open the page, leave to go make lunch, and come back 20 minutes
                later, their Time on Page score will skew the average.
              </li>
              <li>
                Not to be confused with Time on Site, which is a sum of all
                pages visited.
              </li>
            </ul>
          </dd>
        </dl>
      </section>
      <section className="au-body max-42 mt-2">
        <h3 className="au-inpage-nav-section">
          Users
          <a id="users-def" className="au-inpage-nav-section-link" href="#top">
            Back to top
          </a>
        </h3>
        <dl aria-label="Users">
          <dt>Definition</dt>
          <dd>
            The metric of 'Users' looks at the total number of users for in a
            specified time range.
          </dd>
          <dt>Explanation</dt>
          <dd>
            A user is a visitor who has initiated a session on your website. The
            moment a person lands on any page of your site, they become a
            'User'are identified as either a new or returning user. (Google
            Analytics differentiates between new and returning users based on
            visitors' browser cookies.). The User metric helps you understand
            how many people, both new and returning, are visiting your site, and
            this gives you an indication of the volume of traffic you are
            receiving. This kind of data is useful if you want to determine
            whether there are peak periods for your service, or if you want to
            monitor increased/decreased interest in your agency's work.
          </dd>
          <dt>Limitations</dt>
          <dd>
            Given the multi-property nature of our environmentengaging with
            government services, we cannot detect a users move from moving
            between domains to domain. Thus, a user from atoservice1.gov.au
            moving to dtaservice2.gov.au would show up as two separate users,
            not as the same person.
          </dd>
          <dt>Caution</dt>
          <dd>
            Again, ifIf yourthe property is not set up to exclude hits from bots
            and web crawlers spiders then they will show up as the Users metric
            will be skewed (especially on which will affect the metrics on low
            traffic pages).
          </dd>
        </dl>
      </section>
    </>
  );
};
