import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Switch, Route } from "wouter-preact";

import Header from "./header";
import Home from "../routes/home";
import About from "../routes/about";
import Settings from "../routes/settings";
import ToastContainer from "./toastContainer";
import { fetchUser } from "../utils/requests";

const App = () => {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState({});
  const addToast = toast => {
    const toastId = Math.random()
      .toString()
      .substr(2);
    setToasts(prevToasts => {
      return { [toastId]: toast, ...prevToasts };
    });
  };
  const deleteToast = toastId => {
    setToasts(prevToasts => {
      delete prevToasts[toastId];
      return { ...prevToasts };
    });
  };
  useEffect(async () => {
    const user = await fetchUser();
    setUser(user.displayName ? user : false);
  }, []);
  return (
    <div id="app">
      <Header user={user} />
      <ToastContainer toasts={toasts} deleteToast={deleteToast} />
      <Switch>
        <Route path="/">
          <Home user={user} addToast={addToast} />
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
