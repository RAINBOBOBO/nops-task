import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import { Segment, Button, Header, Form } from 'semantic-ui-react';

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /codes route
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 */

function LoginForm({ login }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "LoginForm",
      "login=", typeof login,
      "formData=", formData,
      "formErrors", formErrors,
  );

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /codes.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result.success) {
      history.push("/codes");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <Segment padded="very">
      <Header as="h1">Log In</Header>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Field width={3}>
              <label>Username</label>
              <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={3}>
              <label>Password</label>
              <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
              />
            </Form.Field>
          </Form.Group>

          {formErrors.length
              ? <Alert type="danger" messages={formErrors} />
              : null}

          <Button
              className="btn btn-primary float-right"
              onSubmit={handleSubmit}
              color="green"
          >
            Submit
          </Button>
        </Form>
    </Segment>
  );
}

export default LoginForm;
