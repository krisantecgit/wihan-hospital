import React from "react";
import "./DepartmentCard.css";

function DepartmentCard({ userData }) {
  const departments = [
    {
      title: "Front Office",
      name: userData?.support_staff?.[0]?.name,
      role: userData?.support_staff?.[0]?.role,
      phone: userData?.support_staff?.[0]?.mobile,
      email: userData?.support_staff?.[0]?.email,
    },
    {
      title: "Billing Department",
      name: userData?.support_staff?.[1]?.name,
      role: userData?.support_staff?.[1]?.role,
      phone: userData?.support_staff?.[1]?.mobile,
      email: userData?.support_staff?.[1]?.email,
      selected: true,
    },
  ];
  return (
    <div className="department-card">
      {departments.map((department, index) => (
        <div className="department-card-content">
          <h2 className="department-card-title">{department?.title}</h2>
          <p>
            <span className="department-icon">👤</span> {department?.name} -{" "}
            {department.role}
          </p>
          <p>
            <span className="department-icon">📞</span> {department?.phone}
          </p>
          <p>
            <span className="department-icon">📧</span> {department?.email}
          </p>
          <button className="department-edit">Edit</button>
        </div>
      ))}
    </div>
  );
}

export default DepartmentCard;
