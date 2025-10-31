import React from "react";
import "./LeaderBoard.css";
import trophyIcon from "../../../Assets/cup-1-img.png";
import medalIcon from "../../../Assets/badge-1-img.png";
import medailIcon1 from "../../../Assets/badge-2-img.png";
import medailIcon2 from "../../../Assets/badge-3-img.png";
import medailIcon3 from "../../../Assets/badge-2-img.png";
const LeaderBoard = () => {
  const hospitals = [
    { rank: 1, name: "City hospital", score: 98, image: medalIcon },
    { rank: 2, name: "Sunrise Diagnostics", score: 94, image: medailIcon1 },
    {
      rank: 3,
      name: "Your Hospital",
      score: 85,
      highlight: true,
      image: medailIcon2,
    },
    { rank: 4, name: "Metro Health Center", score: 82, image: medailIcon3 },
  ];

  return (
    <div className="leaderboard">
      <h3 className="leaderboard-title">
        <img src={trophyIcon} alt="trophy" className="trophy" /> City
        Leaderboard
      </h3>

      <div className="leaderboard-list">
        {hospitals.map((hospital) => (
          <div
            key={hospital.rank}
            className={`leaderboard-item ${
              hospital?.highlight ? "highlight" : ""
            }`}
          >
            <span className="leaderboard-rank">#{hospital?.rank}</span>
            <div className="hospital-info">
              <p className="hospital-name">{hospital?.name}</p>
              <div className="leaderboard-progress-bar">
                <div
                  className="leaderboard-progress-fill"
                  style={{ width: `${hospital?.score}%` }}
                ></div>
              </div>
            </div>
            <span className="leaderboard-score">
              {hospital?.score} %
              <img src={hospital?.image} alt="medal" className="medal" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;
