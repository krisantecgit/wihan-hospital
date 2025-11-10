import React, { useEffect } from "react";
import "./Sidebar.css";

import WihanLogo from "../../../Assets/static-logo.png";

const Sidebar = ({ isOpen, onMenuClick, selectedMenu, userData }) => {
  const [profilePreview, setProfilePreview] = React.useState(null);
  const menuItems = [
    "Quick Stats",
    "Contact Information",
    "Facilities",
    "Accreditations",
    // "Leaderboard",
    "Support Staff",
    // "Activity",
  ];
  useEffect(() => {
    if (userData?.profile instanceof File) {
      const objectUrl = URL.createObjectURL(userData.profile);
      setProfilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof userData?.profile === "string") {
      setProfilePreview(userData.profile);
    } else {
      setProfilePreview(WihanLogo);
    }
  }, [userData?.profile]);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-logo">
        {profilePreview ? (
          <img src={profilePreview} alt="Logo" />
        ) : (
          <img src={WihanLogo} alt="Logo" />
        )}
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={selectedMenu === item ? "active" : ""}
            onClick={() => onMenuClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
