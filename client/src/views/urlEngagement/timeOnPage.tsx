import React from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
interface Props {}
export const TimeOnPage: React.FC<Props> = () => {
  return (
    <AdminLayout>
      <div className="au-body container">
        <h1>Time on page</h1>
        <section className="mt-2">
          <h3 id="action">Action oriented page</h3>
          <p>
            Action oriented pages usually contain a clear call to action. They
            normally don’t have a lot of text. An example is the "applying for
            abn" page. There is a single prominent call to action which is the
            button with text "Apply or reapply for an ABN".
          </p>
        </section>
        <section>
          <h3 id="content">Content oriented page</h3>
          <p>
            Content oriented pages usually contain large amounts of text that
            users read or go through to find what they are looking for.
          </p>
        </section>

        <section className="max-42">
          <h3>
            My page is action oriented, but the time on page is quite high? Is
            this a problem? What can I do?
          </h3>

          <p>
            If you are having long times on action oriented page over a long
            period of time with large amount of users, here are some
            considerations.
          </p>
          <ul>
            <li>make call to actions clearer and prominent</li>
            <li>conduct a content-review and minimise the amount of content</li>
            <li>
              conduct usability testing on the page and see where users are
              getting lost
            </li>
          </ul>
        </section>
        <section className="max-42">
          <h3>
            My page is content oriented, but the time on page is quite low. Is
            this a problem? What can I do?
          </h3>
          <p>
            If the time on page is quite low on a content page, it’s not
            necessarily a bad thing. It can mean that users are quickly able to
            find the content they are looking for and leave to another page.
          </p>
          <p>
            On the other hand, it could mean they are not on the right page and
            quickly go back to another page. Here are some things you can check.
          </p>

          <ul>
            <li>
              Do the links from other pages on your web service correctly
              describe this page?
            </li>
            <li>
              If there are large amounts of users coming from search engines to
              this page, does the page metadata accurately describe the content
              contained in this page? Often users stumble across a page due to
              the metadata on google search results not accurately describing
              the content in the page.
            </li>
            <li>Content review of the page</li>
          </ul>
        </section>
      </div>
    </AdminLayout>
  );
};
