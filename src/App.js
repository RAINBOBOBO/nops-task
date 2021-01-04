import './App.css';
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import UserContext from './auth/UserContext.js';
import Navigation from './routes-nav/Navigation.js';
import Routes from './routes-nav/Routes.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
        <div className="App">
          <Navigation />
          <Routes />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
