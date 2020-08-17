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
import { TestRoute } from "./components/pages/testPrivate";

const App = (props: any) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/confirmation" exact component={Confirmation} />
        <Route path="/welcome" exact component={Activated} />
        <Route path="/already-active" exact component={AlreadyActivated} />
        <Route path="/me" exact component={MePage} />
        <ProtectedRoute path="/test-private" component={TestRoute} />

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
