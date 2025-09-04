import React, { useState, useEffect } from "react";
import "./index.scss"; // Create this CSS file to style your custom toaster

const Toaster = ({ message, type, onClose }) => {
  const [show, setShow] = useState(true);

  // Automatically close the toaster after 3000ms (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose(); // Call the onClose function to handle toaster close
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className={`custom-toaster ${type}`}>
      <span>{message}</span>
      <button className="close-button" onClick={onClose}>
        x
      </button>
    </div>
  );
};

export default Toaster;
