import React from "react";
import "./index.scss";

const CustomRROption = (props) => {
  const { innerProps, label, data } = props;
  return (
    <div
      {...innerProps}
      className={`custom-rr-container ${
        props?.isSelected ? "custom-rr-container-active" : ""
      }`}
      id={`option-${data?.rrId}`}
    >
      <div className="rr-id">{label}</div>
      <span className="rr-details">
        <span className="rr-content">{data?.projectName || "N/A"}</span>
        <span className="seprator"></span>
        <span className="rr-content">{data?.designation || "N/A"}</span>
        <span className="seprator"></span>
        <span className="rr-content">{`Primary Skills: ${
          data?.primarySkill || "N/A"
        }`}</span>
      </span>
    </div>
  );
};

export default CustomRROption;
