import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Switch, Route } from "wouter-preact";

import Header from "./header";

import Home from "../routes/home";
import Profile from "../routes/profile";
import UserContext from "../UserContext";
import { fetchUser } from "../utils/requests";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(async () => {
    const user = await fetchUser();
    setUser(user.displayName || false);
  }, []);
  return (
    <div id="app">
      <UserContext.Provider value={user}>
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
      </UserContext.Provider>
    </div>
  );
};

export default App;
