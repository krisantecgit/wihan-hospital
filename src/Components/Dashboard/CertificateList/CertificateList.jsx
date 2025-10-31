import React from "react";
import "./CerticateList.css";
import { RiArrowDownCircleLine } from "react-icons/ri";

function CertificateList({ userData }) {
  const handleDownload = (fileUrl, fileName) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || "certificate";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="certificates">
      <div className="certificates-container">
        <h4 className="certificates-heading">Certificates</h4>

        <div className="certificates-list">
          {userData?.hospital_documents?.map((cert, index) => (
            <div key={index} className="certificate-item">
              <span>{cert?.document_type}</span>

              <div className="certificate-actions">
                <a
                  href={cert?.document_url}
                  className="view-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
                <RiArrowDownCircleLine
                  className="certificate-download"
                  size={24}
                  onClick={() =>
                    handleDownload(
                      cert?.document_url,
                      `${cert?.document_type || "certificate"}.pdf`
                    )
                  }
                  title="Download Certificate"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="certificate-button">Edit</button>
    </div>
  );
}

export default CertificateList;
