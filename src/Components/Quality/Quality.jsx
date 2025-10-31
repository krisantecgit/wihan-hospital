import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import "./Quality.css";
import { IoMdAddCircle } from "react-icons/io";
import { HiOutlineUpload } from "react-icons/hi";
import axiosConfig from "../../Service/AxiosConfig";
const accreditations = ["ISO", "NABH", "NABL", "JCI"];
const Quality = forwardRef(({ form, setForm }, ref) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewMap, setPreviewMap] = useState({});
  const fileInputRef = useRef(null);

  const user_id = localStorage.getItem("user_id");

  const fetchAccreditationImages = async () => {
    try {
      const res = await axiosConfig.get(`/hospital/hospitals/?user=${user_id}`);
      const hospital = res.data.results?.[0];

      if (hospital?.hospital_documents?.length) {
        const previews = {};
        hospital.hospital_documents.forEach((doc) => {
          previews[doc.document_type] = doc.document_url;
        });
        setPreviewMap(previews);
      }
    } catch (err) {
      console.error("Error fetching hospital documents:", err);
    }
  };

  useEffect(() => {
    if (user_id) fetchAccreditationImages();
  }, [user_id]);

  useImperativeHandle(ref, () => ({
    handleQualitySubmit: async () => {
      try {
        if (uploadedFiles.length === 0) {
          return { success: true, message: "No files uploaded" };
        }

        const formData = new FormData();
        uploadedFiles.forEach((fileObj, index) => {
          formData.append(`documents[${index}].file`, fileObj.image);
          formData.append(`documents[${index}].type`, fileObj.type);
        });

        await axiosConfig.patch(`/hospital/hospitals/${form.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await fetchAccreditationImages();
        return { success: true, message: "All files saved successfully!" };
      } catch (error) {
        console.error("Error uploading files:", error);
        return {
          success: false,
          message: error?.response?.data?.error || "Failed to save files",
        };
      }
    },
  }));

  const handleAddAccreditation = () => {
    if (!type.trim() || !image) return;

    const newItem = { type, image };

    setUploadedFiles((prev) => {
      const existingIndex = prev.findIndex((item) => item.type === type);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      }
      return [...prev, newItem];
    });

    setPreviewMap((prev) => ({
      ...prev,
      [type]: URL.createObjectURL(image),
    }));

    setType("");
    setImage(null);
    setIsPopupOpen(false);
  };

  const handleFileSelect = (file, type) => {
    if (!file) return;
    const newItem = { type, image: file };
    setUploadedFiles((prev) => {
      const existingIndex = prev.findIndex((item) => item.type === type);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      }
      return [...prev, newItem];
    });

    setPreviewMap((prev) => ({
      ...prev,
      [type]: URL.createObjectURL(file),
    }));
  };

  const handleCardClick = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.type = type;
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const selectedType = e.target.dataset.type;
    handleFileSelect(e.target.files[0], selectedType);
    e.target.value = "";
  };

  return (
    <>
      <h2>Quality Accreditations</h2>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <div className="accreditation-grid">
        {accreditations.map((item) => (
          <div
            key={item}
            className="accreditation-card"
            onClick={() => handleCardClick(item)}
          >
            {previewMap[item] ? (
              <img
                src={previewMap[item]}
                alt={item}
                className="preview-image"
              />
            ) : (
              <div className="upload-icon">
                <HiOutlineUpload />
              </div>
            )}
            <strong>{item}</strong>
            {!previewMap[item] && <p>Click to upload</p>}
          </div>
        ))}
        {Object.keys(previewMap)
          .filter((key) => !accreditations.includes(key))
          .map((type) => (
            <div key={type} className="accreditation-card">
              <img
                src={previewMap[type]}
                alt={type}
                className="preview-image"
              />
              <strong>{type}</strong>
            </div>
          ))}
      </div>

      <button
        type="button"
        className="others-button"
        onClick={() => setIsPopupOpen(true)}
      >
        <IoMdAddCircle size={24} />
        Others If Any
      </button>
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="popup-close"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>
            <h3>Add Accreditation</h3>

            <input
              type="text"
              placeholder="Enter Accreditation Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="popup-actions">
              <button
                onClick={handleAddAccreditation}
                disabled={!type.trim() || !image}
              >
                Add
              </button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Quality;
