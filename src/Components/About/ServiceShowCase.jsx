import React from "react";
import "./serviceShowCase.css";
import { useNavigate } from "react-router-dom";
const ServiceShowcase = ({ data, className }) => {
  const {
    imgSrc,
    title,
    paragraph,
    buttonText,
    buttonText1,
    buttonText2,
    buttonLink1,
    buttonLink2,
    onButtonClick,
  } = data;
  const navigate = useNavigate();
  const handleClick = (link) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  return (
    <div className={`service-showcase`}>
      <img src={imgSrc} alt={title} rel="preload" />
      <div className={`service-btn-wrapper ${className || ""}`}>
        <h2>{title}</h2>
        {paragraph && <p className="about-us-para">{paragraph}</p>}
        {buttonText1 && buttonText2 ? (
          <div className="btn-group">
            <button
              className="transparent-btn"
              onClick={() => handleClick(buttonLink1)}
            >
              {buttonText1}
            </button>
            <button
              className="transparent-btn"
              onClick={() => handleClick(buttonLink2)}
            >
              {buttonText2}
            </button>
          </div>
        ) : (
          buttonText && <button onClick={onButtonClick}>{buttonText}</button>
        )}
      </div>
    </div>
  );
};

export default ServiceShowcase;
