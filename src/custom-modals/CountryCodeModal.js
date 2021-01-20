import "./CountryCodeModal.css"
import React, { useState, useEffect, useContext } from "react";
import Modal from 'react-modal';
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import CountryList from "../country-codes/CountryList.js";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner.js";

// binding modal to appElement for screen readers
Modal.setAppElement('#root');

function CountryCodeModal({ addFavoriteCode, removeFavoriteCode }) {
  const history = useHistory();

  const [isOnlyEven, setIsOnlyEven] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [loadedIndex, setLoadedIndex] = useState(10);
  const [allCountryCodes, setAllCountryCodes] = useState(null);
  const [evenCountryCodes, setEvenCountryCodes] = useState(null);

  const urlParam = useParams();

  const { currentUser } = useContext(UserContext);

  useEffect(function loadCountryInfo() {
    // console.debug("CountryCodeModal useEffect loadCountryInfo");

    async function getCountryCodes() {
      try {
        const allCountryCodesResult = await axios.get(
          `https://restcountries.eu/rest/v2/all?fields=name;alpha3Code`);
        setAllCountryCodes(allCountryCodesResult.data);

        const evenCountryCodes = allCountryCodesResult.data.filter(
          (country, index) => index % 2 === 1
        );
        setEvenCountryCodes(evenCountryCodes);
      } catch (err) {
        console.error("CountryCodeModal loadCountryInfo: problem loading", err);
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCountryCodes();
  }, []);

  function openModalA () {
    history.push("/codes/a");
  }

  function openModalB () {
    history.push("/codes/b");
  }

  // redirect to /codes on modal close
  function closeModals() {
    setIsOpen(false);
    history.push("/codes");
  }

  function handleChange(evt) {
    setIsOnlyEven(value => !value);
  }

  function displayCountryCodes() {
    // render CountryList once info is loaded, pass allCountryCodes based on
    // url param
    if (infoLoaded) {
      if (urlParam.modal === 'a') {
        if (isOnlyEven) {
          return (
            <CountryList 
              countryCodes={evenCountryCodes} 
              loadedIndex={loadedIndex}
              addFavoriteCode={addFavoriteCode}
              removeFavoriteCode={removeFavoriteCode}
          />);
        } else {
          return (
            <CountryList 
              countryCodes={allCountryCodes} 
              loadedIndex={loadedIndex}
              addFavoriteCode={addFavoriteCode}
              removeFavoriteCode={removeFavoriteCode}
          />);
        }
      } else if (urlParam.modal === 'b') {
        const userFavoriteCodes = ["favorites"];
        return (
          <CountryList 
              countryCodes={userFavoriteCodes} 
              loadedIndex={loadedIndex}
              addFavoriteCode={addFavoriteCode}
              removeFavoriteCode={removeFavoriteCode}
          />);
      }
    } else {
      return <LoadingSpinner />;
    }
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        name="country-code-modal"
        className="modal"
        onRequestClose={closeModals}
      >
        <h2>Modal {urlParam.modal.toUpperCase()}</h2>
        <button onClick={openModalA}>All country codes</button>
        <button onClick={openModalB}>Favorite country codes</button>
        <button onClick={closeModals}>Close</button>
        <form>
          <label>
            Only Even
            <input
              name="onlyEven"
              type="checkbox"
              checked={isOnlyEven}
              onChange={handleChange}
            ></input>
          </label>
        </form>
        {displayCountryCodes()}
      </Modal>
    </div>
  )
}

export default CountryCodeModal;