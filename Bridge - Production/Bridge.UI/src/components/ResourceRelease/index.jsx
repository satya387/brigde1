import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import loaderImage from "../../resources/Loader.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import avatar from "../../resources/user-icon.svg";
import emailIcon from "../../resources/mail.svg";
import Rocket from "../../resources/Rocket.svg";
import Location from "../../resources/Location.svg";
import * as CONST from "./constant";
import * as API_ENDPOINT from "../../config";
import * as GLOBAL_CONST from "../../common/constants";
import { styles } from "../../common/constants";
import {
  getAuthToken,
  getDateAfterThreeWeeks,
  getUserName,
  sendEmail,
  sendChat,
  convertUTCtoIST,
} from "../../common/commonMethods";
import "./index.scss";
import {
  EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
  MANAGER_RESOURCE_RELEASE_REQUEST_EMAIL_DATA,
  MANAGER_RESOURCERELEASE_REQUEST_WITHDRAWAL_EMAIL_DATA,
} from "../../common/emailConstants";
import { useSelector } from "react-redux";

const ResourceRelease = ({
  employeeDetails,
  isLoading,
  onClose,
  isWithdraw,
  isEditRelease,
  handleSubmitOperations,
}) => {
  const [releaseDate, setReleaseDate] = useState(null);
  const [releaseReason, setReleaseReason] = useState(null);
  const [withdrawalReason, setWithdrawalReason] = useState(null);
  const [informedEmployee, setInformedEmployee] = useState(false);
  const [employeeProfileDetails, setEmployeeProfileDetails] = useState(null);
  const [comment, setComment] = useState("");
  const managerMailId = useSelector((state) => state.user.employeeEmailId);
  const userName = managerMailId.split("@")[0];
  const managerName =  useSelector((state) => state.user.employeeName);

  useEffect(() => {
    if (isEditRelease) {
      const prevReleaseDate = new Date(
        employeeDetails?.managerApproveOrWithdrawDate
      );
      const prevReason = CONST.RELEASE_REASONS_ARRAY?.find(
        (item) => item?.value === employeeDetails?.releaseReason
      );
      const prevComments = employeeDetails?.comments;
      setReleaseDate(prevReleaseDate);
      setReleaseReason(prevReason);
      setComment(prevComments);
      setInformedEmployee(
        employeeDetails?.informedEmployee === "True" ||
          employeeDetails?.informedEmployee === true
          ? true
          : false
      );
    }
  }, [employeeDetails, isEditRelease]);

  useEffect(() => {
    if (isWithdraw) {
      const prevReleaseDate = new Date(
        employeeDetails?.managerApproveOrWithdrawDate
      );
      const prevReason = CONST.RELEASE_REASONS_ARRAY?.find(
        (item) => item?.value === employeeDetails?.releaseReason
      );
      setReleaseDate(prevReleaseDate);
      setReleaseReason(prevReason);
      setInformedEmployee(
        employeeDetails?.informedEmployee === "True" ||
          employeeDetails?.informedEmployee === true
          ? true
          : false
      );
    }
  }, [employeeDetails, isWithdraw]);

  useEffect(() => {
    if (employeeDetails) {
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

  const handleReleaseReasonChange = (val) => {
    setReleaseReason(val);
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    setComment(newText);
  };

  const handleRelease = async () => {
    await handleSubmitOperations(
      employeeDetails?.employeeId,
      releaseDate,
      isWithdraw ? withdrawalReason?.value : releaseReason?.value,
      comment,
      informedEmployee,
      isWithdraw
        ? GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.WithdrawRequested
        : GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.ReleaseRequested
    );
    if (!isWithdraw) {
      var dateObject = new Date(releaseDate);
      const emailBody =
        MANAGER_RESOURCE_RELEASE_REQUEST_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailBody
          ?.replace("<CANDIDATE_NAME>", employeeProfileDetails?.employeeName)
          ?.replace("<PROJECT_NAME>", employeeProfileDetails?.currentProject)
          ?.replace(
            "<RELEASE_DATE>",
            `${dateObject?.getDate()} ${dateObject.toLocaleString("en-US", {
              month: "short",
            })}, ${dateObject?.getFullYear()}`
          )
          ?.replace("<RELEASE_REASON>", releaseReason?.value)
          ?.replace("<MANAGER_NAME>", managerName)
          ?.replace("<ADDITIONAL_COMMENTS>", comment);
      const emailSubject =
        MANAGER_RESOURCE_RELEASE_REQUEST_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailSubject?.replace(
          "<PROJECT_NAME>",
          employeeProfileDetails?.currentProject
        );
      const toRecipients = [WFM_TEAM_EMAIL_ADDRESS];
      const ccRecipients = [managerMailId];
      await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
    } else {
      const emailBody =
        MANAGER_RESOURCERELEASE_REQUEST_WITHDRAWAL_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailBody
          ?.replace("<CANDIDATE_NAME>", employeeProfileDetails?.employeeName)
          ?.replace("<PROJECT_NAME>", employeeProfileDetails?.currentProject)
          ?.replace("<WITHDRAWAL_REASON>", withdrawalReason?.value)
          ?.replace("<MANAGER_NAME>", managerName);
      const emailSubject =
        MANAGER_RESOURCERELEASE_REQUEST_WITHDRAWAL_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailSubject?.replace(
          "<PROJECT_NAME>",
          employeeProfileDetails?.currentProject
        );
      const toRecipients = [WFM_TEAM_EMAIL_ADDRESS];
      const ccRecipients = [managerMailId];
      await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
    }
  };

  return (
    <div className="modal-overlay modal-interview-resource-release">
      <div className="modal-content modal-content-resource-release">
        <div className="modal-header modal-header-resource-release">
          <h2>{CONST.HEADER}</h2>
          <p>{CONST.SUB_HEADING}</p>
        </div>

        <div className={`modal-cont modal-cont-resource-release`}>
          <img
            className="profile-img"
            src={`${EMPLOYEE_IMG_URL_BASE}${employeeDetails?.employeeId}.jpeg`}
            alt=""
            onError={(e) => (e.target.src = avatar)}
          />
          <div className="auto-width">
            <div className="auto-width employee-name">
              {employeeDetails?.employeeName}
            </div>
            <div className="auto-width employee-detail-wrap">
              <span className="employee-detail">{employeeDetails?.role}</span>
              <span className="seprator"></span>
              <span className="employee-detail">
                {employeeDetails?.employeeId}
              </span>
            </div>
            {employeeProfileDetails && (
              <div className="auto-width emp-details-wrap">
                <div className="emp-det-cont">
                  <div className="emp-icon-wrapper">
                    <img src={emailIcon} alt={"email"} />
                  </div>
                  <div className="emp-det-cont-label">
                    {employeeProfileDetails?.emailId}
                  </div>
                </div>
                <div className="emp-det-cont">
                  <div className="emp-icon-wrapper">
                    <img src={Location} alt={"Location"} />
                  </div>
                  <div className="emp-det-cont-label">{`Location - ${employeeProfileDetails?.workingLocation}`}</div>
                </div>
                <div className="emp-det-cont">
                  <div className="emp-icon-wrapper">
                    <img src={Rocket} alt={"Rocket"} />
                  </div>
                  <div className="emp-det-cont-label">
                    {employeeDetails?.projectName}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="date-percent-wrapper">
          <div className="date-wrapper">
            <div className="date-header">
              {`${isEditRelease ? `${CONST.UPDATED} ` : ""}${
                CONST.RELEASE_DATE
              }`}
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className="date-picker-container">
              <DatePicker
                selected={releaseDate}
                onChange={(date) => setReleaseDate(date)}
                minDate={getDateAfterThreeWeeks()}
                autoFocus={false}
                readOnly={isWithdraw}
                preventOpenOnFocus
                id="date-picker-resource-release"
                dateFormat="dd/MM/yyyy"
                className={`date-picker ${
                  isWithdraw ? "disable-date-picker" : ""
                }`}
                calendarClassName="date-picker-resource-release"
                placeholderText="MM/DD/YYYY"
              />
            </div>
          </div>
          <div className="release-reason-wrapper">
            <div className="date-header">
              {`${isEditRelease ? `${CONST.UPDATED} ` : ""}${
                CONST.RELEASE_REASON
              }`}
              <span style={{ color: "red" }}>*</span>
            </div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="release-reason"
              options={CONST.RELEASE_REASONS_ARRAY}
              onChange={handleReleaseReasonChange}
              value={releaseReason}
              placeholder={CONST.RELEASE_REASON_PLACEHOLDER}
              isDisabled={isWithdraw}
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

        {isWithdraw && (
          <div className="withdrawal-reason-wrapper">
            <div className="date-header">{CONST.WITHDRAWAL_REASON}</div>
            <div className="withdrawal-select-wrapper">
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="withdrawal-reason"
                options={CONST.WITHDRAWAL_REASONS_ARRAY}
                onChange={(val) => setWithdrawalReason(val)}
                value={withdrawalReason}
                placeholder={CONST.RELEASE_REASON_PLACEHOLDER}
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
        )}

        {!isWithdraw && (
          <div className="additional-comment-wrapper">
            <div className="heading-comments">
              {CONST.MANAGER_COMMENTS}
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className="input-field">
              <textarea
                className="textarea-add-comment"
                value={comment}
                onChange={handleChange}
                placeholder={CONST.MANAGER_COMMENTS_PLACEHOLDER}
                rows={5}
                cols={50}
                maxLength={200}
              />
            </div>
          </div>
        )}

        <div className="inform-wrapper">
          <input
            type="checkbox"
            className="inform-checkbox"
            checked={informedEmployee}
            onChange={(e) => setInformedEmployee(!informedEmployee)}
          />
          <span className="inform-label">{CONST.INFORM_EMPLOYEE}</span>
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
          <button
            className={`modal-button ${
              isWithdraw
                ? withdrawalReason
                  ? ""
                  : "disabled"
                : releaseDate && releaseReason && comment?.length > 0
                ? ""
                : "disabled"
            }`}
            onClick={() => handleRelease()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceRelease;
