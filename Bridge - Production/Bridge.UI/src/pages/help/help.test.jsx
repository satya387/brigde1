import React from "react";
import { render, screen } from "@testing-library/react";
import HelpComp from "./index";

jest.mock("../../components/header/header", () => () => <div data-testid="mock-header" />);
jest.mock("../../components/leftmenu", () => () => <div data-testid="mock-leftmenu" />);

describe("Help Component", () => {
  test("renders Help component", () => {
    render(<HelpComp />);

    const headerElement = screen.getByTestId("mock-header");
    const leftMenuElement = screen.getByTestId("mock-leftmenu");
    const helpElement = screen.getByText("Help goes here");
        
     expect(headerElement).toBeTruthy();
     expect(leftMenuElement).toBeTruthy();
          expect(helpElement).toBeTruthy();
 
      
  });
});
