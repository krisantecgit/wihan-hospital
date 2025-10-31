import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./ServiceAvailable.css";
import { IoMdAddCircle } from "react-icons/io";
import axiosConfig from "../../Service/AxiosConfig";

const ServiceAvailable = forwardRef(({ form, setForm }, ref) => {
  const [activeTab, setActiveTab] = useState("");
  const [facility, setFacility] = useState([]);
  const [services, setServices] = useState({});
  const [checkedServices, setCheckedServices] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newService, setNewService] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otherServices, setOtherServices] = useState([]);
  const user_id = localStorage.getItem("user_id");
  let refreshTimeout = null;

  const deduplicateServices = (arr) => {
    const seen = new Set();
    return arr.filter((s) => {
      const key = `${s.facilities}_${s.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  useEffect(() => {
    const controller = new AbortController();
    const fetchFacilities = async () => {
      try {
        const res = await axiosConfig.get(
          "/masters/hospital-facilities/?is_suspended=false",
          { signal: controller.signal }
        );
        const data = res?.data?.results.map((f) => ({
          id: f.id,
          name: f.name,
        }));
        setFacility(data);
        if (data.length > 0) setActiveTab(data[0].name);
        refreshHospitalData();
      } catch (err) {
        console.error("Error fetching facilities:", err);
      }
    };
    fetchFacilities();
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!form?.id) return;

    const checkedMap = {};
    form.services?.forEach((srv) => {
      const facilityId = srv.facility?.id || srv.facilities;
      if (facilityId) {
        if (!checkedMap[facilityId]) checkedMap[facilityId] = [];
        checkedMap[facilityId].push(String(srv.id));
      }
    });

    form.other_services?.forEach((s) => {
      const facilityId = s.facilities;
      if (facilityId) {
        if (!checkedMap[facilityId]) checkedMap[facilityId] = [];
        checkedMap[facilityId].push(String(s.id));
      }
    });

    setCheckedServices(checkedMap);
    setOtherServices(
      (form.other_services || []).map((s) => ({ ...s, isNew: false }))
    );
  }, [form?.id, form?.services, form?.other_services]);

  useEffect(() => {
    if (!activeTab) return;
    const controller = new AbortController();
    const activeFacility = facility.find((f) => f.name === activeTab);
    if (!activeFacility) return;

    const fetchServices = async () => {
      try {
        const res = await axiosConfig.get(
          `/masters/facility-services/?facility=${activeFacility.id}&is_suspended=false`,
          { signal: controller.signal }
        );
        const data = res.data.results.map((s) => ({
          id: String(s.id),
          name: s.name,
        }));

        const merged = [
          ...data,
          ...otherServices
            .filter((o) => o.facilities === activeFacility.id)
            .map((o) => ({
              id: String(o.id),
              name: o.service,
              isCustom: true,
            })),
        ];

        setServices((prev) => ({ ...prev, [activeTab]: merged }));
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
    return () => controller.abort();
  }, [activeTab, facility, otherServices]);

  const refreshHospitalData = () => {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(async () => {
      try {
        const res = await axiosConfig.get(
          `/hospital/hospitals/?user=${user_id}`
        );
        if (res?.data?.results?.length > 0) {
          const updated = res.data.results[0];
          updated.other_services = deduplicateServices(
            updated.other_services || []
          );
          setForm(updated);

          const reloaded = updated.other_services.map((s) => ({
            ...s,
            isNew: false,
          }));
          setOtherServices(reloaded);

          const map = {};
          updated.services?.forEach((srv) => {
            const fid = srv.facilities || srv.facility?.id;
            if (fid) {
              if (!map[fid]) map[fid] = [];
              map[fid].push(String(srv.id));
            }
          });
          updated.other_services.forEach((s) => {
            if (!map[s.facilities]) map[s.facilities] = [];
            if (!map[s.facilities].includes(String(s.id))) {
              map[s.facilities].push(String(s.id));
            }
          });
          setCheckedServices(map);
        }
      } catch (err) {
        console.error("Error refreshing hospital data:", err);
      }
    }, 500);
  };

  const handleCheckboxChange = async (facilityId, serviceId) => {
    serviceId = String(serviceId);
    setCheckedServices((prev) => {
      const prevList = prev[facilityId] || [];
      const isAlreadyChecked = prevList.includes(serviceId);
      if (isAlreadyChecked) {
        const newList = prevList.filter((id) => id !== serviceId);
        const isCustom = serviceId.startsWith("custom_")
          ? true
          : otherServices.some((o) => String(o.id) === serviceId);

        if (isCustom) {
          const matchedOther = otherServices.find(
            (o) => String(o.id) === serviceId && !o.isNew
          );
          if (matchedOther) {
            axiosConfig
              .delete(`/hospital/hospital-other-services/${matchedOther.id}/`)
              .then(() => refreshHospitalData())
              .catch((err) =>
                console.error("Error removing other_service:", err)
              );
          }
        } else {
          axiosConfig
            .delete(
              `/hospital/hospitals/${form.id}/remove-service/${serviceId}/`
            )
            .then(() => refreshHospitalData())
            .catch((err) => console.error("Error removing service:", err));
        }

        return { ...prev, [facilityId]: newList };
      }
      return { ...prev, [facilityId]: [...prevList, serviceId] };
    });
  };

  const handleAddOther = () => {
    const trimmed = newService.trim();
    if (!trimmed) return;
    const activeFacility = facility.find((f) => f.name === activeTab);
    if (!activeFacility) return;

    const current = services[activeTab] || [];
    if (current.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage("This service already exists under this facility!");
      return;
    }

    const newId = `custom_${activeFacility.id}_${Date.now()}`;
    const newObj = {
      id: newId,
      facilities: activeFacility.id,
      service: trimmed,
      isNew: true,
    };

    setOtherServices((prev) => [...prev, newObj]);
    setServices((prev) => ({
      ...prev,
      [activeTab]: [...current, { id: newId, name: trimmed, isCustom: true }],
    }));
    setCheckedServices((prev) => ({
      ...prev,
      [activeFacility.id]: [...(prev[activeFacility.id] || []), newId],
    }));

    setNewService("");
    setIsPopupOpen(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    setNewService(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  // const handleSubmit = async () => {
  //   try {
  //     const numericServiceSet = new Set();
  //     const customMap = {};

  //     Object.entries(checkedServices).forEach(([facilityIdRaw, ids]) => {
  //       const facilityId = String(facilityIdRaw);
  //       const facilityObj = facility.find((f) => String(f.id) === facilityId);
  //       const tabName = facilityObj?.name;
  //       const svcList = tabName ? services[tabName] || [] : [];

  //       ids.forEach((checkedIdRaw) => {
  //         const checkedId = String(checkedIdRaw);
  //         if (checkedId.startsWith("custom_")) {
  //           const matched = otherServices.find(
  //             (o) => String(o.id) === checkedId
  //           );
  //           if (matched && matched.isNew) {
  //             customMap[String(matched.id)] = matched;
  //           }
  //           return;
  //         }

  //         const matchedItem = svcList.find((s) => String(s.id) === checkedId);
  //         if (matchedItem && !matchedItem.isCustom) {
  //           const num = Number(checkedId);
  //           if (Number.isFinite(num)) numericServiceSet.add(num);
  //         }
  //       });
  //     });

  //     const numericServicesArray = Array.from(new Set(numericServiceSet));
  //     const otherServicesArray = deduplicateServices(Object.values(customMap));

  //     const payload = {
  //       services: numericServicesArray,
  //       ...(otherServicesArray.length > 0 && {
  //         other_services: otherServicesArray,
  //       }),
  //     };

  //     await axiosConfig.patch(`/hospital/hospitals/${form.id}/`, payload);
  //     refreshHospitalData();
  //     return true;
  //   } catch (error) {
  //     console.error("❌ Error submitting services:", error);
  //     return false;
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const allCheckedServiceIds = [];
      const allCustomServices = [];

      Object.entries(checkedServices).forEach(([facilityId, ids]) => {
        ids.forEach((id) => {
          if (id.startsWith("custom_")) {
            // Find matching custom service
            const custom = otherServices.find((o) => String(o.id) === id);
            if (custom) allCustomServices.push(custom);
          } else {
            allCheckedServiceIds.push(Number(id));
          }
        });
      });

      const numericServicesArray = Array.from(new Set(allCheckedServiceIds));
      const otherServicesArray = deduplicateServices(allCustomServices);

      const payload = {
        services: numericServicesArray,
        other_services: otherServicesArray,
      };

      await axiosConfig.patch(`/hospital/hospitals/${form.id}/`, payload);
      refreshHospitalData();
      return true;
    } catch (error) {
      console.error("❌ Error submitting services:", error);
      return false;
    }
  };

  const validate = () => {
    const hasSelected =
      Object.values(checkedServices).some((arr) => arr.length > 0) ||
      otherServices.some((s) => s.isNew);
    return hasSelected;
  };

  useImperativeHandle(ref, () => ({ handleSubmit, validate }));

  return (
    <>
      <h2>Facilities / Services Available</h2>

      <div className="tabs">
        {facility.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="services">
        {(services[activeTab] || []).map((service) => {
          const activeFacility = facility.find((f) => f.name === activeTab);
          return (
            <label key={service.id} className="service-item">
              <input
                type="checkbox"
                className="service-checkbox"
                checked={
                  checkedServices[activeFacility?.id]?.includes(
                    String(service.id)
                  ) || false
                }
                onChange={() =>
                  handleCheckboxChange(activeFacility?.id, service.id)
                }
              />
              {service.name}
            </label>
          );
        })}

        <button
          type="button"
          className="others-button"
          onClick={() => setIsPopupOpen(true)}
        >
          <IoMdAddCircle size={24} />
          Others If Any
        </button>
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="popup-close"
              onClick={() => {
                setIsPopupOpen(false);
                setErrorMessage("");
              }}
            >
              &times;
            </button>
            <h3>Add {activeTab} Service</h3>
            <input
              type="text"
              value={newService}
              onChange={handleInputChange}
              placeholder={`Add new service under ${activeTab}`}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="popup-actions">
              <button onClick={handleAddOther}>Add</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ServiceAvailable;
