import Button from "../Button.jsx";
import { render, screen } from "@testing-library/react";

describe("CustomButton", () => {
    it("CustomButton existsd", () => {
        render(<Button dataTestid={"button-prev"} buttonOnClick={()=>console.log("buttonOnClick")}/>);
        const buttonElement = screen.getByTestId('button-prev');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).not.toBeDisabled();
    });

    it("CustomButton uses correct props disabled", () => {
        render(<Button dataTestid={"button-prev"} buttonOnClick={()=>console.log("buttonOnClick")} disabled={true} />);
        const buttonElement = screen.getByTestId('button-prev');
        expect(buttonElement).toBeDisabled();
    });

    it("CustomButton check button variant prop classes for primary", () => {
        render(<Button dataTestid={"button-play"} variant="primary-button" buttonOnClick={()=>console.log("buttonOnClick")} />);
        const buttonElement = screen.getByTestId('button-play');
        expect(buttonElement.classList.contains('primary-button')).toBe(true);
        expect(buttonElement.classList.contains('ghost-button')).toBe(false);
    });

    it("CustomButton check button variant prop classes for ghost", () => {
        render(<Button dataTestid={"button-shuffle"} variant="ghost-button" buttonOnClick={()=>console.log("buttonOnClick")} />);
        const buttonElement = screen.getByTestId('button-shuffle');
        expect(buttonElement.classList.contains('ghost-button')).toBe(true);
        expect(buttonElement.classList.contains('primary-button')).toBe(false);
    });
  });