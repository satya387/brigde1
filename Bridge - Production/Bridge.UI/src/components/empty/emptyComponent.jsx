import React from "react";
import nodataImage from "../../resources/no-data.svg";
import "./index.scss";

const EmptyComponent = ({ imgSrc = nodataImage, message }) => {
  return (
    <>
      <div className="empty-record">
        <img src={imgSrc} alt="" />
        <p className="message-text">{message || "No Matching Records Found"}</p>
      </div>
    </>
  );
};

export default EmptyComponent;
