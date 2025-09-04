import React, { useState, useEffect } from "react";
import * as CONST from "./constant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { styles } from "../../common/constants";
import loaderImage from "../../resources/Loader.svg";
import PopupUserProfile from "../PopupUserProfile";
import "./ResourceAllocation.scss";

const ResourceAllocation = ({
  selectedJob,
  employeeDetails,
  closeResourceAllocationPopup,
  handleReallocation,
  isLoading,
  allocationPERCENATGE
}) => {
  const [primarySkills, setPrimarySkills] = useState([]);
  const [allocationPercentage, setAllocationPercentage] = useState(
   {
    value: allocationPERCENATGE,
    label:`${allocationPERCENATGE}%`

   }
  );
  const [withdrawlComment, setWithdrawlComment] = useState("");
  const [discussionStartTime, setDiscussionStartTime] = useState(null);

  useEffect(() => {
    const element = document?.querySelector("#date-picker-allocation");
    if (element) {
      setTimeout(() => {
        element?.blur();
      }, 10);
    }
  }, []);

  useEffect(() => {
    const primarySkills = (selectedJob.primarySkill || "")
      ?.split(",")
      ?.map((skill) => skill.trim())
      ?.filter((skill) => skill !== "");
    setPrimarySkills(primarySkills);
  }, [selectedJob, employeeDetails]);

  const handlePercentageAllocationChange = (val) => {

    setAllocationPercentage(val);
  };
  const handlePercentageAllocationChangeARRAY = () => {
    let rows = [];
  for (let i = 10; i <= allocationPERCENATGE; i+=10) {
    rows.push({
      value: i,
      label:`${i}%`
  });
  }
   return rows     
  };

  return (
    <div className="modal-overlay modal-interview-allocation">
      <div className="modal-content modal-content-allocation">
        <div className="modal-header modal-header-allocation">
          <h2>{CONST.HEADER}</h2>
          <p>{CONST.SUB_HEADING}</p>
        </div>
        <PopupUserProfile
          selectedJob={selectedJob}
          employeeDetails={employeeDetails}
          primarySkills={primarySkills}
          className={"modal-cont-allocation"}
          showRRDetails={true}
        />

        <div className="date-percent-wrapper">
          <div className="date-wrapper">
            <div className="date-header">{CONST.ALLOCATION_START}</div>
            <div className="date-picker-container">
              <DatePicker
                selected={discussionStartTime}
                onChange={(date) => setDiscussionStartTime(date)}
                minDate={new Date()}
                autoFocus={false}
                preventOpenOnFocus
                id="date-picker-allocation"
                dateFormat="MMMM d, yyyy"
                className="date-picker"
                calendarClassName="date-picker-allocation"
                placeholderText="MM/DD/YYYY"
              />
            </div>
          </div>
          <div className="percent-wrapper">
            <div className="date-header">{CONST.ALLOCATION_PERCENT}</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="allocation-percentage"
            //  options={CONST.RESOURCE_ALLOCATION_PERCENTAGE}
           options={ handlePercentageAllocationChangeARRAY()            }
              onChange={handlePercentageAllocationChange}
              value={allocationPercentage}
              placeholder={CONST.REASON_DISAPPROVAL_PLACEHOLDER}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#533EED",
                },
                spacing: {
                  controlHeight: 20,
                  menuGutter: 1,
                  baseUnit: 2,
                },
              })}
              styles={styles}
            />
          </div>
        </div>

        <div className="comment-wrapper">
          <div className="comment-header">
            <div className="comment-header-main">{CONST.ADD_COMMENT}</div>
            <div className="comment-header-limit">{CONST.CHAR_LIMIT}</div>
          </div>
          <textarea
            className="modal-textarea comment-textarea"
            placeholder={CONST.PLACEHOLDER_COMMENT}
            value={withdrawlComment}
            maxLength={500}
            onChange={(e) => setWithdrawlComment(e.target.value)}
          />
        </div>

        <div className="modal-buttons">
          {isLoading && (
            <span className="loader">
              <img src={loaderImage} alt="Loading" />
            </span>
          )}
          <button
            className="cancel modal-button"
            onClick={closeResourceAllocationPopup}
          >
            Cancel
          </button>
          <button
            className={`modal-button ${
              discussionStartTime && allocationPercentage ? "" : "disabled"
            }`}
            onClick={() =>
              handleReallocation(
                selectedJob,
                employeeDetails,
                withdrawlComment,
                discussionStartTime,
                allocationPercentage
              )
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
