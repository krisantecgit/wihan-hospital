import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Select from "react-select";
import axiosConfig from "../../Service/AxiosConfig";
import "./BasicInformation.css";
const ContactInformation = forwardRef(({ form, setForm }, ref) => {
  const [errors, setErrors] = useState({});
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const fetchStates = async () => {
      try {
        const res = await axiosConfig.get(
          "/masters/states/?is_suspended=false",
          {
            signal: controller.signal,
          }
        );
        const options = res.data.results.map((s) => ({
          label: s.state_name,
          value: s.id,
        }));
        setStateOptions(options);
        if (form.state && !form.state.value && typeof form.state === "object") {
          setForm((prev) => ({
            ...prev,
            state: { label: form.state.state_name, value: form.state.id },
          }));
        }
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!form.state?.value) {
      setDistrictOptions([]);
      setCityOptions([]);
      return;
    }

    const controller = new AbortController();
    const fetchDistricts = async () => {
      try {
        const res = await axiosConfig.get(
          `/masters/districts/?state=${
            form?.state?.value || ""
          }&is_suspended=false`,
          { signal: controller.signal }
        );
        const options = res.data.results.map((d) => ({
          label: d.district_name,
          value: d.id,
        }));
        setDistrictOptions(options);
        if (
          form.district &&
          !form.district.value &&
          typeof form.district === "object"
        ) {
          setForm((prev) => ({
            ...prev,
            district: {
              label: form.district.district_name,
              value: form.district.id,
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    };
    fetchDistricts();
    return () => controller.abort();
  }, [form.state]);
  useEffect(() => {
    if (!form.district?.value) {
      setCityOptions([]);
      return;
    }

    const controller = new AbortController();
    const fetchCities = async () => {
      try {
        const res = await axiosConfig.get(
          `/masters/cities/?district=${
            form?.district?.value || ""
          }&is_suspended=false`,
          { signal: controller.signal }
        );
        const options = res.data.results.map((c) => ({
          label: c.city_name,
          value: c.id,
        }));
        setCityOptions(options);

        if (form.city && !form.city.value && typeof form.city === "object") {
          setForm((prev) => ({
            ...prev,
            city: { label: form.city.city_name, value: form.city.id },
          }));
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
    return () => controller.abort();
  }, [form.district]);
  const handleStateChange = (option) => {
    setForm((prev) => ({
      ...prev,
      state: option,
      district: null,
      city: null,
    }));
  };

  const handleDistrictChange = (option) => {
    setForm((prev) => ({
      ...prev,
      district: option,
      city: null,
    }));
  };

  const handleCityChange = (option) => {
    setForm((prev) => ({
      ...prev,
      city: option,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.door_no?.trim()) newErrors.door_no = "Address is required";

    if (form.pin_code && !/^\d{6}$/.test(form.pin_code))
      newErrors.pin_code = "Enter a valid 6-digit Pin Code";
    if (form.phone_1 && !/^\d{10}$/.test(form.phone_1))
      newErrors.phone_1 = "Enter valid 10-digit Phone 1";
    if (form.phone_2 && !/^\d{10}$/.test(form.phone_2))
      newErrors.phone_2 = "Enter valid 10-digit Phone 2";
    if (form.mobile_no && !/^\d{10}$/.test(form.mobile_no))
      newErrors.mobile_no = "Enter valid 10-digit Mobile Number";
    if (form.emergency_contact && !/^\d{10}$/.test(form.emergency_contact))
      newErrors.emergency_contact = "Enter valid 10-digit Emergency Contact";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({ validate }));

  return (
    <>
      <h2>Contact Information</h2>
      <form className="repeat-form" onSubmit={(e) => e.preventDefault()}>
        <div className="repeat-group">
          <label>
            Door No / Premises Name<sup>*</sup>
          </label>
          <input
            type="text"
            name="door_no"
            value={form.door_no || ""}
            onChange={handleChange}
            placeholder="Enter Address"
          />
          {errors.door_no && <span className="error">{errors.door_no}</span>}
        </div>
        <div className="repeat-group">
          <label>Landmark</label>
          <input
            type="text"
            name="landmark"
            value={form.landmark || ""}
            onChange={handleChange}
            placeholder="Landmark"
          />
        </div>
        <div className="repeat-group">
          <label>Area/Location</label>{" "}
          <input
            type="text"
            name="area"
            value={form.area || ""}
            onChange={handleChange}
            placeholder="Area"
          />
        </div>
        <div className="repeat-group">
          <label>State</label>
          <Select
            options={stateOptions}
            value={form.state || null}
            onChange={handleStateChange}
            placeholder="Select State"
          />
          {errors.state && <span className="error">{errors.state}</span>}
        </div>

        <div className="repeat-group">
          <label>District</label>
          <Select
            options={districtOptions}
            value={form.district || null}
            onChange={handleDistrictChange}
            placeholder="Select District"
            isDisabled={!form.state}
          />
          {errors.district && <span className="error">{errors.district}</span>}
        </div>

        <div className="repeat-group">
          <label>City/Town</label>
          <Select
            options={cityOptions}
            value={form.city || null}
            onChange={handleCityChange}
            placeholder="Select City"
            isDisabled={!form.district}
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div className="repeat-group">
          <label>Pin Code</label>
          <input
            type="text"
            name="pin_code"
            value={form.pin_code || ""}
            onChange={handleChange}
            placeholder="6-digit Pin Code"
            maxLength={6}
          />
          {errors.pin_code && <span className="error">{errors.pin_code}</span>}
        </div>

        <div className="repeat-group">
          <label>Contact Person</label>
          <input
            type="text"
            name="contact_person"
            value={form.contact_person || ""}
            onChange={handleChange}
            placeholder="Contact Person"
          />
          {errors.contact_person && (
            <span className="error">{errors.contact_person}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>Phone 1</label>
          <input
            type="text"
            name="phone_1"
            value={form.phone_1 || ""}
            onChange={handleChange}
            placeholder="0000000000"
            maxLength={10}
          />
          {errors.phone_1 && <span className="error">{errors.phone_1}</span>}
        </div>

        <div className="repeat-group">
          <label>Phone 2</label>
          <input
            type="text"
            name="phone_2"
            value={form.phone_2 || ""}
            onChange={handleChange}
            placeholder="0000000000"
            maxLength={10}
          />
          {errors.phone_2 && <span className="error">{errors.phone_2}</span>}
        </div>

        <div className="repeat-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile_no"
            value={form.mobile_no || ""}
            onChange={handleChange}
            placeholder="0000000000"
            maxLength={10}
          />
          {errors.mobile_no && (
            <span className="error">{errors.mobile_no}</span>
          )}
        </div>

        <div className="repeat-group">
          <label>Emergency Contact</label>
          <input
            type="text"
            name="emergency_contact"
            value={form.emergency_contact || ""}
            onChange={handleChange}
            placeholder="0000000000"
            maxLength={10}
          />
          {errors.emergency_contact && (
            <span className="error">{errors.emergency_contact}</span>
          )}
        </div>
      </form>
    </>
  );
});

export default ContactInformation;
