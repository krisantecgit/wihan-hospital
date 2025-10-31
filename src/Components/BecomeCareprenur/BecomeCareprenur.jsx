import React, { useState } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import "./BecomeCareprenur.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
const BecomeCareprenur = ({ mobileInputRef }) => {
  const [mobileno, setMobileNo] = useState("");
  const navigate = useNavigate();
  const { user_id } = useAuth();
  const [error, setError] = useState("");

  const handleNavigate = () => {
    if (!mobileno || mobileno.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    navigate("/hospital-signin", { state: { mobileno } });
    setMobileNo("");
  };
  function handleLinkClick() {
    window.scrollTo({ top: 400, behavior: "smooth" });
  }
  return (
    <>
      <div className="bg-img-1">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <h4 className="text-h4">
                Extend Your Care Beyond Discharge with Wihan’s Trusted Referral
                Network
              </h4>
              <ButtonComponent
                title="Register Your Hospital Today"
                onClick={handleLinkClick}
              />
            </div>
            <div className="col-md-7">
              <img
                src={require("../../Assets/give-img.png")}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
        <div className="bg-thick-blue">
          <div>
            <p>
              Seamlessly connect your hospital to Hyderabad’s largest home
              healthcare network. Ensure your patients continue to receive safe,
              verified, and professional care at home.
            </p>
          </div>
          <div className="flex-d g_16">
            <div
              className="phone-input"
              style={{ border: error ? "1px solid red" : "" }}
            >
              <span className="prefix">+91</span>
              <input
                ref={mobileInputRef}
                name="mobileno"
                type="text"
                inputMode="numeric"
                maxLength={10}
                className="number-input"
                value={mobileno}
                disabled={user_id}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  setMobileNo(onlyNums);
                }}
              />
            </div>

            <div>
              <ButtonComponent
                title="Join Us"
                onClick={handleNavigate}
                style={{ width: "100px" }}
              />
            </div>
          </div>

          {error && (
            <div className="d-flex justify-content-center">
              <span className="mobile-error">{error}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BecomeCareprenur;
