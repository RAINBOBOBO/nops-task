import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import LoadingSpinner from "../common/LoadingSpinner.js";
import axios from "axios";

// binding modal to appElement for screen readers
// Modal.setAppElement('#root');

function CountryDetailModal({ code, setCode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [codeDetail, setCodeDetail] = useState(null);
  const [infoLoaded, setInfoLoaded] = useState(false);

  useEffect(function loadCountryDetail() {
    async function getCountryDetail() {
      try {
        const countryCodesDetailResult = await axios.get(
          `https://restcountries.eu/rest/v2/alpha/${code}`);
        setCodeDetail(countryCodesDetailResult.data);
      } catch (err) {
        console.error("CountryDetailModal getCountryDetail: problem loading", err);
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCountryDetail();
  }, []);

  function closeModals() {
    setCode(null);
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        name="country-code-detail-modal"
        className="detail-modal"
        onRequestClose={closeModals}
      >
        <h2>Modal C: Details on {code}</h2>
        <button onClick={closeModals}>Close</button>
        {infoLoaded && 
          <div>
            <p>
              Country Name: {codeDetail.name}
            </p>
            <p>
              Capital: {codeDetail.capital}
            </p>
            <p>
              Region: {codeDetail.region}
            </p>
            <p>
              Sub Region: {codeDetail.subregion}
            </p>
            <p>
              Population: {codeDetail.population}
            </p>
            {codeDetail.timezones[0] && 
              <div>
                Timezones: 
                <ul>
                  {codeDetail.timezones.map(timezone => 
                    <li key={timezone} >{timezone}</li>
                  )}
                </ul>
              </div>
            }
            {codeDetail.borders[0] && 
              <div>
                Borders:
                <ul>
                  {codeDetail.borders.map(border => 
                    <li key={border} >{border}</li>
                  )}
                </ul>
              </div>
            }
            Flag:
            <div>
              <img src={codeDetail.flag} alt="flag" width="200" />
            </div>
          </div>
        }
        {!infoLoaded && <LoadingSpinner />}
      </Modal>
    </div>
  );
}

export default CountryDetailModal;