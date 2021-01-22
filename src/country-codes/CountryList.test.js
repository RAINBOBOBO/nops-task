import React from "react";
import { render } from "@testing-library/react";
import CountryList from "./CountryList";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <CountryList />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
