import React from "react";
const DashboardContact = ({ userData }) => {
  const hospitalDetails = [
    { label: "Door No / Premises Name", value: userData?.door_no },
    { label: "Land Mark", value: userData?.landmark },
    { label: "Area/Location", value: userData?.area },
    { label: "State", value: userData?.state?.state_name },
    { label: "District", value: userData?.district?.district_name },
    { label: "City/Town", value: userData?.city?.city_name },
    { label: "Pin", value: userData?.pin_code },
    { label: "Contact Person", value: userData?.contact_person },
    { label: "Phone 1", value: userData?.phone_1 },
    { label: "Phone 2", value: userData?.phone_2 },
    { label: "Mobile", value: userData?.mobile_no },
    { label: "Emergency Contact", value: userData?.emergency_contact },
  ];
  return (
    <div className="quick-stats">
      {hospitalDetails.map((item, index) => (
        <div key={index} className="flex-quick">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
      <button type="button" className="quick-edit">
        Edit
      </button>
    </div>
  );
};

export default DashboardContact;
