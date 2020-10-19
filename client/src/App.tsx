import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Register } from "./views/register/register";
import { Login } from "./views/login/login";
import { Confirmation } from "./views/confirmation/confirmation";
import { Activated } from "./views/activation/activated";
import { ResendConfirmationEmail } from "./views/resendConfirmation/resend-confirmation";
import { InvalidConfirmation } from "./views/activation/invalid";
import { AlreadyActivated } from "./views/activation/alreadyActive";
import { Home } from "./views/home";
import { MePage } from "./views/me/me";
import { ProtectedRoute } from "./components/util/protectedRoute";

import { PasswordResetEmailSent } from "./views/forgotPasswordEmail/forgotPasswordSubmitted";
import { PasswordResetEmailPage } from "./views/forgotPasswordEmail/forgotPassword";
import { ResetPasswordPage } from "./views/resetPassword/resetPassword";
import { ServiceLandingController } from "./controller/serviceLandingController/serviceLandingController";
import { ChooseServiceController } from "./controller/chooseServiceController/chooseServiceController";
import { SnapshotController } from "./controller/snapshotController/snapshotcontroller";

const App = (props: any) => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/" exact component={ChooseServiceController} />
        <Route path="/home" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/confirmation" exact component={Confirmation} />
        <Route path="/welcome" exact component={Activated} />
        <Route path="/already-active" exact component={AlreadyActivated} />
        <Route path="/me" exact component={MePage} />
        <Route
          path="/forgot-password"
          exact
          component={PasswordResetEmailPage}
        />
        <Route
          path="/password-reset-email"
          exact
          component={PasswordResetEmailSent}
        />
        <Route
          path="/reset-password/:key"
          exact={true}
          component={ResetPasswordPage}
        />
        <ProtectedRoute
          path="/service/:property_ua_id"
          exact={true}
          component={ServiceLandingController}
        />
        <ProtectedRoute
          path="/service/snapshot/:ua_id"
          exact={true}
          component={SnapshotController}
        />
        <Route
          path="/invalid-confirmation"
          exact
          component={InvalidConfirmation}
        />
        <Route
          path="/resend-confirmation"
          exact
          component={ResendConfirmationEmail}
        />
        <Route path="/" render={() => <div>404</div>} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
