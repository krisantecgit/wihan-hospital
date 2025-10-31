import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axiosConfig from "../../Service/AxiosConfig";

const SupportStaff = forwardRef(({ form, setForm }, ref) => {
  const [staffList, setStaffList] = useState([]);
  const [errors, setErrors] = useState({});
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchSupportStaff = async () => {
      try {
        const res = await axiosConfig.get(
          `/hospital/hospitals/?user=${user_id}`
        );
        const hospital = res.data.results?.[0];
        setStaffList(
          hospital?.support_staff?.length
            ? hospital.support_staff
            : [
                {
                  role: "Support Staff",
                  name: "",
                  designation: "",
                  mobile: "",
                  email: "",
                },
                {
                  role: "Information Provider",
                  name: "",
                  designation: "",
                  mobile: "",
                  email: "",
                },
              ]
        );
      } catch (err) {
        console.error("Failed to fetch support staff:", err);
      }
    };
    if (user_id) fetchSupportStaff();
  }, [user_id]);

  const handleChange = (index, field, value) => {
    const updated = [...staffList];

    if (field === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        updated[index][field] = value;
        const newErrors = { ...errors };
        if (value && value.length !== 10) {
          newErrors[`mobile${index}`] = "Mobile must be 10 digits";
        } else {
          newErrors[`mobile${index}`] = "";
        }
        setErrors(newErrors);
        setStaffList(updated);
      }
    } else if (field === "email") {
      updated[index][field] = value;
      const newErrors = { ...errors };
      if (value && !validateEmail(value)) {
        newErrors[`email${index}`] = "Invalid email format";
      } else {
        newErrors[`email${index}`] = "";
      }
      setErrors(newErrors);
      setStaffList(updated);
    } else {
      updated[index][field] = value;
      setStaffList(updated);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useImperativeHandle(ref, () => ({
    validateAndSubmit: async () => {
      try {
        const res = await axiosConfig.patch(`/hospital/hospitals/${form.id}/`, {
          support_staff: staffList,
          profile_completed: true,
        });
        setForm((prev) => ({
          ...prev,
          support_staff: staffList,
          profile_completed: true,
        }));
        localStorage.setItem("profile_completed", true);
        return { success: true, data: res.data };
      } catch (err) {
        console.error("Failed to submit support staff:", err);
        return { success: false };
      }
    },
  }));

  return (
    <>
      <h2>Support Staff Available</h2>
      <p className="last-subtitle">
        Add key support staff members to your profile
      </p>

      {staffList.map((staff, index) => (
        <div key={index}>
          {staff.role === "Information Provider" && (
            <div className="info-divider">Information Provider</div>
          )}

          <div className="repeat-form">
            {["name", "designation", "mobile", "email"].map((field) => (
              <div className="repeat-group" key={field}>
                <label>
                  {field === "mobile"
                    ? "Mobile Number"
                    : field === "email"
                    ? "Email ID"
                    : field === "name"
                    ? "Name"
                    : "Designation"}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={staff[field]}
                  onChange={(e) => handleChange(index, field, e.target.value)}
                  placeholder={
                    field === "mobile"
                      ? "0000000000"
                      : field === "email"
                      ? "example@gmail.com"
                      : field
                  }
                />
                {errors[`${field}${index}`] && (
                  <span className="error">{errors[`${field}${index}`]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
});

export default SupportStaff;
