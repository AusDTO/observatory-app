import React from "react";
import { Brand, AUHeader, Aubtn } from "../../types/auds";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

interface Props {
  isAdmin?: boolean;
}

const Header: React.FC<Props> = ({ isAdmin }) => {
  const LOGOUT_MUTATION = gql`
    mutation LogoutUser {
      logout
    }
  `;

  const [logout, { data, loading, error }] = useMutation(LOGOUT_MUTATION);

  const handleLogout = () => {};

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
                {!isAdmin ? (
                  <>
                    <Link to="/login" className="au-btn au-btn--secondary">
                      Log in
                    </Link>
                    <Link to="/register" className="au-btn">
                      Get started
                    </Link>
                  </>
                ) : (
                  <Aubtn>Logout</Aubtn>
                )}
              </div>
            </div>
          </div>
        </div>
      </AUHeader>
    </>
  );
};

export default Header;
