import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import nopsTaskApi from "../api/api";
import UserContext from "../auth/UserContext";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner.js";
import { Button, Container, List } from "semantic-ui-react";

/** CountryList
 * 
 *  Renders a generic list of country codes and makes a request to the backend 
 *  API for user favorites.
 * 
 *  Props:
 *    - countryCodes: array of codes to render. If loading favorites, array will 
 *        only have ["favorites", searchTerm] and component will make request to
 *        backend API for the list of codes.
 *    - loadedIndex: int amount of codes to render
 *    - setLoadedIndex: fn used to change the number of codes to render when 
 *        reaching the bottom of the page.
 *    - addFavoriteCode: fn passed from app to send code data to backend API 
 *        whenever the add favorite button is pressed.
 *    - removeFavoriteCode: fn passed from app to send code data to backend API 
 *        whenever the remove favorite button is pressed.
 *    - isOnlyEven: boolean to determine whether or not component will render
 *        only the even indexed codes.
 *    - setCode: fn passed from CountryCodeModal to know which code to get 
 *        details for when a code is clicked on.
 * 
 *  State:
 *    - userFavoriteCodes: array to keep track of the user's favorite codes when
 *        a request is made to the backend API.
 *    - userEvenFavoriteCodes: array to keep track of the even numbered indexes
 *        of the user's favorite codes.
 *    - infoLoaded: boolean to know when to show a loading message or when to
 *        render the list of country codes.
 *    - triggerRerender: boolean to know when to re-render the list. I used this
 *        solution because the page wouldn't show when a favorite was added 
 *        unless I re-rendered the page. Not the cleanest solution but it works
 *        for now. In a real world application I would ask for help on this.
 * 
 *  CountryCodeModal --> CountryList
 */

function CountryList({ 
  countryCodes, 
  loadedIndex, 
  setLoadedIndex, 
  addFavoriteCode, 
  removeFavoriteCode, 
  isOnlyEven,
  setCode,
}) {
  const [userFavoriteCodes, setUserFavoriteCodes] = useState(null);
  const [userEvenFavoriteCodes, setUserEvenFavoriteCodes] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [triggerRerender, setTriggerRerender] = useState(false);

  const { currentUser } = useContext(UserContext);

  const observer = useRef();

  const lastCodeElementRef = useCallback(node => {
    if (!infoLoaded) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setLoadedIndex();
      }
    });
    if (node) observer.current.observe(node);
  }, [infoLoaded, setLoadedIndex]);

  const urlParam = useParams();

  // fetch user's favorites every time the url parameter switches from a -> b
  // or from b -> a. Not ideal but only fetching on first load doesn't work.
  useEffect(function loadUserFavorites() {
    async function getUserFavorites() {
      try {
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
  }, [urlParam.modal, triggerRerender, currentUser.username]);

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

  function handleSetCodeForDetail(evt) {
    const countryCode = evt.target.getAttribute('name');
    setCode(countryCode);
  }

  function renderCodes() {
    console.log("CountryList recieved", countryCodes);
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
        if (countryCodes[1]) {
          codesToRender = codesToRender.filter(code => {
            if (code.toLowerCase().includes(countryCodes[1].toLowerCase())) {
              return code;
            }
          });
        }
      } else {
        codesToRender = countryCodes
          .slice(0, loadedIndex)
          .map(country => country['alpha3Code']);
      }

      return codesToRender.map((code, index) => {
        if ((index + 1) === loadedIndex) {
          return (
            <div ref={lastCodeElementRef}>
              <List.Item key={code}>
                {userFavoriteCodes.includes(code) && 
                  <i 
                    className="fas fa-star"
                    onClick={handleRemoveFavoriteCode}
                    name={code}
                  />}
                {!userFavoriteCodes.includes(code) && 
                  <i 
                    className="far fa-star"
                    onClick={handleAddFavoriteCode}
                    name={code}
                  />}
                <Button
                  name={code}
                  onClick={handleSetCodeForDetail}
                  size="tiny"
                  color="black"
                >
                  {code}
                </Button>
              </List.Item>
            </div>
          )
        } else {
          return (
            <List.Item key={code}>
              {userFavoriteCodes.includes(code) && 
                <i 
                  className="fas fa-star"
                  onClick={handleRemoveFavoriteCode}
                  name={code}
                />}
              {!userFavoriteCodes.includes(code) && 
                <i 
                  className="far fa-star"
                  onClick={handleAddFavoriteCode}
                  name={code}
                />}
              <Button
                name={code}
                onClick={handleSetCodeForDetail}
                size="tiny"
                color="black"
              >
                {code}
              </Button>
            </List.Item>
          )
        }
      }
      );
    } else {
      return <LoadingSpinner />;
    }
  }

  return (
    <Container>
      <List>
        {renderCodes()}
      </List>
    </Container>
  );
}

export default CountryList;