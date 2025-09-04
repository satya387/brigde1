import React from "react";
import { render, screen } from "@testing-library/react";
import AllOppurtunity from "./index";

jest.mock("../../components/header/header", () => () => <div data-testid="mock-header" />);
jest.mock("../../components/leftmenu", () => () => <div data-testid="mock-leftmenu" />);

describe("AllOppurtunity Component", () => {
  test("renders AllOppurtunity component", () => {
    render(<AllOppurtunity />);

    const headerElement = screen.getByTestId("mock-header");
    const leftMenuElement = screen.getByTestId("mock-leftmenu");
    const opportunityElement = screen.getByText("All Opportunities goes here");
        
     expect(headerElement).toBeTruthy();
     expect(leftMenuElement).toBeTruthy();
          expect(opportunityElement).toBeTruthy();
 
      
  });
});
