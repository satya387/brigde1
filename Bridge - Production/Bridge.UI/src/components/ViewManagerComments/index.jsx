import React from "react";
import "../home/home.scss";
import "./index.scss";

const ViewManagerComments = ({ empData, handleClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content pb-15">
        <div className="comment-wrapper">
          <h2 className="heading-comments">View comments by Manger</h2>
          <div className="rejection-wrapper">
            <div className="rejection-heading">Reason of release</div>
            <div className="rejection-reason">{empData?.comments}</div>
          </div>
          <div className="rejection-wrapper">
            <div className="rejection-heading">Additional Comments</div>
            <div className="rejection-reason">
              {empData?.additionalComments || "N/A"}
            </div>
          </div>
        </div>
        <div className="modal-buttons-wrapper">
          <button className="modal-button cancel" onClick={() => handleClose()}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewManagerComments;
