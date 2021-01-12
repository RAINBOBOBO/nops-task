import React from "react";
import { useHistory } from "react-router-dom";

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
    </div>
  );
}

export default CountryCodes;