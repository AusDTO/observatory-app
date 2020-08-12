import React from "react";
import { Brand, AUHeader } from "../../types/auds";
import { Link } from "react-router-dom";

interface Props {}

const Header: React.FC<Props> = () => {
  return (
    <>
      <AUHeader alt>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <Brand
                title={
                  <>
                    ObservatoryApp <span className="header__badge"> alpha</span>
                  </>
                }
                link="/"
                brandImage="https://observatory.service.gov.au/coat-of-arms.svg"
                brandImageAlt="The Australian Government Coat of Arms"
              />
            </div>
            <div className="col-md-4">
              <div className="header-buttons">
                <Link to="/login" className="au-btn au-btn--secondary">
                  Log in
                </Link>
                <Link to="/register" className="au-btn">
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AUHeader>
    </>
  );
};

export default Header;
