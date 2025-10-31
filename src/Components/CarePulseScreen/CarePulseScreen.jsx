import React from "react";
import "./CarePulseScreen.css";
import dashboardImage from "../../Assets/computer-bg.png";
import { PiTelegramLogoThin } from "react-icons/pi";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
const CarePulseScreen = () => {
  return (
    <div className="carepulse-container">
      <h1 className="heading-h1">
        Powered by CarePulse – Intelligent Care Management
      </h1>
      <div className="carepulse-left">
        <div className="feature-boxes">
          <div className="feature-animated-box">
            <PiTelegramLogoThin
              size={20}
              color="#1D808C"
              style={{ rotate: "45deg" }}
            />
            Instant referral system
            <span className="bottom-border" />
          </div>
          <div className="feature-animated-box">
            <PiTelegramLogoThin
              size={20}
              color="#1D808C"
              style={{ rotate: "45deg" }}
            />{" "}
            Real-time patient updates for hospitals
            <span className="bottom-border" />
          </div>
          <div className="feature-animated-box">
            <PiTelegramLogoThin
              size={20}
              color="#1D808C"
              style={{ rotate: "45deg" }}
            />{" "}
            Secure reports & tracking
            <span className="bottom-border" />
          </div>
          <div className="feature-animated-box">
            <PiTelegramLogoThin
              size={20}
              color="#1D808C"
              style={{ rotate: "45deg" }}
            />{" "}
            Patient feedback integration
            <span className="bottom-border" />
          </div>
        </div>

        {/* <ButtonComponent
          title="Explore CarePulse for Hospitals"
         
        /> */}
      </div>
      <div className="carepulse-right">
        <img
          src={dashboardImage}
          alt="CarePulse Dashboard"
          className="dashboard-image"
        />
      </div>
    </div>
  );
};

export default CarePulseScreen;
