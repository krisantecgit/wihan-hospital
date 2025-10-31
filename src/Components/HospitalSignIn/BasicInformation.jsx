import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import Select from "react-select";
import { HiOutlineUpload } from "react-icons/hi";
import "./BasicInformation.css";
const BasicInformation = forwardRef(({ form, setForm }, ref) => {
  const currentYear = new Date().getFullYear();
  const [errors, setErrors] = useState({});
  const options = [
    { value: "Govt", label: "Govt" },
    { value: "Private", label: "Private" },
    { value: "Trust", label: "Trust" },
    { value: "Others", label: "Others" },
  ];

  useImperativeHandle(ref, () => ({
    validateBasicData: () => {
      let newErrors = {};
      const name = form.name?.trim?.() || "";
      const year = form.year_of_establishment;
      if (!name) {
        newErrors.name = "Hospital Name is required";
      }
      const currentYear = new Date().getFullYear();
      if (year) {
        if (!/^\d{4}$/.test(year)) {
          newErrors.year_of_establishment = "Enter a valid 4-digit year";
        } else if (parseInt(year) > currentYear) {
          newErrors.year_of_establishment = `Enter a year ≤ ${currentYear}`;
        }
      }

      if (form.contact_no && !/^[0-9]{10}$/.test(form.contact_no)) {
        newErrors.contact_no = "Enter valid 10-digit number";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact_no") {
      if (!/^\d*$/.test(value)) return;
      const updatedForm = { ...form, [name]: value };
      const newErrors = {};
      if (value && !/^[0-9]{10}$/.test(value)) {
        newErrors.contact_no = "Enter a valid 10-digit number";
      }
      setForm(updatedForm);
      return;
    }
    setForm({ ...form, [name]: value });
  };

  return (
    <>
      <h2>Basic Profile Setup</h2>
      <form className="repeat-form" onSubmit={(e) => e.preventDefault()}>
        <div className="repeat-group">
          <label>
            Name of Hospital / Diagnostic Centre<sup>*</sup>
          </label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Hospital Name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="repeat-group">
          <label>Year of Establishment</label>
          <input
            type="number"
            name="year_of_establishment"
            value={form.year_of_establishment || ""}
            onChange={(e) => {
              const year = e.target.value;
              if (year.length <= 4)
                setForm((prev) => ({ ...prev, year_of_establishment: year }));
            }}
            placeholder="YYYY"
            min="1900"
            max={new Date().getFullYear()}
          />
          {errors.year_of_establishment && (
            <span className="error">{errors.year_of_establishment}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>Bed Strength</label>
          <input
            type="number"
            name="bed_strength"
            value={form.bed_strength || ""}
            onChange={handleChange}
            placeholder="000"
          />
          {errors.bed_strength && (
            <span className="error">{errors.bed_strength}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>Registered With</label>
          <Select
            options={options}
            value={
              options.find((o) => o.value === form.registered_with) || null
            }
            onChange={(option) =>
              setForm({ ...form, registered_with: option.value })
            }
          />
          {errors.registered_with && (
            <span className="error">{errors.registered_with}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>Registration No.</label>
          <input
            type="text"
            name="registration_no"
            value={form.registration_no || ""}
            placeholder="Registration No"
            onChange={handleChange}
          />
          {errors.registration_no && (
            <span className="error">{errors.registration_no}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>MD / CEO / Chairman</label>
          <input
            type="text"
            name="md_ceo_chairman"
            value={form.md_ceo_chairman || ""}
            onChange={handleChange}
            placeholder="Name"
          />
          {errors.md_ceo_chairman && (
            <span className="error">{errors.md_ceo_chairman}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={form.designation || ""}
            onChange={handleChange}
            placeholder="Designation"
          />
        </div>

        <div className="repeat-group">
          <label>Contact No.</label>
          <input
            type="text"
            name="contact_no"
            value={form.contact_no || ""}
            maxLength={10}
            onChange={handleChange}
            placeholder="Enter 10-digit number"
          />
          {errors.contact_no && (
            <span className="error">{errors.contact_no}</span>
          )}
        </div>
      </form>
    </>
  );
});

export default BasicInformation;
