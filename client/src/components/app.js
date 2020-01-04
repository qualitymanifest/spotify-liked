import { h } from "preact";
import { Switch, Route } from "wouter-preact";

import Header from "./header";

// Code-splitting is automated for routes
import Home from "../routes/home";
import Profile from "../routes/profile";

const App = () => (
  <div id="app">
    <Header />
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/profile/">
        <Profile path="/profile/" user="me" />
      </Route>
      <Route path="/profile/:user">
        <Profile path="/profile/:user" />
      </Route>
    </Switch>
  </div>
);

export default App;
