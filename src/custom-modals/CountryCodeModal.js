import React, { useState } from "react";
import Modal from 'react-modal';
import { useHistory } from "react-router-dom";

function CountryCodeModal() {
  const history = useHistory();
  const [isOnlyEven, setIsOnlyEven] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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
      </Modal>
    </div>
  )
}

export default CountryCodeModal;