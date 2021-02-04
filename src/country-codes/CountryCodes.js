import React from "react";
import { useHistory } from "react-router-dom";
import "./CountryCodes.css"

function CountryCodes() {
  const history = useHistory();

  function openModalA() {
    history.push("/codes/a");
  }

  function openModalB() {
    history.push("/codes/b");
  }

  return (
    <div>
      <button
        name="buttonA"
        className="buttonA"
        onClick={openModalA}
        data-testid="button-a"
      >
        Button A
      </button>

      <button
        name="buttonB"
        className="buttonB"
        onClick={openModalB}
        data-testid="button-b"
      >
        Button B
      </button>
    </div>
  );
}

export default CountryCodes;