import React from "react";
import { Brand, AUHeader, Aubtn } from "../../types/auds";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { gql, useMutation, ApolloClient } from "@apollo/client";
import { LogoutUser } from "../../graphql/LogoutUser";

interface Props extends RouteComponentProps {
  isAdmin?: boolean;
}

const Header: React.FC<Props> = ({ isAdmin, history }) => {
  const LOGOUT_MUTATION = gql`
    mutation LogoutUser {
      logout
    }
  `;

  const [logout, { data, loading, error, client }] = useMutation<LogoutUser>(
    LOGOUT_MUTATION
  );

  const handleLogout = async () => {
    const result = await logout();
    await client.resetStore();
    if (result.data && result.data.logout) {
      history.push("/");
    }
  };

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
                link="/home"
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
                  <Aubtn onClick={handleLogout}>Logout</Aubtn>
                )}
              </div>
            </div>
          </div>
        </div>
      </AUHeader>
    </>
  );
};

export default withRouter(Header);
