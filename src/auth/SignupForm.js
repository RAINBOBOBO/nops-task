import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import { Segment, Button, Header, Form, Container } from 'semantic-ui-react';
import "./SignupForm.css";
import { GoogleLogin } from 'react-google-login';

/** Signup form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /codes route
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */

function SignupForm({ signup }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "SignupForm",
      "signup=", typeof signup,
      "formData=", formData,
      "formErrors=", formErrors,
  );

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /codes.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);
    if (result.success) {
      history.push("/codes");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  function handleLogin() {
    return;
  }

  return (
    <Segment id="signup-form-segment" vertical padded="very">
      <Header as="h1">Sign Up</Header>
      <Container id="signup-form-container">
        <Form id="signup-form" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Field width={16}>
              <label>First name</label>
              <input
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>Last name</label>
              <input
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>Email</label>
              <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>Username</label>
              <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>Password</label>
              <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 5 characters"
              />
            </Form.Field>
          </Form.Group>

          {formErrors.length
              ? <Alert type="danger" messages={formErrors} />
              : null
          }

          <Button
              type="submit"
              onSubmit={handleSubmit}
              color="green"
              fluid
              size="small"
          >
            Submit
          </Button>
        </Form>
      </Container>
      <Container id="google-login-button">
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Log in with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={'single_host_origin'}
        />
      </Container>
    </Segment>
  );
}

export default SignupForm;