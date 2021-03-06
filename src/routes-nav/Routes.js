import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import CountryCodes from "../country-codes/CountryCodes";
import CountryCodeModal from "../custom-modals/CountryCodeModal";
import PrivateRoute from "./PrivateRoute";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes({ login, signup, addFavoriteCode, removeFavoriteCode }) {
  console.debug(
      "Routes",
      `login=${typeof login}`,
      `register=${typeof register}`,
      `addFavoriteCode=${typeof addFavoriteCode}`,
  );

  return (
      <div className="pt-5">
        <Switch>

          <Route exact path="/">
            <Homepage />
          </Route>

          <Route exact path="/login">
            <LoginForm login={login} />
          </Route>

          <Route exact path="/signup">
            <SignupForm signup={signup} />
          </Route>

          <PrivateRoute exact path="/codes/:modal">
            <CountryCodeModal 
              addFavoriteCode={addFavoriteCode} 
              removeFavoriteCode={removeFavoriteCode}
            />
          </PrivateRoute>

          <PrivateRoute exact path="/codes">
            <CountryCodes />
          </PrivateRoute>

          <Redirect to="/" />
        </Switch>
      </div>
  );
}

export default Routes;
