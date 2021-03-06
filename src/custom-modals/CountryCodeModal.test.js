import React from "react";
import { render } from "@testing-library/react";
import CountryCodeModal from "./CountryCodeModal";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <CountryCodeModal 
          addFavoriteCode={() => {}}
          removeFavoriteCode={() => {}}
        />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
