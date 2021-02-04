import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CountryCodes from "./CountryCodes";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <CountryCodes />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

