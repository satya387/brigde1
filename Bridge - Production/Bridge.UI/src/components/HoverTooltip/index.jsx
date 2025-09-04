import React, { useRef, useState } from "react";
import Popup from "reactjs-popup";
import { useSelector } from "react-redux";
import FilterIcon from "../../resources/FilterIcon.svg";
import "../home/home.scss";
import infoIcon from "../../resources/info-grey.svg";

const HoverTooltip = ({ position = "bottom center", hoverData }) => {
  const tooltipRef = useRef(null);

  return (
    <Popup
      ref={tooltipRef}
      trigger={(open) => (
        <span
          className={`list-filter-wrapper hover-tooltip-image ${
            open ? "list-filter-visible" : ""
          }`}
        >
          <img
            src={infoIcon}
            alt="Filter"
            style={{ width: 14, height: 14, marginTop: 1 }}
          />
        </span>
      )}
      position={position}
      closeOnDocumentClick
    >
      <div className="filter-box-wrapper" style={{ background: "white" }}>
        {hoverData ?? "No comment added"}
      </div>
    </Popup>
  );
};

export default HoverTooltip;
