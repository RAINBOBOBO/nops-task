import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Container, Segment, Header, Button } from "semantic-ui-react";
import "./Homepage.css";
import UserContext from "../auth/UserContext";

/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
  const { currentUser } = useContext(UserContext);

  const history = useHistory();

  function routeToLogin() {
    history.push("/login");
  }

  function routeToSignup() {
    history.push("/signup");
  }

  return (
    <Segment id="homepage-segment" vertical>
      <Container text>
        <Header id="homepage-header1" as="h3">The Code Zone</Header>
        <p className="lead">All the country codes in one convenient place.</p>
        {currentUser
            ? <h2>
              Welcome Back, {currentUser.firstName || currentUser.username}!
            </h2>
            : (
                <p>
                  <Button basic color="black" onClick={routeToLogin}>
                    Log in
                  </Button>
                  <Button basic color="blue" onClick={routeToSignup}>
                    Sign up
                  </Button>
                </p>
            )}
      </Container>
    </Segment>
  );
}

export default Homepage;
