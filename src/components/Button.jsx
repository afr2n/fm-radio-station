import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomButton = ({ buttonText, icon, buttonOnClick, variant, disabled }) => {
    if (icon) {
        return <button disabled={disabled} className={"btn icon-button " + (variant ? variant : "")} onClick={buttonOnClick}> <FontAwesomeIcon size={"2x"} icon={icon} /> </button>
    }
    return (
        <button disabled={disabled} className={"btn " + (variant ? variant : "")} onClick={buttonOnClick}> {buttonText} </button>
    )
}

export default CustomButton;