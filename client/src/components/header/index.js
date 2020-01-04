import { h } from "preact";
import { Link, useRoute } from "wouter-preact";
import style from "./style.css";

const ActiveLink = props => {
  const [isActive] = useRoute(props.href);
  return (
    <Link {...props}>
      <a class={isActive ? style.active : ""}>{props.children}</a>
    </Link>
  );
};

const Header = () => (
  <header class={style.header}>
    <h1>Preact App</h1>
    <nav>
      <ActiveLink href="/">Home</ActiveLink>
      <ActiveLink href="/profile">Me</ActiveLink>
      <ActiveLink href="/profile/john">John</ActiveLink>
    </nav>
  </header>
);

export default Header;
