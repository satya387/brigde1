import React from 'react';
import './lightbox.scss';

const Lightbox = ({ onClose, children }) => {
  return (
    <div className="lightbox-overlay">
      <div className="lightbox-container">
        <div className="lightbox-content">
          <button className="lightbox-close" onClick={onClose}>
            X
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
