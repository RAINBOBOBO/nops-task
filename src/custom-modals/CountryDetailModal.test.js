import React from "react";
import { render } from "@testing-library/react";
import CountryDetailModal from "./CountryDetailModal";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <CountryDetailModal />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
