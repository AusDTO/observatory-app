import React from "react";
import DefaultLayout from "./components/layouts/DefaultLayout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Register } from "./components/pages/register";
import { Login } from "./components/pages/login";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/" render={() => <div>404</div>} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
