import React, { useState } from "react";
import "./WihanPartner.css";
import partnerImage from "../../Assets/partner-family.png";
import LogoGrid from "./LogoGrid";

const testimonials = [
  {
    quote:
      "“Wihan has become our trusted partner in ensuring post-discharge care. Our patients feel supported even after leaving the hospital.” – Leading Hospital Partner””",
    author: "– Dr. Priya Sharma, Chief Medical Officer",
    company: "Apollo Hospital, Hyderabad",
  },
  {
    quote:
      "“Wihan has become our trusted partner in ensuring post-discharge care. Our patients feel supported even after leaving the hospital.” – Leading Hospital Partner””",
    author: "– Mr. Rajesh Kumar, CEO",
    company: "Sunrise Health",
  },
  {
    quote:
      "“Wihan has become our trusted partner in ensuring post-discharge care. Our patients feel supported even after leaving the hospital.” – Leading Hospital Partner”",
    author: "– Dr. Anjali Mehta, Senior Consultant",
    company: "City Care Hospital",
  },
];

const WihanPartner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const { quote, author, company } = testimonials[currentIndex];

  return (
    <div className="wihan-partner-section">
      <div className="wihan-partner-section-container">
        <h1 className="heading-h1">Hospital Success Stories</h1>
        <div className="wihan-parner-content-row">
          <div className="image-column">
            <img src={partnerImage} alt="Wihan Partner Family" />
          </div>
          <div className="testimonial-column">
            <div className="testimonial-box">
              <p className="testimonial-quote">{quote}</p>
              <p className="testimonial-author">
                <strong>{author}</strong>
                <br />
                <span>{company}</span>
              </p>
            </div>
            <div className="navigation-arrows">
              <button onClick={handlePrev}>&#8249;</button>
              <button onClick={handleNext}>&#8250;</button>
            </div>
          </div>
        </div>
        <LogoGrid />
      </div>
    </div>
  );
};

export default WihanPartner;
