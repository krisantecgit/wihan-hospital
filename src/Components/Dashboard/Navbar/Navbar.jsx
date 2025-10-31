import React, { use } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./Navbar.css";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../../Context/AuthContext";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  let { logout } = useAuth();
  const navigate = useNavigate();
  const handleToHome = () => {
    logout();
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };
  return (
    <div className="top-navbar d-flex">
      <div className="d-flex align-items-center">
        <div className="dashboard-logo" onClick={handleBackToHome}>
          <img
            src={require("../../../Assets/header.png")}
            alt="Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </div>
        <div
          className="hamburger me-3"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </div>
      </div>

      <div className="wrap-nav d-flex align-items-center">
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Profile
        </NavLink>
        <div onClick={handleToHome} className="nav-link  text-danger">
          <span className="me-1">
            <i>
              <FiLogOut />
            </i>
          </span>
          Logout
        </div>
        <div className="location-dropdown d-flex align-items-center">
          <FaMapMarkerAlt color="#FDB900" className="me-2" />
          <select className="location-select">
            <option>Banjara Hills, Hyderabad</option>
            <option>Kukatpally, Hyderabad</option>
            <option>Gachibowli, Hyderabad</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
