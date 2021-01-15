import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import UserContext from './auth/UserContext.js';
import Navigation from './routes-nav/Navigation.js';
import Routes from './routes-nav/Routes.js';
import nopsTaskApi from './api/api.js';
import LoadingSpinner from './common/LoadingSpinner.js';
import useLocalStorage from "./hooks/useLocalStorage";
import jwt from "jsonwebtoken";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "nops-token";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          // decode the token and get username, returns str
          let { username } = jwt.decode(token);

          // save tokenFromLS to API class
          nopsTaskApi.token = token;

          // make an api request for the user info using the username
          let currentUser = await nopsTaskApi.getCurrentUser(username);

          // setCurrentUser based on response of api
          setCurrentUser(currentUser);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        } 
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  // Handles logout
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles signup.
   *
   * Automatically logs them in (set token) upon signup.
   */
  async function signup(signupData) {
    try {
      let token = await nopsTaskApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  // Handles login.
  async function login(loginData) {
    try {
      let token = await nopsTaskApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  // Handles favorites.
  async function addFavoriteCode(countryCode) {
    try {
      await nopsTaskApi.addFavorite(currentUser.username, countryCode);
      return { success: true };
    } catch (errors) {
      console.error("add favorite failed", errors);
      return { success: false, errors };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
        <div className="App">
          <Navigation logout={logout} />
          <Routes login={login} signup={signup} addFavoriteCode={addFavoriteCode} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
