import React from "react";
import "./Banner.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const Banner = () => {
  function handleLinkClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className="banner-section container mt-80">
      <div className="row align-items-center">
        <div className="col-md-6 col-12 banner-left">
          <h1>Join Wihan’s Trusted Referral Network Today</h1>
          <p>
            Empower your hospital to deliver care beyond walls. Together, let’s
            build India’s largest post-hospital care ecosystem
          </p>
          <ButtonComponent
            title="Register Your Hospital Now"
            onClick={handleLinkClick}
          />
        </div>
        <div className="col-md-6 col-12 banner-right text-center">
          <img
            src={require("../../Assets/group-img.png")}
            alt="Banner"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
