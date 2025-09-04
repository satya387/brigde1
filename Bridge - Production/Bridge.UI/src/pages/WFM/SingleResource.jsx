import React, { Fragment, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { Link } from "react-router-dom";
import * as CONST from "./../manager/reviewApplications/constant";
import DownArrowBlue from "../../resources/down-arrow-blue-border.svg";
import DownArrowWhite from "../../resources/down-arrow-white-border.svg";
import { OPPORTUNITY_STATUS_ENUM } from "../../common/constants";

const SingleResource = (props) => {
  const {
    index,
    job,
    employeeImg,
    avatar,
    handleResourceAvailabilityPopup,
    handleNominate,
    handleEarmarkedPopup,
    handleViewApplication,
    handleViewHistory,
  } = props;
  const [openOptionMenu, setOpenOptionMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMenu = () => {
    setOpenOptionMenu(!openOptionMenu);
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <Fragment key={index}>
      <li className="list-data">
        <div className="empname">
          <Link
            className="list-data-emp-head"
            to={`/m-available-resources/${job?.employeeId}`}
          >
            <span>
              {employeeImg && (
                <img
                  className="empimg"
                  src={employeeImg}
                  alt=""
                  onError={(e) => (e.target.src = avatar)}
                />
              )}
            </span>
            <span>
              <h2 className="emp-name">{job?.employeeName}</h2>
            </span>
          </Link>
        </div>
        <div className="tooltip"
          data-tooltip={`${job?.designation}`}
        >{job?.designation}</div>
        <div
          className="tooltip"
          data-tooltip={`${job?.primarySkills}${
            job?.secondarySkills ? `, ${job?.secondarySkills}` : ""
          }`}
        >
          {job?.primarySkills ? <span>{job?.primarySkills}</span> : ""}
          {job?.secondarySkills ? (
            <span>{`, ${job?.secondarySkills}`}</span>
          ) : (
            ""
          )}
        </div>
        <div>{job?.experience}</div>
        <div>{job?.workingLocation}</div>
        <div className="availablity-status">
          <span className="availablity-text">{job?.availability}</span>
          {job?.availability === OPPORTUNITY_STATUS_ENUM.Earmarked && (
            <span className="availablity-sub-text">{job?.rrNumber}</span>
          )}
          {job?.availability !== OPPORTUNITY_STATUS_ENUM.Earmarked &&
            job?.availability !== OPPORTUNITY_STATUS_ENUM.Available && (
              <span className="availablity-sub-text">{job?.effectiveTill}</span>
            )}
        </div>
        <div>{job?.onLaunchPadFrom}</div>
        <div>{job?.aging} Days</div>
        <div
          className="tooltip"
          data-tooltip={`${job?.wfmSpoc}`}
        >{job?.wfmSpoc}</div>
        <div> 
                            {(job?.availableAllocationPercentage == null || job?.availableAllocationPercentage<100)
                            ? <span className="AllocationLessThanHundreds">{job?.availableAllocationPercentage??0}%</span> 
                            :<span >{job?.availableAllocationPercentage}%</span> 
                            }
                        </div>
        <div className="update-status-wrapper">
          <button
            className={`btn btn-update action-button ${
              openOptionMenu ? "btn-hover" : ""
            }`}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onClick={() => toggleMenu()}
          >
            Actions
            <img
              src={openOptionMenu || isHovered ? DownArrowWhite : DownArrowBlue}
              alt={"Down"}
              className={`${openOptionMenu ? "down-arrow-rotate" : ""}`}
            />
          </button>
          {openOptionMenu && (
            <ClickAwayListener onClickAway={() => setOpenOptionMenu(false)}>
              <div className="option-menu-wrapper" style={{ padding: 1 }}>
                <ul className="option-menu">
                {job?.availability !== "Earmarked" &&
                    job?.availability !== "Resigned" && (
                      <li
                        className="option-menu-items"
                        onClick={() => handleEarmarkedPopup(job)}
                      >
                        {CONST.EARMARKED}
                      </li>
                    )}
                  {job?.availability !== "Earmarked" &&
                    job?.availability !== "Resigned" && (
                      <li
                        className="option-menu-items"
                        onClick={() => handleNominate(job)}
                      >
                        {CONST.NOMINATE}
                      </li>
                    )}
                  {job?.availability === "Available" && (
                    <li
                      className="option-menu-items"
                      onClick={() => handleViewApplication(job)}
                    >
                      {CONST.VIEW_APPLICATION}
                    </li>
                  )}
                  {job?.availability === "Available" && (
                    <li
                      className="option-menu-items"
                      onClick={() => handleViewHistory(job)}
                    >
                      {CONST.VIEW_HISTORY}
                    </li>
                  )}
                   <li
                    className="option-menu-items"
                    onClick={() => handleResourceAvailabilityPopup(job)}
                  >
                    {CONST.UPDATE_STATUS}
                  </li>
                </ul>
              </div>
            </ClickAwayListener>
          )}
        </div>
      </li>
    </Fragment>
  );
};

export default SingleResource;
