import React from "react";
import "./Footer.css";
import logo from "../../Assets/footer.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoCallOutline } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  function handleLinkClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <footer className="">
      <div className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <p>
              We are Hyderabad’s largest network of CarePreneurs. As a
              CarePreneurs network, we empower skilled individuals to deliver
              care with ownership, empathy, and excellence transforming homes
              into healing spaces and families into partners in recovery.
            </p>
            <div className="footer-contact">
              <p>
                <IoCallOutline />
                +91 966 966 8687
              </p>
              <p>
                <MdMailOutline /> care@wihan.in
              </p>
              <p>
                <FaMapMarkerAlt /> Plot No: 22 & 23, Saket, Vorla Enclave, ECIL,
                Secunderabad, Hyderabad, Telangana- 500062.{" "}
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li onClick={handleLinkClick}>
                <Link to="/">Home</Link>
              </li>
              <li onClick={handleLinkClick}>
                <Link to="/about">About</Link>
              </li>
              <li onClick={handleLinkClick}>
                <a href="https://wihan.in/" target="_blank">
                  Services
                </a>
              </li>

              <li onClick={handleLinkClick}>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div>
          Copyright © 2025 Wihan (A Unit Of Acuvera Care Private Limited). All
          Rights Reserved.
        </div>
        <div className="footer-images">
          <a href="https://www.instagram.com/wihan_homecare/" target="_blank">
            <img src={require("../../Assets/img23.png")} alt="img" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61581308447571"
            target="_blank"
          >
            <img src={require("../../Assets/img24.png")} alt="img" />
          </a>
          <a href="https://x.com/Wihan_home" target="_blank">
            <img src={require("../../Assets/img25.png")} alt="img" />
          </a>
          <img src={require("../../Assets/img26.png")} alt="img" />
          <img src={require("../../Assets/img27.png")} alt="img" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
