import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { IoMdAddCircle } from "react-icons/io";
import axiosConfig from "../../Service/AxiosConfig";
import "./ServiceAvailable.css";

const ServiceAvailable = forwardRef(({ form, setForm }, ref) => {
  const [facilityList, setFacilityList] = useState([]);
  const [activeFacilityId, setActiveFacilityId] = useState(null);
  const [masterServices, setMasterServices] = useState([]);
  const [selectedMasterIds, setSelectedMasterIds] = useState([]);
  const [otherServices, setOtherServices] = useState([]);
  const [selectedOtherIds, setSelectedOtherIds] = useState({});
  const [saving, setSaving] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [addError, setAddError] = useState("");

  const hospitalId = form?.id;
  useEffect(() => {
    axiosConfig
      .get("/masters/hospital-facilities/?is_suspended=false")
      .then((res) => {
        const list = res.data?.results || [];
        setFacilityList(list);
        if (!activeFacilityId && list.length > 0)
          setActiveFacilityId(list[0].id);
      })
      .catch((err) => console.error("Facility fetch error:", err));
  }, []);
  useEffect(() => {
    if (!activeFacilityId) return;
    axiosConfig
      .get(
        `/masters/facility-services/?facility=${activeFacilityId}&is_suspended=false`
      )
      .then((res) => {
        setMasterServices(
          res.data?.results?.map((s) => ({ id: String(s.id), name: s.name })) ||
            []
        );
      })
      .catch((err) => console.error("Master services fetch error:", err));
  }, [activeFacilityId]);
  useEffect(() => {
    if (!form?.services) return;
    const masters = form.services.map((s) => String(s.id));
    setSelectedMasterIds(masters);
  }, [form?.services]);
  useEffect(() => {
    if (!form?.other_services) return;

    const others = form.other_services.map((o) => ({
      id: String(o.id),
      hospital: Number(o.hospital),
      facilities: Number(o.facilities),
      service: o.service,
      isNew: false,
    }));
    setOtherServices(others);
    const selection = {};
    others.forEach((o) => {
      const key = String(o.facilities);
      if (!selection[key]) selection[key] = [];
      selection[key].push(o.id);
    });
    setSelectedOtherIds(selection);
  }, [form?.other_services]);
  const isMasterSelected = (id) => selectedMasterIds.includes(String(id));
  const isOtherSelected = (id) => {
    const selectedForFacility =
      selectedOtherIds[String(activeFacilityId)] || [];
    return selectedForFacility.includes(id);
  };
  const handleToggleMaster = async (svc) => {
    const id = String(svc.id);
    if (isMasterSelected(id)) {
      try {
        setSaving(true);
        await axiosConfig.delete(
          `/hospital/hospitals/${hospitalId}/remove-service/${id}/`
        );
        setSelectedMasterIds((prev) => prev.filter((x) => x !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    } else {
      setSelectedMasterIds((prev) => [...prev, id]);
    }
  };
  const handleToggleOther = (svc) => {
    const id = String(svc.id);
    const facilityKey = String(activeFacilityId);

    setSelectedOtherIds((prev) => {
      const selectedForFacility = prev[facilityKey] || [];
      const updatedForFacility = selectedForFacility.includes(id)
        ? selectedForFacility.filter((x) => x !== id)
        : [...selectedForFacility, id];
      return { ...prev, [facilityKey]: updatedForFacility };
    });
    if (!otherServices.some((o) => o.id === id)) {
      setOtherServices((prev) => [...prev, svc]);
    }
  };
  const handleAddOtherLocal = () => {
    const txt = newServiceName.trim();
    if (!txt) {
      setAddError("Enter a valid service name");
      return;
    }
    const newId = `temp_${Date.now()}`;
    const newObj = {
      id: newId,
      hospital: Number(hospitalId),
      facilities: Number(activeFacilityId),
      service: txt,
      isNew: true,
    };

    setOtherServices((prev) => [...prev, newObj]);
    setSelectedOtherIds((prev) => {
      const key = String(activeFacilityId);
      const selectedForFacility = prev[key] || [];
      return { ...prev, [key]: [...selectedForFacility, newId] };
    });

    setAddDialogOpen(false);
    setNewServiceName("");
    setAddError("");
  };
  const handleSave = async () => {
    if (!hospitalId) return false;
    try {
      setSaving(true);
      const servicesPayload = selectedMasterIds.map(Number);
      const otherPayload = otherServices
        .filter((o) => {
          const selectedForFacility =
            selectedOtherIds[String(o.facilities)] || [];
          return selectedForFacility.includes(o.id);
        })
        .map((o) => ({
          hospital: Number(hospitalId),
          facilities: Number(o.facilities),
          service: o.service.trim(),
          ...(o.isNew ? {} : { id: Number(o.id) }),
        }));
      const response = await axiosConfig.patch(
        `/hospital/hospitals/${hospitalId}/`,
        {
          services: servicesPayload,
          other_services: otherPayload,
        }
      );
      const res = await axiosConfig.get(`/hospital/hospitals/${hospitalId}/`);

      if (setForm && res?.data) {
        setForm((prev) => ({
          ...prev,
          services: res?.data.services || [],
          other_services: res?.data.other_services || [],
        }));
      }

      return true;
    } catch (err) {
      console.error("Save error:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };
  const validate = () =>
    selectedMasterIds.length > 0 ||
    Object.values(selectedOtherIds).some((arr) => arr.length > 0);

  useImperativeHandle(ref, () => ({
    handleSave,
    validate,
  }));

  return (
    <div>
      <h2>Facilities / Services</h2>
      <div className="tabs">
        {facilityList.map((f) => (
          <button
            key={f.id}
            className={`tab-button ${
              activeFacilityId === f.id ? "active" : ""
            }`}
            onClick={() => setActiveFacilityId(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      <h4>Services</h4>
      <div className="services">
        {masterServices.map((s) => (
          <label key={s.id} className="service-item">
            <input
              type="checkbox"
              className="service-checkbox"
              checked={isMasterSelected(s.id)}
              onChange={() => handleToggleMaster(s)}
            />
            {s.name}
          </label>
        ))}
      </div>

      <h4 className="mt-3">Other Services</h4>
      <div className="services">
        {otherServices
          .filter((o) => Number(o.facilities) === Number(activeFacilityId))
          .map((o) => (
            <label key={o.id} className="service-item">
              <input
                type="checkbox"
                className="service-checkbox"
                checked={isOtherSelected(o.id)}
                onChange={() => handleToggleOther(o)}
              />
              {o.service}
            </label>
          ))}

        <button
          className="others-button"
          onClick={() => setAddDialogOpen(true)}
        >
          <IoMdAddCircle size={24} /> Others If Any
        </button>
      </div>
      {addDialogOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="popup-close"
              onClick={() => setAddDialogOpen(false)}
            >
              &times;
            </button>
            <h3 className="mt-3">Add Other Service</h3>
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => {
                setNewServiceName(e.target.value);
                setAddError("");
              }}
              placeholder="Enter other service name"
            />
            {addError && <p className="error-message">{addError}</p>}
            <div className="popup-actions">
              <button onClick={handleAddOtherLocal}>Add</button>
              <button onClick={() => setAddDialogOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ServiceAvailable;
