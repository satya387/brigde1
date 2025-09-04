import React, { useState, useEffect } from "react";
import axios from "axios";
import * as API_ENDPOINT from "../../../../config";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EMPLOYEE_IMG_URL_BASE } from "../../../../config";
import { styles } from "../../../../common/constants";
import * as CONST from "./constant";
import { RESOURCE_ALLOCATION_PERCENTAGE } from "../../../../components/ResourceAllocation/constant";
import { getAuthToken, getUserName } from "../../../../common/commonMethods";
import avatar from "../../../../resources/user-icon.svg";
import emailIcon from "../../../../resources/mail.svg";
import Phone from "../../../../resources/phone-icon.svg";
import Location from "../../../../resources/Location.svg";
import loaderImage from "../../../../resources/Loader.svg";
import "./index.scss";

const ApproveTalentPopup = ({
  employeeDetails,
  onClose,
  handleWFMApproval,
  isLoading,
}) => {
  const [employeeProfileDetails, setEmployeeProfileDetails] = useState(null);
  const [suggestedDate, setSuggestedDate] = useState(null);
  const [allocationPercentage, setAllocationPercentage] = useState(null);
  const [availableAllocationPercentage, setavailableAllocationPercentage] = useState(null);
  const [rampupProject, setRampupProject] = useState(false);

  useEffect(() => {
    if (employeeDetails?.allocationStartDate) {
      setSuggestedDate(new Date(employeeDetails?.allocationStartDate));
    }
    if (employeeDetails?.allocationPercentage) {
      setAllocationPercentage({
        value: employeeDetails?.allocationPercentage,
        label: `${employeeDetails?.allocationPercentage}%`,
      });
    }
    if (employeeDetails?.availableAllocationPercentage) {
      setavailableAllocationPercentage({
        value: employeeDetails?.availableAllocationPercentage,
        label: `${employeeDetails?.availableAllocationPercentage}%`,
      });
    }
    if (employeeDetails?.employeeId) {
      fetchCandidateDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeDetails]);

  const fetchCandidateDetails = async () => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${API_ENDPOINT.EMP_PROFILE_API}`, {
        headers: {
          employeeId: employeeDetails?.employeeId, // Pass the id in the headers
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      setEmployeeProfileDetails(response?.data);
    } catch (error) {}
  };

  const handleApprovalTalent = () => {
    if (suggestedDate && allocationPercentage) {
      handleWFMApproval(
        suggestedDate,
        allocationPercentage,
        employeeDetails,
        rampupProject
      );
    }
  };

  const handlePercentageAllocationChangeARRAY = (allocationPERCENATGE) => {
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
    <div className="modal-overlay modal-interview-allocation-approval">
      <div className="modal-content modal-content-allocation-approval">
        <div className="modal-header modal-header-allocation-approval">
          <h2>{CONST.HEADER}</h2>
          <p>{CONST.SUB_HEADING}</p>
        </div>

        <div className={`modal-cont modal-cont-all`}>
          <div className="rr-wrapper">
            <div className="rr-number">{employeeDetails?.rrNumber}</div>
            <div className="auto-width employee-detail-wrap pd-0">
              <span className="employee-detail project-name">
                {employeeDetails?.projectName}
              </span>
              {(employeeDetails?.primarySkills ||
                employeeDetails?.secondarySkills) && (
                <span className="seprator"></span>
              )}
              {(employeeDetails?.primarySkills ||
                employeeDetails?.secondarySkills) && (
                <span className="employee-detail">
                  {CONST.PRIMARY_SKILLS_LABEL}&nbsp;
                  {employeeDetails?.primarySkills && (
                    <span className="pill">
                      {employeeDetails?.primarySkills}
                    </span>
                  )}
                  {employeeDetails?.secondarySkills && (
                    <span className="pill">
                      {employeeDetails?.secondarySkills}
                    </span>
                  )}
                </span>
              )}
              {employeeDetails?.cityName && <span className="seprator"></span>}
              {employeeDetails?.cityName && (
                <span className="employee-detail">
                  {employeeDetails?.cityName}
                </span>
              )}
              {employeeDetails?.requesterName && (
                <span className="seprator"></span>
              )}
              {employeeDetails?.requesterName && (
                <span className="employee-detail">
                  {employeeDetails?.requesterName}
                </span>
              )}
            </div>
          </div>
          <div className="modal-cont-allocation-approval">
            <img
              className="profile-img"
              src={`${EMPLOYEE_IMG_URL_BASE}${employeeProfileDetails?.emidsUniqueId}.jpeg`}
              alt=""
              onError={(e) => (e.target.src = avatar)}
            />
            <div className="auto-width">
              <div className="auto-width employee-name">
                {employeeProfileDetails?.employeeName}
              </div>
              <div className="auto-width employee-detail-wrap">
                <span className="employee-detail project-name">
                  {employeeProfileDetails?.designation}
                </span>
                <span className="seprator"></span>
                <span className="employee-detail">
                  {employeeProfileDetails?.emidsUniqueId}
                </span>
              </div>
              <div className="auto-width emp-details-wrap">
                <div className="emp-det-cont">
                  <div className="emp-icon-wrapper">
                    <img src={emailIcon} alt={"email"} />
                  </div>
                  <div className="emp-det-cont-label">
                    {employeeProfileDetails?.emailId || "N/A"}
                  </div>
                </div>
                <div className="emp-det-cont">
                  <div className="emp-icon-wrapper">
                    <img src={Phone} alt={"Phone-Icon"} />
                  </div>
                  <div className="emp-det-cont-label">
                    {employeeProfileDetails?.phoneNumber || "N/A"}
                  </div>
                </div>
                <div className="emp-det-cont">
                  <div className="emp-icon-wrapper">
                    <img src={Location} alt={"Location"} />
                  </div>
                  <div className="emp-det-cont-label">
                    {employeeProfileDetails?.workingLocation || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sugg-manager">{`${CONST.SUGGESTED_BY}${employeeDetails?.requesterName}`}</div>
        <div className="requesting-details-wrapper">
          <div className="details-cont details-cont-date">
            <div className="sub-header">{CONST.ALLOCATION_DATE}</div>
            <div className="date-picker-container">
              <DatePicker
                selected={new Date(employeeDetails?.allocationStartDate)}
                onChange={() => {}}
                autoFocus={false}
                readOnly={true}
                preventOpenOnFocus
                id="date-picker-allocation-approval-request"
                dateFormat="MMMM d, yyyy"
                className={`date-picker date-picker-allocation-approval-request disable-date-picker`}
                calendarClassName="date-picker-allocation-approval-request"
                placeholderText="MM/DD/YYYY"
              />
            </div>
          </div>
          <div className="details-cont details-cont-reason">
            <div className="sub-header">{CONST.ALLOCATION_HEADER}</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="release-reason"
              options={[
                {
                  value: employeeDetails?.allocationPercentage,
                  label: `${employeeDetails?.allocationPercentage}%`,
                },
              ]}
              onChange={() => {}}
              value={{
                value: employeeDetails?.allocationPercentage,
                label: `${employeeDetails?.allocationPercentage}%`,
              }}
              placeholder={CONST.ALLOCATE_REASON_PLACEHOLDER}
              isDisabled={true}
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

        <div className="sugg-manager">{`${CONST.SUGGESTED_BY_WFM}`}</div>
        <div className="requesting-details-wrapper">
          <div className="details-cont details-cont-date">
            <div className="sub-header">{CONST.ALLOCATION_DATE}</div>
            <div className="date-picker-container">
              <DatePicker
                selected={suggestedDate}
                onChange={(date) => setSuggestedDate(date)}
                autoFocus={false}
                preventOpenOnFocus
                minDate={suggestedDate}
                id="date-picker-resource-release"
                dateFormat="MMMM d, yyyy"
                className={`date-picker date-picker-allocation-approval-request`}
                calendarClassName="date-picker-resource-release"
                placeholderText="MM/DD/YYYY"
              />
            </div>
          </div>
          <div className="details-cont details-cont-reason">
            <div className="sub-header">{CONST.ALLOCATION_HEADER}</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="release-reason"
              options = {handlePercentageAllocationChangeARRAY(employeeDetails?.availableAllocationPercentage)}
              onChange={(val) => setAllocationPercentage(val)}
              value={availableAllocationPercentage}
              placeholder={CONST.ALLOCATE_REASON_PLACEHOLDER}
              menuPlacement="top"
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

        <div className="ramp-up-wrapper">
          <input
            type="checkbox"
            className="ramp-up-checkbox"
            checked={rampupProject}
            onChange={(e) => setRampupProject(!rampupProject)}
          />
          <span className="rampup-label">{CONST.RAMP_UP_PROJECT}</span>
        </div>

        <div className="modal-buttons">
          {isLoading && (
            <span className="loader">
              <img src={loaderImage} alt="Loading" />
            </span>
          )}
          <button className="cancel modal-button" onClick={onClose}>
            Cancel
          </button>
          <button className={`modal-button`} onClick={handleApprovalTalent}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveTalentPopup;
