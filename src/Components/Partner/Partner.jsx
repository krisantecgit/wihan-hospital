import React, { useState, useEffect } from "react";
import "./Partner.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Partner = () => {
  const [slidesToShow, setSlidesToShow] = useState(4);
  const updateSlidesToShow = () => {
    if (window.innerWidth <= 481) {
      setSlidesToShow(1);
    } else if (window.innerWidth <= 768) {
      setSlidesToShow(2);
    } else if (window.innerWidth <= 1024) {
      setSlidesToShow(3);
    } else {
      setSlidesToShow(4);
    }
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const data = [
    {
      id: 1,
      img: require("../../Assets/partner1.png"),
      title: "Continuity of Care",
      para: "Smooth patient handover from hospital to home",
    },
    {
      id: 2,
      img: require("../../Assets/partner2.png"),
      title: "Trusted Professionals",
      para: "Verified, certified CarePreneurs trained for post-hospital care",
    },
    {
      id: 3,
      img: require("../../Assets/partner3.png"),
      title: "Tech-Enabled Referrals",
      para: "Easy referral portal with real-time tracking",
    },
    {
      id: 4,
      img: require("../../Assets/partner4.png"),
      title: "Revenue & Reputation",
      para: "Strengthen patient trust and create additional value for your hospital",
    },
    {
      id: 5,
      img: require("../../Assets/parner5.png"),
      title: "Safe & Compliant",
      para: "Transparent processes, secure transactions, and patient data protection",
    },
  ];

  const settingsPartner = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };
  return (
    <>
      <div className="partner-section">
        <h1 className="heading-h1">Why Partner with Wihan?</h1>
        <Slider {...settingsPartner}>
          {data.map((item) => (
            <div key={item.id} className="partner-card">
              <img src={item.img} alt={item.title} className="partner-img" />
              <big>{item.title}</big>
              <p>{item.para}</p>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Partner;
