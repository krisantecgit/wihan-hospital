import React, { useEffect, useState } from "react";
import "./StepPopup.css";
import successGif from "../../Animations/successfull-gif.gif";
import { IoCloseCircleOutline } from "react-icons/io5";
import locationImg from "../../Assets/location-img.png";
import Upbadge from "../../Assets/up-badge.png";
import Star from "../../Assets/three-star.png";
import DownBadge from "../../Assets/down-badge.png";
import WihanLogo from "../../Assets/wihan-success.png";
import errorImg from "../../Animations/error-gif.gif";
import { useNavigate } from "react-router-dom";

const StepPopup = ({ step, message, error, onClose, onNext, userId, form }) => {
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState(null);

  useEffect(() => {
    if (form?.profile instanceof File) {
      const objectUrl = URL.createObjectURL(form.profile);
      setProfilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof form?.profile === "string") {
      setProfilePreview(form.profile);
    } else {
      setProfilePreview(WihanLogo);
    }
  }, [form?.profile]);
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="success-content">
            <img src={successGif} alt="success" className="success-gif" />
            <p className="popup-msg">{message}</p>
          </div>
        );

      case 1:
        return (
          <div className="success-content">
            <img src={successGif} alt="success" className="success-gif" />
            <img src={Upbadge} alt="badge" className="popup-extra" />
            <h3 className="popup-title">Starter Badge Earned</h3>
            <p className="popup-sub">You're off to a great start!</p>
          </div>
        );

      case 2:
        return (
          <div className="success-content">
            <img src={successGif} alt="success" className="success-gif" />
            <img src={locationImg} alt="location" className="popup-extra" />
            <h3 className="popup-title">Location Badge Earned</h3>
            <p className="popup-sub">Location Verified - 50 points added!</p>
          </div>
        );

      case 3:
        return (
          <div className="success-content">
            <img src={successGif} alt="success" className="success-gif" />
            <img src={Star} alt="success" className="popup-gif" />
            <p className="popup-sub">You’ve unlocked 3/10 service stars</p>
          </div>
        );

      case 4:
        return (
          <div className="success-content">
            <img src={successGif} alt="success" className="success-gif" />
            <img src={DownBadge} alt="success" className="popup-gif" />
            <p className="popup-sub">Certified Quality Partner Badge Earned</p>
          </div>
        );

      case 5:
        return (
          <div className="final-step">
            <h6 className="final-sub">Congratulations!</h6>
            <p className="popup-sub">You're officially a verified partner.</p>
            <div className="final-logo">
              {profilePreview ? (
                <img src={profilePreview} alt="Wihan" />
              ) : (
                <img src={WihanLogo} alt="Wihan" />
              )}
            </div>
            <div className="profile-summary">
              <h4>Profile Summary</h4>
              <p>
                Completion : <strong>95%</strong>
              </p>
              <p>
                XP Earned : <strong>60</strong>
              </p>
              <p>
                Earned Badges : <strong>04</strong>
              </p>
            </div>

            <button className="finish-btn" onClick={handleProfile}>
              View Profile
            </button>
          </div>
        );

      default:
        return (
          <div className="success-content">
            <img src={successGif} alt="success" className="popup-gif" />
            <p className="popup-msg">{message}</p>
          </div>
        );
    }
  };
  const handleProfile = () => {
    navigate(`/dashboard/${userId}`);
  };
  return (
    <div className="step-success">
      <div className="popup-box">
        {step > 0 && !error && (
          <div className="popup-header">
            {step === 5 ? (
              <h4>Onboarding Completed</h4>
            ) : (
              <h4>Step {step} Completed</h4>
            )}
            <IoCloseCircleOutline className="close-btn" onClick={onClose} />
          </div>
        )}
        {error ? (
          <div className="popup-error">
            <img src={errorImg} alt="error" /> <p>{message}</p>
            <button onClick={onClose} className="retry-btn">
              Ok
            </button>
          </div>
        ) : (
          <>
            {renderStepContent()}
            {step < 5 && (
              <button className="next-btn" onClick={onNext}>
                Next Step
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StepPopup;
