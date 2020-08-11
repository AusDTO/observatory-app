import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Register } from "./components/pages/register/register";
import { Login } from "./components/pages/login";
import { Confirmation } from "./components/pages/confirmation/confirmation";
import { Activated } from "./components/pages/activation/activated";
import { ResendConfirmationEmail } from "./components/pages/resendConfirmation/resend-confirmation";
import { InvalidConfirmation } from "./components/pages/activation/invalid";

const App = (props: any) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/confirmation" exact component={Confirmation} />
        <Route path="/activated" exact component={Activated} />
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
