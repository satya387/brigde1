import React from "react";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import avatar from "../../resources/user-icon.svg";
import * as CONST from "./constants";

const PopupUserProfile = ({
  selectedJob,
  employeeDetails,
  primarySkills,
  className,
  showRRDetails = true,
}) => {
  return (
    <div className={`modal-cont ${className}`}>
      <img
        className="profile-img"
        src={`${EMPLOYEE_IMG_URL_BASE}${
          employeeDetails?.employeeUniqueId || employeeDetails?.employeeId
        }.jpeg`}
        alt=""
        onError={(e) => (e.target.src = avatar)}
      />
      <div className="auto-width">
        <div className="auto-width employee-name">
          {employeeDetails?.employeeName}
        </div>
        <div className="auto-width employee-detail-wrap">
          <span className="employee-detail">
            {employeeDetails?.employeeRole || employeeDetails?.designation}
          </span>
          <span className="seprator"></span>
          <span className="employee-detail">
            {employeeDetails?.employeeUniqueId || employeeDetails?.employeeId}
          </span>
        </div>
        {showRRDetails && (
          <div className="auto-width rr-details-wrap">
            <div className="auto-width rr-id">{selectedJob?.rrNumber}</div>
            <div className="auto-width rr-requirement-wrap">
              <span className="rr-req">{selectedJob?.project}</span>
              <span className="seprator"></span>
              <span className="rr-req">{selectedJob?.jobTitle}</span>
              <span className="seprator"></span>
              <span className="rr-req">
                {CONST.PRIMARY_SKILLS_LABEL}&nbsp;
                {primarySkills?.map((item, index) => {
                  return (
                    <span key={index} className="pill">
                      {item}
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupUserProfile;
