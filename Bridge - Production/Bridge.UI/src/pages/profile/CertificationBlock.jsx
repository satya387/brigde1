import React from "react";

const CertificationBlock = ({ employeeData }) => {
  return (
    <div className="profile-details">
      <div className="cont">
        <h2>Certifications</h2>
        <div className="courses">
          <div className="cont">
            {employeeData?.skillMatrix?.certifications
              .split(",")
              .filter((certificate) => certificate.trim() !== "")
              .map((certificate) => (
                <div className="card" key={certificate.trim()}>
                  <h4>{certificate.trim()}</h4>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationBlock;
