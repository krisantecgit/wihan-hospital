import React from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./Header.css";
import { useAuth } from "../../Context/AuthContext";

const Header = ({ scrollToMobile }) => {
  const { user_id, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mobileno");
    logout();
    navigate("/");
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      scrollToMobile && scrollToMobile();
    } else {
      navigate("/");
      setTimeout(() => scrollToMobile && scrollToMobile(), 300);
    }
  };

  const handleLoginClick = () => {
    navigate("/");
  };
  let profile_completed = localStorage.getItem("profile_completed");


  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            src={require("../../Assets/header.png")}
            alt="Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Dropdown className="d-lg-none mx-auto">
          <Dropdown.Toggle className="d-flex align-items-center nav-search">
            <FaMapMarkerAlt className="me-2" color="#FDB900" />
            Banjara Hills, Hyderabad
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Banjara Hills, Hyderabad</Dropdown.Item>
            <Dropdown.Item>Kukatpally, Hyderabad</Dropdown.Item>
            <Dropdown.Item>Gachibowli, Hyderabad</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav>
            {!user_id && (
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
              >
                Home
              </NavLink>
            )}

            {user_id && (
              <>
                <NavLink
                  to={
                    profile_completed === "true" ? `/dashboard/${user_id}` : "#"
                  }
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                >
                  Profile
                </NavLink>
                <div
                  className="nav-link"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <FiLogOut style={{ color: "red" }} />
                  Logout
                </div>
              </>
            )}
          </Nav>

          {!user_id && (
            <div className="d-flex align-items-center gap-3">
              <button className="join-in-network" onClick={handleSignInClick}>
                Join In Network
              </button>
              <button className="join-in-login" onClick={handleLoginClick}>
                Login
              </button>
            </div>
          )}
        </Navbar.Collapse>

        <Dropdown className="d-none d-lg-block ms-auto">
          <Dropdown.Toggle className="d-flex align-items-center nav-search">
            <FaMapMarkerAlt className="me-2" color="#FDB900" />
            Banjara Hills, Hyderabad
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Banjara Hills, Hyderabad</Dropdown.Item>
            <Dropdown.Item>Kukatpally, Hyderabad</Dropdown.Item>
            <Dropdown.Item>Gachibowli, Hyderabad</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default Header;
