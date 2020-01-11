import { h } from "preact";
import { useState } from "preact/hooks";
import { Link } from "wouter-preact";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink
} from "reactstrap";

const loginButton = user => {
  switch (user) {
    case null:
      return "";
    case false:
      return (
        <NavLink href="/auth/spotify" className="mx-auto">
          Login with Spotify
        </NavLink>
      );
    default:
      return (
        <NavLink href="/auth/logout" className="mx-auto">
          Logout
        </NavLink>
      );
  }
};

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <Navbar expand="sm" color="dark" dark fixed="top">
      <NavbarBrand tag={Link} href="/">
        spotify-liked
      </NavbarBrand>
      <NavbarToggler onClick={toggle} aria-controls="responsive-navbar-nav" />
      <Collapse navbar isOpen={isOpen} id="responsive-navbar-nav">
        <Nav navbar className="ml-auto">
          <NavLink onClick={toggle} tag={Link} href="/" className="mx-auto">
            Home
          </NavLink>
          <NavLink
            onClick={toggle}
            tag={Link}
            href="/about"
            className="mx-auto"
          >
            About
          </NavLink>
          {user && (
            <NavLink
              onClick={toggle}
              tag={Link}
              href="/settings"
              className="mx-auto"
            >
              Settings
            </NavLink>
          )}
          {loginButton(user)}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
