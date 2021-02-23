import React from "react";
import { render } from "@testing-library/react";
import CountryList from "./CountryList";
import { MemoryRouter } from "react-router";
import { UserProvider } from "../testUtils";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <CountryList
            countryCodes={testCountryCodes}
            loadedIndex={10}
            setLoadedIndex={() => {}}
            addFavoriteCode={() => {}}
            removeFavoriteCode={() => {}}
            isOnlyEven={false}
            setCode={() => {}}
          />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

