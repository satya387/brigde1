import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import * as CONST from "./constant";
import Popup from "reactjs-popup";
import InterviewRejection from "../../../components/InterviewRejection";
import ResourceAllocation from "../../../components/ResourceAllocation";
import "../../../components/home/home.scss";
import "./reviewApplication.scss";
import { OPPORTUNITY_STATUS_ENUM } from "../../../common/constants";
import DownArrowWhite from "../../../resources/DownWhite.svg";
import DownArrowBlue from "../../../resources/DownBlue.svg";

const UpdateStatus = ({
  selectedJob,
  employeeDetails,
  interviewRejectionPopup,
  setInterviewRejectionPopup,
  resourceAllocationPopup,
  setResourceAllocationPopup,
  handleInterviewRejection,
  handleReallocation,
  isLoading,
  openOptionMenu,
  setOpenOptionMenu,
  handleToggle,
  sameOpt,
  openConfirmationModalForScheduleL2,
  showAllocation,
  isDisabled = false,
  allocationPERCENATGE = employeeDetails?.availableAllocationPercentage?? 0,
}) => {
  const handleInterviewRejectionClick = () => {
    setInterviewRejectionPopup(true);
  };

  const closeInterviewRejectionPopup = () => {
    setInterviewRejectionPopup(false);
  };

  const handleResourceAllocationPopup = () => {
  
    setResourceAllocationPopup(true);
  };

  const closeResourceAllocationPopup = () => {
   
    setResourceAllocationPopup(false);
  };

  return (
    <>
      <div className="update-status-wrapper">
        <button
          className={`btn btn-update update-status-button ${
            openOptionMenu ? "btn-hover" : ""
          }`}
          onClick={handleToggle}
          disabled={isDisabled}
        >
          {CONST.UPDATE_STATUS}
          <img
            src={openOptionMenu ? DownArrowWhite : DownArrowBlue}
            alt={"Down"}
            className={`${openOptionMenu ? "down-arrow-rotate" : ""}`}
          />
        </button>
        {openOptionMenu && sameOpt && (
          <ClickAwayListener onClickAway={() => setOpenOptionMenu(false)}>
            <div className="option-menu-wrapper">
              <ul className="option-menu">
                <li
                  className={`option-menu-items ${
                    showAllocation ? "disable-option" : ""
                  }`}
                  onClick={handleResourceAllocationPopup}
                >
                 
                  {CONST.RESOURCE_ALLOCATION}
                </li>
                <li
                  className="option-menu-items"
                  onClick={handleInterviewRejectionClick}
                >
                  {CONST.INTERVIEW_REJECTION}
                </li>
                {employeeDetails.status === OPPORTUNITY_STATUS_ENUM.Scheduled &&
                  new Date() > new Date(employeeDetails?.scheduledDate) && (
                    <li
                      className="option-menu-items"
                      onClick={() =>
                        openConfirmationModalForScheduleL2(employeeDetails)
                      }
                    >
                      {CONST.SCHEDULE_L2_MEETING}
                    </li>
                  )}
              </ul>
            </div>
          </ClickAwayListener>
        )}
      </div>
      {employeeDetails && (
        <Popup
          open={interviewRejectionPopup}
          onClose={closeInterviewRejectionPopup}
          closeOnDocumentClick={false}
        >
          <InterviewRejection
            selectedJob={selectedJob}
            employeeDetails={employeeDetails}
            closeInterviewRejectionPopup={closeInterviewRejectionPopup}
            handleInterviewRejection={handleInterviewRejection}
            isLoading={isLoading}
          />
        </Popup>
      )}
      {employeeDetails && (
        <Popup
          open={resourceAllocationPopup}
          onClose={closeResourceAllocationPopup}
          closeOnDocumentClick={false}
        >
          <ResourceAllocation
            allocationPERCENATGE={allocationPERCENATGE}
            selectedJob={selectedJob}
            employeeDetails={employeeDetails}
            closeResourceAllocationPopup={closeResourceAllocationPopup}
            handleReallocation={handleReallocation}
            isLoading={isLoading}
          />
        </Popup>
      )}
    </>
  );
};

export default UpdateStatus;
