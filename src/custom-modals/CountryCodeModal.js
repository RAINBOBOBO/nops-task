import "./CountryCodeModal.css"
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import CountryList from "../country-codes/CountryList.js";
import LoadingSpinner from "../common/LoadingSpinner.js";
import CountryDetailModal from "./CountryDetailModal.js";
import { Modal, Container, Button, Divider, Form, Segment, Header } from "semantic-ui-react";

// binding modal to appElement for screen readers

const countryCodeAPI = "https://restcountries.eu/rest/v2"


/** CountryCodeModal
 * 
 *  Makes country code API requests for country code data and holds necessary 
 *  data for other components to be rendered.
 * 
 *  Props:
 *    - addFavoriteCode: fn passed from app to send code data to backend API 
 *        whenever the add favorite button is pressed.
 *    - removeFavoriteCode: fn passed from app to send code data to backend API 
 *        whenever the remove favorite button is pressed.
 * 
 *  State:
 *    - isOnlyEven: boolean to determine whether or not component will render
 *        only the even indexed codes.
 *    - isOpen: boolean to determine whether or not the modal should be open,
 *        required for the Modal component
 *    - infoLoaded: boolean to know when to show a loading message or when to
 *        render the list of country codes.
 *    - loadedIndex: int amount of codes to render
 *    - allCountryCodes: array of codes to render
 *    - evenCountryCodes: array to keep track of the even numbered indexes of 
 *        the country codes gotten from country code API.
 *    - codeToGetDetail: string to send to CountryDetailModal so it knows what
 *        country to get details on.
 *    - searchedCode: array to hold searched country data w/ country code API
 *    - formData: object to handle the search box changes.
 * 
 *  Routed at /codes/:modal where :modal is "a" or "b"
 * 
 *  Routes --> CountryCodeModal --> {CountryList, CountryDetailModal}
 */

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
    <Container>

      {codeToGetDetail && 
        <CountryDetailModal 
          code={codeToGetDetail}
          setCode={setCodeToGetDetail}
        />
      }
      <Modal
        open={isOpen}
        onClose={closeModals}
      >
        <div className={"country-code-modal-" + urlParam.modal} >
          <Modal.Header 
            id="country-code-modal-header"
            as="h2"
          > 
            Modal {urlParam.modal?.toUpperCase()}: 
             {urlParam.modal === "a" ? " All Codes" : " Favorite Codes"}
          </Modal.Header>

          <Container id="country-code-modal-button-container">
            <Button 
              onClick={openModalA} 
              className="buttonA" 
              data-testid="modal-button-a"
              color="violet"
            >All country codes</Button>
            <Button 
              onClick={openModalB} 
              className="buttonB" 
              data-testid="modal-button-b"
              color="orange"
            >Favorite country codes</Button>
            <Button 
              onClick={closeModals} 
              className="buttonC"
              data-testid="modal-button-close"
              color="black"
            >
              Close
            </Button>
          </Container>
          <Divider />
          <Segment basic padded="very" id={"country-code-modal-form-segment-" + urlParam.modal}>
            <Header>
              Filter codes
            </Header>
            <Divider />
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Field width={4}>
                  <label>Search by code</label>
                  <input
                    name="filterResults"
                    className="form-control"
                    value={formData.filterResults}
                    onChange={handleSearchboxChange}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Checkbox 
                  label="Only Even"
                  name="onlyEven"
                  onChange={handleCheckboxChange}
                />
              </Form.Group>
            </Form>
          </Segment>
          <Segment padded="very" id={"country-code-list-segment-" + urlParam.modal}>
            {displayCountryCodes()}
            <Divider />
            {infoLoaded && <i>( You've reached the end of the list! )</i>}
          </Segment>
        </div>
      </Modal>
    </Container>
  );
}

export default CountryCodeModal;