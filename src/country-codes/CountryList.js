import React from "react";

function CountryList({ allCountryCodes, loadedIndex }) {

  function renderCodes() {
    console.log("CountryList recieved", allCountryCodes)
    const codesToRender = allCountryCodes
      .slice(0, loadedIndex)
      .map(country => country['alpha3Code']);
    console.log("CountryList rendering", codesToRender)
    return codesToRender.map(codes => 
      <li>
        {codes}
      </li> 
    );
  }

  return (
    <div>
      <ul>
        {renderCodes()}
      </ul>
    </div>
  );
}

export default CountryList;