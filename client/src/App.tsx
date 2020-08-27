import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Register } from "./components/pages/register/register";
import { Login } from "./components/pages/login/login";
import { Confirmation } from "./components/pages/confirmation/confirmation";
import { Activated } from "./components/pages/activation/activated";
import { ResendConfirmationEmail } from "./components/pages/resendConfirmation/resend-confirmation";
import { InvalidConfirmation } from "./components/pages/activation/invalid";
import { AlreadyActivated } from "./components/pages/activation/alreadyActive";
import { Home } from "./components/pages/home";
import { MePage } from "./components/pages/me/me";
import { ProtectedRoute } from "./components/util/protectedRoute";

import { PasswordResetEmailSent } from "./components/pages/forgotPasswordEmail/forgotPasswordSubmitted";
import { PasswordResetEmailPage } from "./components/pages/forgotPasswordEmail/forgotPassword";
import { ResetPasswordPage } from "./components/pages/resetPassword/resetPassword";
import { ChooseService } from "./components/pages/chooseService/chooseService";
import { ServiceLandingPage } from "./components/pages/serviceLandingPage/serviceLanding";

const App = (props: any) => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/" exact component={ChooseService} />
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
          path="/service/:uaid"
          exact={true}
          component={ServiceLandingPage}
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
