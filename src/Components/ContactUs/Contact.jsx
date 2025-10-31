import React from "react";
import { useState, useRef, useEffect } from "react";
import axiosConfig from "../../Service/AxiosConfig";
import cover from "../../Assets/cover.jpg";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./contact_css.css";
import CoverHero from "../Cover/CoverHero";

const Contact = () => {
  const mobileInputRef = useRef(null);
  const scrollToMobile = () => {
    if (mobileInputRef.current) {
      mobileInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      mobileInputRef.current.focus(); // 👈 focus cursor inside input
    }
  };
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    comments: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const val = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: val });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z\s]+$/.test(formData.first_name.trim())) {
      setStatusMessage("❌ First name can only contain letters and spaces.");
      setStatusType("error");
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(formData.last_name.trim())) {
      setStatusMessage("❌ Last name can only contain letters and spaces.");
      setStatusType("error");
      return;
    }
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.comments.trim()
    ) {
      setStatusMessage("❌ Fields cannot be empty or just spaces.");
      setStatusType("error");
      return;
    }

    try {
      const FormDataToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) =>
        FormDataToSend.append(key, val)
      );

      await axiosConfig.post("blogapp/contacts/", FormDataToSend);

      setStatusMessage("✅ Form submitted successfully!");
      setStatusType("success");

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        comments: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("❌ Something went wrong. Please try again later.");
      setStatusType("error");
    }

    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 3000);
  };

  const contactData = {
    address:
      "Plot No: 22 & 23, Saket, Vorla Enclave, ECIL, Secunderabad, Hyderabad, Telangana- 500062.",
    mobile: "+91 966 966 8687",
    email: "care@wihan.in",
  };
  return (
    <>
      <Header scrollToMobile={scrollToMobile} />
      <CoverHero image={cover} title="Contact Us" />
      <div className="contact-container container">
        <div className="row">
          <div className="col-md-6">
            <div className="col-md-8">
              <h2 className="my-h2">Our Address</h2>

              <p className="contact-info">{contactData.address}</p>
              <div className="address-detail-box">
                <h4 className="my-h4">Mobile:</h4>
                <a
                  href={`tel:${contactData.mobile}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  {contactData.mobile}
                </a>
              </div>
              <div className="address-detail-box">
                <h4 className="my-h4">Email:</h4>
                <a
                  href={`mailto:${contactData.email}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  {contactData.email}
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <h2 className="my-h2">
              Request a <span className="banner-color">Callback</span>
            </h2>

            <form className="form-style" onSubmit={handleSubmit}>
              <div className="row">
                <div className=" col-md-6 mb-3">
                  <label className="form-label-text">First Name*</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="form-control-underline"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label-text">Last Name*</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="form-control-underline"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label-text">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-control-underline w-100"
                    required
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label-text">Mobile*</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                    className="form-control-underline w-100"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label-text">Your Query*</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    placeholder="Type your query"
                    className="form-control-underline query-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="form-submit-btn mt-3">
                Submit
              </button>
              {statusMessage && (
                <p className={`form-status ${statusType}`}>{statusMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
