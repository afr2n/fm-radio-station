import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types'

const CustomButton = ({ buttonText, icon, buttonOnClick, variant, disabled, dataTestid }) => {
    if (icon) {
        return <button data-testid={dataTestid} disabled={disabled} className={"btn icon-button " + (variant ? variant : "")} onClick={buttonOnClick}> <FontAwesomeIcon size={"2x"} icon={icon} /> </button>
    }
    return (
        <button data-testid={dataTestid} disabled={disabled} className={"btn " + (variant ? variant : "")} onClick={buttonOnClick}> {buttonText} </button>
    )
}

// Specifies the default values for props:
CustomButton.defaultProps = {
    variant: 'ghost-button'
  };

// Specifies the default values for props:
CustomButton.propTypes = {
    buttonText: PropTypes.string,
    icon: PropTypes.object,
    buttonOnClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
  };


export default CustomButton;