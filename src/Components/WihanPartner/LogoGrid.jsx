import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./LogoGrid.css";
import logo1 from "../../Assets/logo-img-1.png";
import logo2 from "../../Assets/logo-img-2.png";
import logo3 from "../../Assets/logo-img-3.png";
import logo4 from "../../Assets/logo-img-1.png";
import logo5 from "../../Assets/logo-img-2.png";
import logo6 from "../../Assets/logo-img-3.png";

const hospitals = [logo1, logo2, logo3, logo4, logo5, logo6];

const LogoGrid = () => {
  const [slidesToShow, setSlidesToShow] = useState(3);

  const updateSlidesToShow = () => {
    const width = window.innerWidth;
    if (width <= 321) setSlidesToShow(2);
    else if (width <= 380) setSlidesToShow(2);
    else if (width <= 480) setSlidesToShow(3);
    else if (width <= 768) setSlidesToShow(3);
    else if (width <= 1280) setSlidesToShow(3);
    else setSlidesToShow(3);
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <div className="logo-sliders">
      <Slider {...settings}>
        {hospitals.map((hospital, index) => (
          <div key={index} className="logo-card">
            <img src={hospital} alt={`Hospital ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default LogoGrid;
