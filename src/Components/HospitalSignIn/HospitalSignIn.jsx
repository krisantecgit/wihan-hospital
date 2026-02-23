import React, { useState, useEffect, useRef, use } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import HospitalBredcrumb from "./HospitalBredcrumb";
import ProgressBar from "@ramonak/react-progress-bar";
import StepPopup from "../PopupModal/StepPopup";
import BasicInformation from "./BasicInformation";
import ContactInformation from "./ContactInformation";
import ServiceAvailable from "./ServiceAvailable";
import Quality from "../Quality/Quality";
import SupportStaff from "./SupportStaff";
import axiosConfig from "../../Service/AxiosConfig";
import { useAuth } from "../../Context/AuthContext";
import { CURRENT_BASE_URL } from "../../Service/AxiosConfig";

import "./HospitalSignIn.css";
const HospitalSignIn = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const { login } = useAuth();
  const mobileno = location.state?.mobileno || "";
  localStorage.setItem("mobileno", mobileno);
  const [mobile, setMobile] = useState(mobileno);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(0);
  const [popup, setPopup] = useState({
    show: false,
    error: false,
    message: "",
  });
  const [resendTimer, setResendTimer] = useState(0);
  const totalSteps = 6;
  const otpInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    year_of_establishment: "",
    bed_strength: "",
    registered_with: "",
    registration_no: "",
    md_ceo_chairman: "",
    designation: "",
    contact_no: "",
    door_no: "",
    profile: null,
    landmark: "",
    area: "",
    state: "",
    district: "",
    city: "",
    pin_code: "",
    contact_person: "",
    phone_1: "",
    phone_2: "",
    mobile_no: "",
    emergency_contact: "",
    type: "",
    email: "",
    profile_completed: false,
  });
  const basicInfoRef = useRef();
  const contactInfoRef = useRef();
  const serviceRef = useRef();
  const qualityRef = useRef();
  const supportRef = useRef();
  const sendOtp = async () => {
    if (!mobile || mobile.length !== 10) return;
    try {
      let res = await axiosConfig.post("/accounts/validate_mobile/", {
        mobileno: mobile,
        role: "hospital",
      });

      setOtp("");
      setResendTimer(30);
      otpInputRef.current?.focus();
    } catch (err) {
      setPopup({ show: true, error: true, message: "Failed to send OTP" });
    }
  };
  useEffect(() => {
    if (mobileno && mobileno.length === 10) sendOtp();
  }, [mobileno]);
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmitStep0 = async () => {
    if (mobile.length !== 10) {
      setPopup({
        show: true,
        error: true,
        message: "Enter a valid 10-digit mobile number",
      });
      return;
    }

    try {
      const response = await axiosConfig.post("/accounts/verify_otp/", {
        mobileno: mobile,
        otp,
      });

      if (response?.data) {
        const token = response?.data?.token;
        const user_id = response?.data?.user_id;
        if (token && user_id) {
          login(token, user_id);
          setUserId(user_id);
          setResendTimer(0);
          setOtp("");
          try {
            const res = await axiosConfig.get(
              `/hospital/hospitals/?user=${user_id}`
            );
            if (res?.data?.results?.length > 0) {
              setForm(res.data.results[0]);

              if (res?.data?.results[0]?.profile_completed) {
                navigate(`/dashboard/${user_id}`);
              }
            }
          } catch (err) {
            console.error("Failed to fetch hospital data", err);
          }
        }
        setPopup({
          show: true,
          error: false,
          message: response?.data?.message || "OTP Verified Successfully",
          onNext: () => setStep(1),
        });
      } else {
        setPopup({
          show: true,
          error: true,
          message: response?.data?.message || "Invalid OTP",
        });
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setPopup({
        show: true,
        error: true,
        message: err?.response?.data?.error || "Failed to verify OTP",
      });
    }
  };

  const handleNext = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let valid = true;

    switch (step) {
      case 0: {
        await handleSubmitStep0();
        return;
      }
      case 1: {
        if (basicInfoRef.current && basicInfoRef.current.validateBasicData) {
          valid = basicInfoRef.current.validateBasicData();
        } else {
          console.warn("BasicInformation ref not ready yet!");
          valid = false;
        }
        if (!valid) return;
        try {
          const formDataToSend = new FormData();
          formDataToSend.append("name", form.name || "");
          if (form.year_of_establishment)
            formDataToSend.append(
              "year_of_establishment",
              Number(form.year_of_establishment)
            );

          if (form.bed_strength)
            formDataToSend.append("bed_strength", Number(form.bed_strength));
          formDataToSend.append("registered_with", form.registered_with || "");
          formDataToSend.append(
            "registration_no",
            form.registration_no || null
          );
          formDataToSend.append("md_ceo_chairman", form.md_ceo_chairman || "");
          formDataToSend.append("designation", form.designation || "");

          if (form.contact_no)
            formDataToSend.append("contact_no", form.contact_no);

          if (form?.profile instanceof File) {
            formDataToSend.append("profile", form.profile);
          }

          const response = await axiosConfig.patch(
            `/hospital/hospitals/${form.id}/`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (response.status === 201 || response.status === 200) {
            setPopup({
              show: true,
              error: false,
              message: "Basic Information saved successfully!",
              onNext: () => setStep(2),
            });
          }
        } catch (error) {
          console.error("Error saving basic info:", error);
          setPopup({
            show: true,
            error: true,
            message: "Failed to save Basic Information. Please try again.",
          });
        }
        break;
      }

      case 2: {
        if (contactInfoRef.current && contactInfoRef.current.validate) {
          valid = contactInfoRef.current.validate();
        } else {
          console.warn("ContactInformation ref not ready yet!");
          valid = false;
        }

        if (!valid) return;

        try {
          const response = await axiosConfig.patch(
            `/hospital/hospitals/${form.id}/`,
            {
              door_no: form.door_no,
              landmark: form.landmark,
              area: form.area,
              state: form.state?.value,
              district: form.district?.value,
              city: form.city?.value,
              pin_code: form.pin_code,
              mobile_no: form.mobile_no,
              contact_person: form.contact_person,
              phone_1: form.phone_1,
              phone_2: form.phone_2,
              emergency_contact: form.emergency_contact,
            }
          );

          if (response.status === 201 || response.status === 200) {
            setPopup({
              show: true,
              error: false,
              message: "Contact Information saved successfully!",
              onNext: () => setStep(3),
            });
          }
        } catch (error) {
          console.error("Error saving contact info:", error);
          setPopup({
            show: true,
            error: true,
            message: "Failed to save contact Information. Please try again.",
          });
        }
        break;
      }

      case 3: {
        if (!serviceRef.current) return;
        const success =
          serviceRef.current && (await serviceRef.current.handleSave());
        console.log(success, "hj");
        if (success) {
          setPopup({
            show: true,
            error: false,
            message: "Services saved successfully!",
            onNext: () => setStep(4),
          });
        } else {
          setPopup({
            show: true,
            error: true,
            message: "Failed to save Services. Please try again.",
          });
        }
        break;
      }

      case 4: {
        const result =
          qualityRef.current &&
          (await qualityRef.current.handleQualitySubmit());

        if (result?.success) {
          setPopup({
            show: true,
            error: false,
            message: result.message,
            onNext: () => setStep(5),
          });
        } else {
          setPopup({
            show: true,
            error: true,
            message:
              result?.message || "Failed to save files. Please try again.",
          });
        }
        break;
      }

      case 5: {
        const result =
          supportRef.current && supportRef.current.validateAndSubmit
            ? await supportRef.current.validateAndSubmit()
            : { success: true };

        if (result.success) {
          setPopup({
            show: true,
            error: false,
            message: "Data saved successfully!",
            onNext: () => setStep(6),
          });
        } else {
          setPopup({
            show: true,
            error: true,
            message:
              "Failed to save Support Staff. Please fix the errors below.",
          });
        }

        break;
      }

      default:
        break;
    }

    if (!valid) return;
  };

  const getDashboardURL = (token, userId, hospitalId) => {
    const base = CURRENT_BASE_URL ?? "";

    let url = "";

    if (base.includes("localhost") || base.includes("192.168")) {
      url = "http://localhost:3001/login";
    } else if (base.includes("staging")) {
      url = "https://dashboard-staging.wihan.in/login";
    } else {
      url = "https://dashboard.wihan.in/login";
    }

    return `${url}?token=${token}&user_id=${userId}&hospital_id=${hospitalId}`;
  };


  const fetchHospitalId = async (userId) => {
    try {
      const res = await axiosConfig.get(
        `/hospital/hospitals/?user=${userId}`
      );

      return res?.data?.results?.[0]?.id ?? null;
    } catch (error) {
      console.error("Hospital fetch failed", error);
      return null;
    }
  };

  const updateHospitalName = async (hospitalId, hospitalName) => {
    try {
      const res = await axiosConfig.patch(
        `/hospital/hospitals/${hospitalId}/`,
        {
          name: hospitalName,
        }
      );

      return true;
    } catch (error) {
      console.error("Hospital update failed", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!mobile || mobile.length !== 10) {
      setPopup({
        show: true,
        error: true,
        message: "Enter valid mobile number",
      });
      return;
      return;
    }

    if (!otp || otp.length < 4) {
      setPopup({
        show: true,
        error: true,
        message: "Enter valid OTP",
      });
      return; return;
    }

    if (!password || password !== confirmPassword) {
      setPopup({
        show: true,
        error: true,
        message: "Passwords do not match",
      });
      return; return;
    }

    try {
      // 1️⃣ Verify OTP
      const response = await axiosConfig.post(
        "/accounts/verify_otp/",
        {
          mobileno: mobile,
          otp,
          password,
          confirm_password: confirmPassword,
        }
      );

      const userId = response?.data?.user_id ?? null;
      const token = response?.data?.token ?? "";

      if (!userId) {
        setPopup({
          show: true,
          error: true,
          message: "User ID not received",
        });
        return; return;
      }

      // 2️⃣ Fetch Hospital ID
      const hospitalId = await fetchHospitalId(userId);

      if (!hospitalId) {
        setPopup({
          show: true,
          error: true,
          message: "Hospital not found",
        });
        return;
        return;
      }

      // 3️⃣ Update Hospital Name
      const isUpdated = await updateHospitalName(
        hospitalId,
        form?.name ?? ""
      );

      if (!isUpdated) {
        setPopup({
          show: true,
          error: true,
          message: "Failed to update hospital name",
        });
        return; return;
      }

      console.log("Hospital Updated Successfully");

      const dashboardURL = getDashboardURL(token, userId, hospitalId);

      window.open(dashboardURL, "_blank", "noopener,noreferrer");

      //  Everything successful here

    } catch (error) {
      setPopup({
        show: true,
        error: true,
        message:
          error?.response?.data?.message ??
          "Verification failed",
      });
    }
  };


  const goToNextStep = () => {
    if (popup.onNext) popup.onNext();
    setPopup({ ...popup, show: false });
  };

  const retryStep = () => setPopup({ ...popup, show: false });

  return (
    <>
      <Header />
      <div className="hospital-main-setup">
        {/* <HospitalBredcrumb /> */}
        <div className="bottom-container">


          <main
            className={`hospital-form-box ${step >= 1 ? "repetable-basic" : ""
              }`}
          >
            {step === 0 && (
              <>
                <h2>Let’s Get Started!</h2>

                <form className="hospital-formfill single-column">

                  <div className="hospital-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      placeholder="+91 00000 00000"
                      value={mobile}
                      maxLength="10"
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <div className="hospital-group">
                    <label>Enter 4-digit OTP</label>
                    <input
                      type="text"
                      placeholder="****"
                      value={otp}
                      maxLength="4"
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <div className="hospital-group">
                    <label>
                      Name of the Hospital<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="hospital-group">
                    <label>
                      Create Password <sup>*</sup>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />                  </div>

                  <div className="hospital-group">
                    <label>
                      Re-enter Password <sup>*</sup>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />                  </div>

                  <button type="button" className="submit-btn" onClick={handleSubmit}>
                    Submit
                  </button>

                </form>
              </>
            )}

          </main>


        </div>

        {popup.show && (
          <StepPopup
            step={step}
            message={popup.message}
            error={popup.error}
            onClose={retryStep}
            onNext={goToNextStep}
            userId={userId}
            form={form}
          />
        )}
      </div>
    </>
  );
};

export default HospitalSignIn;
