import { h } from "preact";
import { useContext } from "preact/hooks";
import { Link, useRoute } from "wouter-preact";

import style from "./style.css";
import UserContext from "../../UserContext";

const ActiveLink = props => {
  const [isActive] = useRoute(props.href);
  return (
    <Link {...props}>
      <a class={isActive ? style.active : ""}>{props.children}</a>
    </Link>
  );
};

const loginButton = user => {
  switch (user) {
    case null:
      return "";
    case false:
      return <a href="/auth/spotify">Login with Spotify</a>;
    default:
      return <a href="/auth/logout">Logout</a>;
  }
};

const Header = () => {
  const user = useContext(UserContext);
  console.log(user);
  return (
    <header class={style.header}>
      <h1>Preact App</h1>
      <nav>
        <ActiveLink href="/">Home</ActiveLink>
        <ActiveLink href="/profile">Me</ActiveLink>
        {loginButton(user)}
      </nav>
    </header>
  );
};

export default Header;
