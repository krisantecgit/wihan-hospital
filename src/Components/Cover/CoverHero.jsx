// CoverHero.jsx
import React from "react";
import "./coverHero.css";

const CoverHero = ({ image, title, className }) => {
  return (
    <div className={`cover-hero ${className || ""}`}>
      <img className="cover-img" src={image} alt={title} />
      <h1 className="cover-title">{title}</h1>
    </div>
  );
};

export default CoverHero;
