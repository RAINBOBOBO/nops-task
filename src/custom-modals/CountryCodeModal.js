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

function CountryCodeModal({ addFavoriteCode, removeFavoriteCode }) {
  const history = useHistory();

  const [isOnlyEven, setIsOnlyEven] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [loadedIndex, setLoadedIndex] = useState(10);
  const [allCountryCodes, setAllCountryCodes] = useState(null);
  const [evenCountryCodes, setEvenCountryCodes] = useState(null);
  const [searchedCountryCodes, setSearchedCountryCodes] = useState(null);
  const [evenSearchedCountryCodes, setEvenSearchedCountryCodes] = useState(null);
  const [codeToGetDetail, setCodeToGetDetail] = useState(null);
  const [formData, setFormData] = useState({ filterResults: ""});

  const urlParam = useParams();

  useEffect(function loadCountryInfo() {
    // console.debug("CountryCodeModal useEffect loadCountryInfo");

    async function getCountryCodes() {
      try {
        const allCountryCodesResult = await axios.get(
          `https://restcountries.eu/rest/v2/all?fields=name;alpha3Code`);
        setAllCountryCodes(allCountryCodesResult.data);

        const evenCountryCodesResult = allCountryCodesResult.data.filter(
          (country, index) => index % 2 === 1
        );
        setEvenCountryCodes(evenCountryCodesResult);
      } catch (err) {
        console.error("CountryCodeModal loadCountryInfo: problem loading", err);
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCountryCodes runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCountryCodes();
  }, []);

  useEffect( function searchCountryCodes() {
    if (formData.filterResults) {
      async function getCountryCodes() {
        try {
          const searchedCountryCodesResult = await axios.get(
            `https://restcountries.eu/rest/v2/name/${formData.filterResults}`);
          setSearchedCountryCodes(searchedCountryCodesResult.data);

          const evenSearchedCountryCodesResult = searchedCountryCodesResult.data.filter(
            (country, index) => index % 2 === 1
          );
          setEvenSearchedCountryCodes(evenSearchedCountryCodesResult);
        } catch (err) {
          if (err.message === "Request failed with status code 404") {
            setSearchedCountryCodes([]);
            setEvenSearchedCountryCodes([]);
          } else {
            console.error("CountryCodeModal searchCountryCodes: problem loading", err);
          }
        }
        setInfoLoaded(true);
      }

      setInfoLoaded(false);
      getCountryCodes();
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

  function displayCountryCodes() {
    // render CountryList once info is loaded, pass allCountryCodes based on
    // url param
    if (infoLoaded) {
      if (urlParam.modal === 'a') {
        let codesToSend;
        if (isOnlyEven) {
          if (formData.filterResults && evenSearchedCountryCodes) {
            const matchingCodes = evenCountryCodes.filter(code => {
              if (code['alpha3Code'].toLowerCase().includes(formData.filterResults.toLowerCase())) {
                return code;
              }
            });
            codesToSend = matchingCodes.concat(evenSearchedCountryCodes);
            console.log("codesToSend is", codesToSend);
          } else {
            codesToSend = evenCountryCodes;
          }
        } else {
          if (formData.filterResults && searchedCountryCodes) {
            const matchingCodes = allCountryCodes.filter(code => {
              if (code['alpha3Code'].toLowerCase().includes(formData.filterResults.toLowerCase())) {
                return code;
              }
            });
            codesToSend = matchingCodes.concat(searchedCountryCodes);
            console.log("codesToSend is", codesToSend, matchingCodes, searchedCountryCodes);
          } else {
            codesToSend = allCountryCodes;
          }
        }
        return (
          <CountryList 
            countryCodes={codesToSend} 
            loadedIndex={loadedIndex}
            setLoadedIndex={setLoadedIndex}
            addFavoriteCode={addFavoriteCode}
            removeFavoriteCode={removeFavoriteCode}
            isOnlyEven={isOnlyEven}
            setCode={handleSetCodeForDetail}
        />);
      } else if (urlParam.modal === 'b') {
        const userFavoriteCodes = ["favorites"];
        return (
          <CountryList 
              countryCodes={userFavoriteCodes} 
              loadedIndex={loadedIndex}
              setLoadedIndex={setLoadedIndex}
              addFavoriteCode={addFavoriteCode}
              removeFavoriteCode={removeFavoriteCode}
              isOnlyEven={isOnlyEven}
              setCode={handleSetCodeForDetail}
          />);
      }
    } else {
      return <LoadingSpinner />;
    }
  }


  return (
    <div className="modal-container">
      {codeToGetDetail && 
        <CountryDetailModal 
          code={codeToGetDetail}
          setCode={setCodeToGetDetail}
        />
      }
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
      </Modal>
    </div>
  );
}

export default CountryCodeModal;