import "./CountryCodeModal.css"
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useHistory } from "react-router-dom";
import axios from "axios";
import CountryList from "../country-codes/CountryList.js";

function CountryCodeModal() {
  const history = useHistory();
  const [isOnlyEven, setIsOnlyEven] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [allCountryCodes, setAllCountryCodes] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [loadedIndex, setLoadedIndex] = useState(10);


  useEffect(function loadCountryInfo() {
    console.debug("CountryCodeModal useEffect loadCountryInfo");

    async function getCountryCodes() {
      try {
        const allCountryCodesResult = await axios.get(
          `https://restcountries.eu/rest/v2/all?fields=name;alpha3Code`);
        setAllCountryCodes(allCountryCodesResult.data);
        console.log("all country codes recieved:", allCountryCodesResult.data)
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

  function closeModals() {
    setIsOpen(false);
    history.push("/codes");
  }

  function handleChange(evt) {
    setIsOnlyEven(value => !value);
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        name="country-code-modal"
        className="modal"
        onRequestClose={closeModals}
      >
        <h2>Modal A</h2>
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
        {infoLoaded ? <CountryList 
          allCountryCodes={allCountryCodes} 
          loadedIndex={loadedIndex}
        /> : null}
      </Modal>
    </div>
  )
}

export default CountryCodeModal;