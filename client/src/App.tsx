import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./components/util/protectedRoute";
import { ChooseServiceController } from "./controller/chooseServiceController/chooseServiceController";
import { EngagementUrlController } from "./controller/engagementController/engagementcontroller";
import { ServiceLandingController } from "./controller/serviceLandingController/serviceLandingController";
import { SnapshotController } from "./controller/snapshotController/snapshotcontroller";
import { Activated } from "./views/activation/activated";
import { AlreadyActivated } from "./views/activation/alreadyActive";
import { InvalidConfirmation } from "./views/activation/invalid";
import { Confirmation } from "./views/confirmation/confirmation";
import { PasswordResetEmailPage } from "./views/forgotPasswordEmail/forgotPassword";
import { PasswordResetEmailSent } from "./views/forgotPasswordEmail/forgotPasswordSubmitted";
import { Home } from "./views/home";
import { Login } from "./views/login/login";
import { MePage } from "./views/me/me";
import { Register } from "./views/register/register";
import { ResendConfirmationEmail } from "./views/resendConfirmation/resend-confirmation";
import { ResetPasswordPage } from "./views/resetPassword/resetPassword";
import { TimeOnPage } from "./views/urlEngagement/timeOnPage";

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
          path="/service/:ua_id"
          exact={true}
          component={ServiceLandingController}
        />
        <ProtectedRoute
          path="/service/snapshot/:ua_id"
          exact={true}
          component={SnapshotController}
        />
        <ProtectedRoute
          path="/service/engagement/:ua_id"
          exact={true}
          component={EngagementUrlController}
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
        <ProtectedRoute
          path="/metrics/time-on-page"
          component={TimeOnPage}
          exact
        />

        <Route path="/" render={() => <div>404</div>} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
