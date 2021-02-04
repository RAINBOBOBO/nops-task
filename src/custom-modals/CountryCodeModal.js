import "./CountryCodeModal.css"
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import CountryList from "../country-codes/CountryList.js";
import LoadingSpinner from "../common/LoadingSpinner.js";
import CountryDetailModal from "./CountryDetailModal.js";

// binding modal to appElement for screen readers
Modal.setAppElement('#root');

const countryCodeAPI = "https://restcountries.eu/rest/v2"

function CountryCodeModal({ addFavoriteCode, removeFavoriteCode }) {
  const history = useHistory();

  const [isOnlyEven, setIsOnlyEven] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [loadedIndex, setLoadedIndex] = useState(10);
  const [allCountryCodes, setAllCountryCodes] = useState(null);
  const [evenCountryCodes, setEvenCountryCodes] = useState(null);
  const [codeToGetDetail, setCodeToGetDetail] = useState(null);
  const [searchedCode, setSearchedCode] = useState(null);
  const [formData, setFormData] = useState({ filterResults: ""});
  const [modalId, setModalId] = useState("country-code-modal");

  const urlParam = useParams();

  useEffect(function loadCountryInfo() {
    console.debug("CountryCodeModal useEffect loadCountryInfo");

    async function getCountryCodes() {
      try {
        const allCountryCodesResult = await axios.get(
          `${countryCodeAPI}/all?fields=name;alpha3Code`);
        setAllCountryCodes(allCountryCodesResult.data.slice(0, loadedIndex));

        const evenCountryCodesResult = allCountryCodesResult.data.filter(
          (country, index) => index % 2 === 1
        );
        setEvenCountryCodes(evenCountryCodesResult);
      } catch (err) {
        console.error("CountryCodeModal loadCountryInfo: problem loading", err);
      }
      console.log("got country codes in useEffect.")
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCountryCodes runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCountryCodes();
  }, [loadedIndex]);

  useEffect(function searchByCode() {
    console.debug("CountryCodeModal useEffect searchByCode");
    if (formData.filterResults.length > 1) {
      async function getCountryCode() {
        try {
          const searchResult = await axios.get(
            `${countryCodeAPI}/alpha?codes=${formData.filterResults}`);
          setSearchedCode(searchResult.data);
        } catch (err) {
          if (err.message === "Request failed with status code 404") {
            setSearchedCode(null);
          } else {
            console.error("CountryCodeModal searchCountryCodes: problem loading", err);
          }
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCountryCode();
    }
  }, [formData.filterResults]);

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

  function handleCheckboxChange(evt) {
    setIsOnlyEven(value => !value);
  }

  function handleSearchboxChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  function handleSetCodeForDetail(code) {
    setCodeToGetDetail(code);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
  }

  function increaseLoadedIndex() {
    setLoadedIndex(prevLoadedIndex => prevLoadedIndex + 10);
  }

  function displayCountryCodes() {
    // render CountryList once info is loaded, pass allCountryCodes based on
    // url param
    if (infoLoaded) {
      if (urlParam.modal === 'a') {
        let codesToSend;
        if (isOnlyEven) {
          if (formData.filterResults) {
            codesToSend = evenCountryCodes.filter(code => {
              if (code['alpha3Code'].toLowerCase().includes(formData.filterResults.toLowerCase())) {
                return code;
              }
            });
            if (codesToSend.length === 0 
                && formData.filterResults.length === 3 
                && searchedCode !== null 
                && searchedCode[0] !== null) {
              codesToSend = searchedCode;
            }
          } else {
            codesToSend = evenCountryCodes;
          }
        } else {
          if (formData.filterResults) {
            codesToSend = allCountryCodes.filter(code => {
              if (code['alpha3Code'].toLowerCase().includes(formData.filterResults.toLowerCase())) {
                return code;
              }
            });
            if (codesToSend.length === 0 
                && formData.filterResults.length > 1 
                && searchedCode !== null 
                && searchedCode[0] !== null) {
              codesToSend = searchedCode;
            }
          } else {
            codesToSend = allCountryCodes;
          }
        }
        return (
          <CountryList 
            countryCodes={codesToSend} 
            loadedIndex={loadedIndex}
            setLoadedIndex={increaseLoadedIndex}
            addFavoriteCode={addFavoriteCode}
            removeFavoriteCode={removeFavoriteCode}
            isOnlyEven={isOnlyEven}
            setCode={handleSetCodeForDetail}
            data-testid="modal-a"
        />);
      } else if (urlParam.modal === 'b') {
        const userFavoriteCodes = ["favorites", formData.filterResults];
        return (
          <CountryList 
              countryCodes={userFavoriteCodes} 
              loadedIndex={loadedIndex}
              setLoadedIndex={increaseLoadedIndex}
              addFavoriteCode={addFavoriteCode}
              removeFavoriteCode={removeFavoriteCode}
              isOnlyEven={isOnlyEven}
              setCode={handleSetCodeForDetail}
              data-testid="modal-b"
          />);
      }
    } else {
      return <LoadingSpinner />;
    }
  }


  return (
    <div className="modal-container" data-testid="modal-container" >
      {codeToGetDetail && 
        <CountryDetailModal 
          code={codeToGetDetail}
          setCode={setCodeToGetDetail}
        />
      }
      <Modal
        isOpen={isOpen}
        className="modal"
        onRequestClose={closeModals}
      >
        <div className={"country-code-modal-" + urlParam.modal} >
          <h2>Modal {urlParam.modal?.toUpperCase()}</h2>

          <button 
            onClick={openModalA} 
            className="buttonA" 
            data-testid="modal-button-a" 
          >All country codes</button>
          <button 
            onClick={openModalB} 
            className="buttonB" 
            data-testid="modal-button-b" 
          >Favorite country codes</button>
          <button 
            onClick={closeModals} 
            className="buttonC"
            data-testid="modal-button-close" 
          >Close</button>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Only Even</label>
              <input
                name="onlyEven"
                type="checkbox"
                checked={isOnlyEven}
                onChange={handleCheckboxChange}
              />
            </div>
            <div>
              <label>Filter Results</label>
              <input
                name="filterResults"
                className="form-control"
                value={formData.filterResults}
                onChange={handleSearchboxChange}
              />
            </div>
          </form>
          {displayCountryCodes()}
          {infoLoaded && <i>( You've reached the end of the list! )</i>}
        </div>
      </Modal>
    </div>
  );
}

export default CountryCodeModal;