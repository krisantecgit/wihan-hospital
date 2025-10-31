import React from "react";
import "./ButtonComponent.css";
const ButtonComponent = ({ title, onClick, disabled }) => {
  return (
    <>
      <input
        type="button"
        value={title}
        className="universal-button"
        disabled={disabled}
        onClick={onClick}
      />
    </>
  );
};

export default ButtonComponent;
