import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Switch, Route } from "wouter-preact";

import Header from "./header";
import Home from "../routes/home";
import About from "../routes/about";
import Settings from "../routes/settings";
import ToastContainer from "./toastContainer";
import { fetchUser } from "../utils/requests";

// Prevents several mobile browser issues w/ quickscroll:
// 1. iOS Safari would not recognize quickscroll touch events after a native
// scroll, until you interacted with another element or scrolled such that
// it toggled the menu bar.
// 2. iOS Firefox would often allow quickscroll touchmoves to pass through
const handleTouchStart = e => {
  if (e.target.dataset.letter) {
    e.preventDefault();
  }
};

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
    <div onTouchStart={handleTouchStart} id="app">
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
