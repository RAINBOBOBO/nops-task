import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Segment, Menu, Container } from 'semantic-ui-react';
import UserContext from "../auth/UserContext";
import CountryCodes from "../country-codes/CountryCodes";
import "./Navigation.css";

/** Navigation bar for site. Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. When not,
 * shows link to Login and Signup forms.
 *
 * Rendered by App.
 */

function Navigation({ logout }) {
  const { currentUser } = useContext(UserContext);
  console.debug("Navigation", "currentUser=", currentUser);

  function loggedInNav() {
    return (
        <Menu.Item position="right">
          <Link className="nav-link" to="/" onClick={logout}>
            Log out {currentUser.first_name || currentUser.username}
          </Link>
        </Menu.Item>
    );
  }

  function loggedOutNav() {
    return (
      <>
      <Menu.Item position="right">
        <NavLink id="login-link" to="/login">
          Login
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink id="signup-link" to="/signup">
          Sign Up
        </NavLink>
      </Menu.Item>
      </>
    );
  }

  return (
      <Segment
        inverted
        vertical
        textAlign="center"
        id="nav-segment"
      >
        <Menu
          fixed="top"
          inverted
        >
          <Container>
            <Menu.Item>
              <Link className="navbar-brand" to="/codes">
                Country Codes
              </Link>
            </Menu.Item>
            {currentUser ? loggedInNav() : loggedOutNav()}
          </Container>
        </Menu>
      </Segment>
  );
}

export default Navigation;
