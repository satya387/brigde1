import React from "react";
import parse from 'html-react-parser';
import CrossIcon from "../../resources/Cross.svg";
import "./index.scss";

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`center-toast-wrapper ${type}`}>
      <div className="message-text">{parse(message)}</div>
      <div onClick={onClose}>
        <img src={CrossIcon} alt={"X"} className="icon-cross"></img>
      </div>
    </div>
  );
};

export default Toast;
