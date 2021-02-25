import React, { useState, useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner.js";
import axios from "axios";
import { Button, Header, Image, Modal } from 'semantic-ui-react'


/** CountryDetailModal
 * 
 *  Renders details on a specific country
 * 
 *  Props:
 *    - code: string to keep track of what country to get details on
 *    - setCode: fn to set code to null on modal close
 * 
 *  State:
 *    - isOpen: boolean to determine whether or not the modal should be open,
 *        required for the Modal component
 *    - codeDetail: object to remember data from country code API request.
 *    - infoLoaded: boolean to know when to show a loading message or when to
 *        render the details of country code.
 * 
 *  CountryCodeModal --> CountryDetailModal
 */

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
    <Modal
      open={isOpen}
      name="country-code-detail-modal"
      className="detail-modal"
      onClose={closeModals}
      dimmer="blurring"
    >
      <Modal.Header>Modal C: Details on {code}</Modal.Header>
      <Modal.Content image>
        {infoLoaded && 
          <Image src={codeDetail.flag} alt="flag" size="large" wrapped/>
        }
        {infoLoaded && 
          <Modal.Description>
            <Header>
              Country Name: {codeDetail.name}
            </Header>
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
          </Modal.Description>
        }
        {!infoLoaded && <LoadingSpinner />}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={closeModals}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CountryDetailModal;