import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Switch, Route } from "wouter-preact";

import Header from "./header";
import Home from "../routes/home";
import About from "../routes/about";
import Settings from "../routes/settings";
import { fetchUser } from "../utils/requests";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(async () => {
    const user = await fetchUser();
    setUser(user.displayName ? user : false);
  }, []);
  return (
    <div id="app">
      <Header user={user} />
      <Switch>
        <Route path="/">
          <Home user={user} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/settings">
          <Settings user={user} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
