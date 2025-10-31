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
          const response = await axiosConfig.patch(
            `/hospital/hospitals/${form.id}/`,
            {
              name: form.name,
              year_of_establishment: form.year_of_establishment,
              bed_strength: form.bed_strength,
              registered_with: form.registered_with,
              registration_no: form.registration_no || null,
              md_ceo_chairman: form.md_ceo_chairman,
              designation: form.designation,
              contact_no: form.contact_no,
              profile: form.profile,
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
        const success =
          serviceRef.current && (await serviceRef.current.handleSubmit());

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

  const goToNextStep = () => {
    if (popup.onNext) popup.onNext();
    setPopup({ ...popup, show: false });
  };

  const retryStep = () => setPopup({ ...popup, show: false });

  return (
    <>
      <Header />
      <div className="hospital-main-setup">
        <HospitalBredcrumb />
        <div className="bottom-container">
          <div className="items-flex">
            <h6>PROFILE SETUP</h6>
            <strong>00 XP</strong>
          </div>
          <ProgressBar
            completed={((step + 1) / totalSteps) * 100}
            className="progress-bar"
            bgColor="var(--color-blue)"
            baseBgColor="#e0e0de"
            height="12px"
            isLabelVisible={false}
            style={{ borderRadius: "8px", margin: "10px 0" }}
          />

          <main
            className={`hospital-form-box ${
              step >= 1 ? "repetable-basic" : ""
            }`}
          >
            {step === 0 && (
              <>
                <h2>Let’s Get Started!</h2>
                <form className="hospital-formfill">
                  <div className="hospital-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      value={mobile}
                      maxLength="10"
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                  <div className="hospital-group">
                    <label>
                      OTP{" "}
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={resendTimer > 0}
                        className="resend"
                      >
                        {resendTimer > 0
                          ? `Resend in ${resendTimer}s`
                          : "Resend"}
                      </button>
                    </label>
                    <input
                      ref={otpInputRef}
                      type="text"
                      value={otp}
                      maxLength="4"
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {otp.length > 0 && otp.length !== 4 && (
                      <span className="otp-error">Enter 4-digit OTP</span>
                    )}
                  </div>
                </form>
              </>
            )}
            {step === 1 && (
              <BasicInformation
                ref={basicInfoRef}
                form={form}
                setForm={setForm}
              />
            )}
            {step === 2 && (
              <ContactInformation
                ref={contactInfoRef}
                form={form}
                setForm={setForm}
              />
            )}
            {step === 3 && (
              <ServiceAvailable
                ref={serviceRef}
                form={form}
                setForm={setForm}
              />
            )}
            {step === 4 && (
              <Quality ref={qualityRef} form={form} setForm={setForm} />
            )}
            {step === 5 && (
              <SupportStaff ref={supportRef} form={form} setForm={setForm} />
            )}
          </main>

          <div className="hospital-buttons">
            <button
              className="previous"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              Previous
            </button>
            <button className="next" onClick={handleNext}>
              {step === 5 ? "Finish" : step === 0 ? "Submit" : "Next"}
            </button>
          </div>
        </div>

        {popup.show && (
          <StepPopup
            step={step}
            message={popup.message}
            error={popup.error}
            onClose={retryStep}
            onNext={goToNextStep}
            userId={userId}
          />
        )}
      </div>
    </>
  );
};

export default HospitalSignIn;
