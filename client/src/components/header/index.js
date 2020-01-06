import { h } from "preact";
import { useContext } from "preact/hooks";
import { Link } from "wouter-preact";
import { Navbar, Nav } from "react-bootstrap";
import UserContext from "../../UserContext";

const loginButton = user => {
  switch (user) {
    case null:
      return "";
    case false:
      return (
        <Nav.Link href="/auth/spotify" className="mx-auto">
          Login with Spotify
        </Nav.Link>
      );
    default:
      return (
        <Nav.Link href="/auth/logout" className="mx-auto">
          Logout
        </Nav.Link>
      );
  }
};

const Header = () => {
  const user = useContext(UserContext);
  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" fixed="top">
      <Navbar.Brand as={Link} href="/">
        spotify-liked
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} href="/" className="mx-auto">
            Home
          </Nav.Link>
          <Nav.Link as={Link} href="/about" className="mx-auto">
            About
          </Nav.Link>
          {user && (
            <Nav.Link as={Link} href="/settings" className="mx-auto">
              Settings
            </Nav.Link>
          )}
          {loginButton(user)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
