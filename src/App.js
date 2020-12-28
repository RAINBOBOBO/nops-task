import './App.css';
import { BrowserRouter } from "react-router-dom";
import UserContext from './auth/UserContext.js';
import Navigation from './routes-nav/Navigation.js';
import Routes from './routes-nav/Routes.js';

function App() {
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
