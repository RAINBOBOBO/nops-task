import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";

function CountryCodes() {
  const [modalAIsOpen, setAIsOpen] = useState(false);
  const [modalBIsOpen, setBIsOpen] = useState(false);

  function openModalA() {
    setAIsOpen(true);
  }

  function openModalB() {
    setBIsOpen(true);
  }

  function closeModals() {
    setAIsOpen(false);
    setBIsOpen(false);
  }

  return (
    <div>
      <button
        className="btn btn-primary"
        name="buttonA"
        onClick={openModalA}
      >
        Button A
      </button>

      <button
        className="btn btn-primary"
        name="buttonB"
        onClick={openModalB}
      >
        Button B
      </button>
      
      <Modal
        isOpen={modalAIsOpen}
        name="modalA"
        className="modal"
        onRequestClose={closeModalA}
      >
        <h2>Modal A</h2>
        <button onClick={openModalA}>All country codes</button>
        <button onClick={openModalB}>Favorite country codes</button>
        <button onClick={closeModals}>Close</button>
      </Modal>

      <Modal
        isOpen={modalBIsOpen}
        name="modalB"
        className="modal"
        onRequestClose={closeModalB}
      >
        <h2>Modal B</h2>
        <button onClick={openModalA}>All country codes</button>
        <button onClick={openModalB}>Favorite country codes</button>
        <button onClick={closeModals}>Close</button>
      </Modal>
    </div>
  );
}

export default CountryCodes;