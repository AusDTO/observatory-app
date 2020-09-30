import React from "react";
import { AuFooter, FooterNav, FooterEnd } from "../../types/auds";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const Footer: React.FC<Props> = () => {
  return (
    <div className="footer-wrapper">
      <div className="au-body au-body--dark">
        <AuFooter dark>
          <div className="container-fluid">
            <FooterNav>
              <div className="row">
                <div className="col-md-offset-1 col-md-8 col-md-push-3">
                  <h4>Community</h4>
                  <ul className="au-link-list au-link-list--inline">
                    <li>
                      <a href="/home">Privacy policy</a>
                    </li>
                    <li>
                      <a href="/home">Source code</a>
                    </li>
                    <li>
                      <a href="/home">Contact us</a>
                    </li>
                  </ul>
                  <FooterEnd>
                    <p>
                      <small>
                        &copy; Commonwealth of Australia,{" "}
                        <a
                          href="https://github.com/govau/ursa-major/blob/master/LICENSE"
                          rel="external license"
                        >
                          MIT licensed.
                        </a>
                        <br />
                        <span>
                          Illusatrations sourced from{" "}
                          <a href="https://icons8.com/ouch/style/marginalia/">
                            icons8
                          </a>
                        </span>
                      </small>
                    </p>
                  </FooterEnd>
                </div>
                <div className="col-md-3 col-md-pull-9">
                  <p className="footer__affiliate">
                    <span>An initiative of the </span>
                    <span>Digital Transformation Agency </span>
                    <span className="footer__affiliate-link">
                      <a
                        className="au-cta-link  au-cta-link--dark"
                        href="https://www.dta.gov.au/our-projects"
                      >
                        More projects
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </FooterNav>
          </div>
        </AuFooter>
      </div>
    </div>
  );
};

export default Footer;
