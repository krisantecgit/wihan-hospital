import React from "react";
import "./ProfileContent.css";
const ProfileContent = ({ userData }) => {
  const hospitalDetails = [
    { label: "Name of the hospital", value: userData?.name },
    { label: "Year of Establishment", value: userData?.year_of_establishment },
    { label: "Bed Strength", value: userData?.bed_strength },
    { label: "Registered With", value: userData?.registered_with },
    { label: "Registered No", value: userData?.registration_no },
    {
      label: "Name of The MD / CEO / Chairman",
      value: userData?.md_ceo_chairman,
    },
    { label: "Designation", value: userData?.designation },
    { label: "Contact Number", value: userData?.contact_no },
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

export default ProfileContent;
