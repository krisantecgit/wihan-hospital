import React, { useState, useEffect } from "react";
import "./Facility.css";
import { LuSquareCheckBig } from "react-icons/lu";

const Facility = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("");
  const [selected, setSelected] = useState({});
  const servicesFacilities =
    userData?.services?.map((s) => ({
      id: s.facility?.id,
      name: s.facility?.name,
    })) || [];
  const otherFacilities =
    userData?.other_services?.map((o) => ({
      id: o.facilities,
      name:
        servicesFacilities.find((sf) => sf.id === o.facilities)?.name ||
        `Facility ${o.facilities}`,
    })) || [];
  const facilities = Array.from(
    new Map(
      [...servicesFacilities, ...otherFacilities].map((f) => [f.id, f])
    ).values()
  );

  const groupedServices = {};
  facilities.forEach((facility) => {
    groupedServices[facility.name] = [
      ...(userData?.services
        ?.filter((s) => s.facility?.id === facility.id)
        ?.map((s) => s.name) || []),
      ...(userData?.other_services
        ?.filter((o) => o.facilities === facility.id)
        ?.map((o) => o.service) || []),
    ];
  });

  useEffect(() => {
    if (facilities.length && !activeTab) {
      setActiveTab(facilities[0].name);
    }
  }, [facilities, activeTab]);

  useEffect(() => {
    const preselected = {};
    userData?.services?.forEach((s) => (preselected[s.name] = true));
    userData?.other_services?.forEach((o) => (preselected[o.service] = true));
    setSelected(preselected);
  }, [userData]);

  const toggleService = (service) => {
    setSelected((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  return (
    <div className="facility-container">
      <div className="tabs">
        {facilities.map((facility) => (
          <button
            key={facility.id}
            className={`tab-button ${
              activeTab === facility.name ? "active" : ""
            }`}
            onClick={() => setActiveTab(facility.name)}
          >
            {facility.name}
          </button>
        ))}
      </div>

      <div className="facility-grid">
        {groupedServices[activeTab]?.map((service) => (
          <div
            key={service}
            className={`facility-item ${selected[service] ? "selected" : ""}`}
            onClick={() => toggleService(service)}
          >
            <span>{service}</span>
            <span className="facility-checkbox">
              {selected[service] && (
                <LuSquareCheckBig size={20} color="green" />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facility;
