import React from "react";
import "./Sidebar.css";
import care from "../../../Assets/care-img.png";

const Sidebar = ({ isOpen, onMenuClick, selectedMenu }) => {
  const menuItems = [
    "Quick Stats",
    "Contact Information",
    "Facilities",
    "Accreditations",
    // "Leaderboard",
    "Support Staff",
    // "Activity",
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-logo">
        <img src={care} alt="Logo" />
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
