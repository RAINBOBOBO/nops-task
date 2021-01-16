import React from "react";

function CountryList({ countryCodes, loadedIndex, addFavoriteCode }) {

  function handleAddFavoriteCode(evt) {
    const countryCode = evt.target.getAttribute('name');
    console.log("attempting to favorite code", countryCode);
    addFavoriteCode(countryCode);
  }

  function renderCodes() {
    console.log("CountryList recieved", countryCodes);
    const codesToRender = countryCodes
      .slice(0, loadedIndex)
      .map(country => country['alpha3Code']);
    console.log("CountryList rendering", codesToRender);
    return codesToRender.map(code => 
      <li key={code} >
        <i 
          className="far fa-star"
          onClick={handleAddFavoriteCode}
          name={code}
        />
        {code}
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