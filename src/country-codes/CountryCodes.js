import React from "react";
import { useHistory } from "react-router-dom";
import "./CountryCodes.css";
import { Button, Container, Segment, Header } from 'semantic-ui-react';

/** CountryCodes
 * 
 *  Renders buttons that redirect to /codes/a or /codes/b depending on which
 *  button is pressed.
 * 
 *  Routed at /codes
 * 
 *  Routes --> CountryCodes
 */

function CountryCodes() {
  const history = useHistory();

  function openModalA() {
    history.push("/codes/a");
  }

  function openModalB() {
    history.push("/codes/b");
  }

  return (
    <Segment id="CountryCodes-segment" vertical>
      <Container id="CountryCodes-header-container" text>
        <Header as="h3" id="CountryCodes-header1">
          Button A to view all country codes
        </Header>
        <Header as="h3" id="CountryCodes-header2">
          Button B to view favorite country codes
        </Header>
      </Container>
      <Container text>
        <Button
          basic
          color='violet'
          onClick={openModalA}
          data-testid="button-a"
        >
          Button A
        </Button>

        <Button
          basic
          color='orange'
          onClick={openModalB}
          data-testid="button-b"
        >
          Button B
        </Button>
      </Container>
    </Segment>
  );
}

export default CountryCodes;