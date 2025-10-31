import React from "react";
import "./ProfileStats.css";
import ProgressBar from "@ramonak/react-progress-bar";

function ProfileStats() {
  return (
    <>
      <div className="profile-section">
        <h2>Profile Completion</h2>
        <small>85% COMPLETE</small>
        <ProgressBar
          className="progress-bar"
          bgColor="var(--color-blue)"
          baseBgColor="#e0e0de"
          height="12px"
          labelColor="var(--color-white)"
          isLabelVisible={false}
          style={{ borderRadius: "8px", margin: "10px 0" }}
        />
        <div className="badge-flex">
          <p>XP Points :</p>
          <strong>60 XP</strong>
        </div>
        <div className="badge-flex">
          <p>Your Badges :</p>
          <div className="badges">
            <span className="badge">
              <img src={require("../../../Assets/traingle.png")} />
              NABH Certified
            </span>
            <span className="badge">
              <img src={require("../../../Assets/up-badge.png")} />
              Quality Partner
            </span>
            <span className="badge">
              <img src={require("../../../Assets/down-badge.png")} />
              Certified
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileStats;
