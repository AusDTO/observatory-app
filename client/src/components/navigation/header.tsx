import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { LogoutUser } from "../../graphql/LogoutUser";
import { Aubtn, AUHeader, Brand } from "../../types/auds";
import { ErrorPage } from "../../views/error/error";
import coatOfArms from "./coat-of-arms.svg";

interface Props extends RouteComponentProps {
  isAdmin?: boolean;
  logoUrl?: string;
}

const Header: React.FC<Props> = ({ isAdmin, history, logoUrl }) => {
  const LOGOUT_MUTATION = gql`
    mutation LogoutUser {
      logout
    }
  `;

  const [logout, { loading, error, client }] = useMutation<LogoutUser>(
    LOGOUT_MUTATION
  );
  if (error) {
    return (
      <ErrorPage title="Server error">
        <p>There was an error with the server</p>
      </ErrorPage>
    );
  }

  const handleLogout = async () => {
    const result = await logout();
    if (loading) {
      return null;
    }
    await client.resetStore();
    if (result.data && result.data.logout) {
      history.push("/");
    }
  };

  return (
    <>
      <AUHeader dark>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <Brand
                title={
                  <>
                    ObservatoryApp <span className="header__badge"> alpha</span>
                  </>
                }
                link={logoUrl ? "/" : "/home"}
                brandImage={coatOfArms}
                brandImageAlt="The Australian Government Coat of Arms"
              />
            </div>
            <div className="col-md-4">
              <div className="header-buttons">
                {!isAdmin ? (
                  <>
                    <Link
                      to="/login"
                      className="au-btn au-btn--dark au-btn--secondary"
                    >
                      Log in
                    </Link>
                    <Link to="/register" className="au-btn au-btn--bright">
                      Register
                    </Link>
                  </>
                ) : (
                  <Aubtn
                    className="au-btn au-btn--secondary au-btn--dark"
                    onClick={handleLogout}
                  >
                    Logout
                  </Aubtn>
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
