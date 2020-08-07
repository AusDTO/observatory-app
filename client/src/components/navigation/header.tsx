import React from "react";
import { Brand, AUHeader, Aubtn } from "../../types/auds";
import { Link } from "react-router-dom";

interface Props {}

const Header: React.FC<Props> = () => {
  return (
    <>
      <AUHeader alt>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-9">
              <Brand
                title={
                  <>
                    Observatory service{" "}
                    <span className="header__badge"> alpha</span>
                  </>
                }
                subline="Insights"
                link="/"
                brandImage="https://observatory.service.gov.au/coat-of-arms.svg"
                brandImageAlt="The Australian Government Coat of Arms"
              />
            </div>
            <div className="col-md-3">
              <Link to="/login" className="au-btn au-btn--secondary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </AUHeader>
    </>
  );
};

export default Header;
