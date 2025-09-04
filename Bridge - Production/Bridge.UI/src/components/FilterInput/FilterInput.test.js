import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import FilterInput from "./index";

const mockStore = configureStore();

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("FilterInput Component", () => {
  test("should render Filter button", () => {
    const store = mockStore();

    // Render the component
    render(
      <Provider store={store}>
        <FilterInput
          handleFilter={() => {}}
          applySelector={() => {}}
          applyOn="someValue"
        />
      </Provider>
    );

    const imgElement = screen.getByAltText("Filter");
    expect(imgElement).toBeTruthy();
  });

  test("should render the span element with the correct class", () => {
    const store = mockStore();
    render(
      <Provider store={store}>
        <FilterInput
          handleFilter={() => {}}
          applySelector={() => {}}
          applyOn="someValue"
        />
      </Provider>
    );

    const spanElement = document.getElementsByClassName("list-filter-wrapper");
    expect(spanElement).toBeTruthy();
  });
});
