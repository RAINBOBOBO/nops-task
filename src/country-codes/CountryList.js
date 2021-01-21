import React, { useState, useEffect, useContext } from "react";
import nopsTaskApi from "../api/api";
import UserContext from "../auth/UserContext";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner.js";

function CountryList({ countryCodes, loadedIndex, addFavoriteCode, removeFavoriteCode, isOnlyEven }) {
  const [userFavoriteCodes, setUserFavoriteCodes] = useState(null);
  const [userEvenFavoriteCodes, setUserEvenFavoriteCodes] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [triggerRerender, setTriggerRerender] = useState(false);

  const { currentUser } = useContext(UserContext);

  const urlParam = useParams();

  // fetch user's favorites every time the url parameter switches from a -> b
  // or from b -> a. Not ideal but only fetching on first load doesn't work.
  useEffect(function loadUserFavorites() {
    async function getUserFavorites() {
      try {
        // console.log("fetching favorites inside CountryList");
        const userFavoritesResult = await nopsTaskApi.getFavorites(currentUser.username);
        setUserFavoriteCodes(userFavoritesResult.map(code => code["alpha3Code"]));

        const evenFavoriteCodes = userFavoritesResult.filter(
          (country, index) => index % 2 === 1
        );
        setUserEvenFavoriteCodes(evenFavoriteCodes);
      } catch (err) {
        console.error("CountryList Modal loadUserFavorites: problem loading", err);
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getUserFavorites();
  }, [urlParam.modal, triggerRerender]);

  function handleAddFavoriteCode(evt) {
    const countryCode = evt.target.getAttribute('name');
    addFavoriteCode(countryCode);
    setTriggerRerender(state => !state);
  }

  function handleRemoveFavoriteCode(evt) {
    const countryCode = evt.target.getAttribute('name');
    removeFavoriteCode(countryCode);
    setTriggerRerender(state => !state);
  }

  function renderCodes() {
    // console.log("CountryList recieved", countryCodes);
    let codesToRender;
    if (infoLoaded) {
      if (countryCodes[0] === "favorites") {
        if (isOnlyEven) {
          codesToRender = userEvenFavoriteCodes
            .slice(0, loadedIndex)
            .map(country => country['alpha3Code']);
        } else {
          codesToRender = userFavoriteCodes.slice(0, loadedIndex);
        }
      } else {
        codesToRender = countryCodes
          .slice(0, loadedIndex)
          .map(country => country['alpha3Code']);
      }

      return codesToRender.map(code => {
        if (userFavoriteCodes.includes(code)) {
          return (
            <li key={code} >
              <i 
                className="fas fa-star"
                onClick={handleRemoveFavoriteCode}
                name={code}
              />
              {code}
            </li> 
          )
        } else {
          return (
            <li key={code} >
              <i 
                className="far fa-star"
                onClick={handleAddFavoriteCode}
                name={code}
              />
              {code}
            </li> 
          )
        }
      }
      );
    } else {
      return <LoadingSpinner />;
    }
  }

  return (
    <div>
      <ul>
        {renderCodes()}
      </ul>
    </div>
  );
}

export default CountryList;