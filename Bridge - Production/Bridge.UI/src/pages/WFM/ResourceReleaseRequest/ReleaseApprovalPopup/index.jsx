import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EMPLOYEE_IMG_URL_BASE } from "../../../../config";
import avatar from "../../../../resources/user-icon.svg";
import * as CONST from "./constant";
import * as GLOBAL_CONST from "../../../../common/constants";
import { styles } from "../../../../common/constants";
import { getDateAfterThreeWeeks } from "../../../../common/commonMethods";
import { getWFMTeamList } from "../../../../redux/actions/managerActions";
import Flag from "../../../../resources/Flag.svg";
import "../../../../components/home/home.scss";
import "./ReleaseApprovalPopup.scss";

const ReleaseApprovalPopup = ({
  employeeDetails,
  onClose,
  handleRelease,
  handleRejectionRelease,
}) => {
  const dispatch = useDispatch();
  const [suggestedDate, setSuggestedDate] = useState(
    new Date(employeeDetails?.plannedReleaseDate)
  );
  const [allotedWfmSPOC, setAllotedWfmSPOC] = useState(null);
  const wfmTeamList = useSelector((state) => state.manager.getWFMTeamList);
  const [releaseComment, setReleaseComment] = useState("");

  useEffect(() => {
    if (wfmTeamList?.length === 0) {
      dispatch(getWFMTeamList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleApproval = () => {
    handleRelease(suggestedDate, allotedWfmSPOC, employeeDetails);
  };

  const handleRejection = () => {
    handleRejectionRelease(
      suggestedDate,
      allotedWfmSPOC,
      employeeDetails,
      releaseComment
    );
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    setReleaseComment(newText);
  };

  return (
    <div className="modal-overlay modal-interview-release-approval">
      <div className="modal-content modal-content-release-approval">
        <div className="modal-header modal-header-release-approval">
          <h2>
            {employeeDetails?.status ===
            GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.WithdrawRequested
              ? CONST.HEADER_WITHDRAWN
              : CONST.HEADER}
          </h2>
          <p>
            {employeeDetails?.status ===
            GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.WithdrawRequested
              ? CONST.SUB_HEADING_WITHDRAWN
              : CONST.SUB_HEADING}
          </p>
        </div>

        <div className={`modal-cont modal-cont-release-approval`}>
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
              <span className="employee-detail project-name">
                {employeeDetails?.projectName}
              </span>
              <span className="seprator"></span>
              <span className="employee-detail">
                {employeeDetails?.employeeId}
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
              {employeeDetails?.workingLocation && (
                <span className="seprator"></span>
              )}
              {employeeDetails?.workingLocation && (
                <span className="employee-detail">
                  {employeeDetails?.workingLocation}
                </span>
              )}
              <span className="seprator"></span>
              <span className="employee-detail">{`${CONST.REQUESTING_MANAGER} ${
                employeeDetails?.reportingManagerName || "N/A"
              }`}</span>
            </div>
          </div>
        </div>

        <div className="requesting-details-wrapper">
          <div className="details-cont details-cont-date">
            <div className="sub-header">{CONST.PROPOSED_RELEASE_DATE}</div>
            <div className="date-picker-container">
              <DatePicker
                selected={new Date(employeeDetails?.plannedReleaseDate)}
                onChange={() => {}}
                autoFocus={false}
                readOnly={true}
                preventOpenOnFocus
                id="date-picker-release-approval-request"
                dateFormat="MMMM d, yyyy"
                className={`date-picker date-picker-release-approval-request disable-date-picker`}
                calendarClassName="date-picker-release-approval-request"
                placeholderText="MM/DD/YYYY"
              />
            </div>
          </div>
          <div className="details-cont details-cont-reason">
            <div className="sub-header">
              {employeeDetails?.status ===
              GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested
                ? CONST.RELEASE_REASON
                : CONST.WITHDRAW_REASON}
            </div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="release-reason"
              options={[
                {
                  value: employeeDetails?.releaseReason,
                  label: employeeDetails?.releaseReason,
                },
              ]}
              onChange={() => {}}
              value={{
                value: employeeDetails?.releaseReason,
                label: employeeDetails?.releaseReason,
              }}
              placeholder={CONST.RELEASE_REASON_PLACEHOLDER}
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

        {employeeDetails?.status ===
          GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested &&
          (employeeDetails?.talentInformed === "True" ||
            employeeDetails?.talentInformed === true) && (
            <div className="talent-informed-wrapper">
              <img src={Flag} alt="FLAG" className="flag" />
              <div className="talent-informed">{CONST.TALENT_INFORMED}</div>
            </div>
          )}

        {employeeDetails?.status ===
          GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested && (
          <div className="requesting-details-wrapper">
            <div className="details-cont details-cont-date">
              <div className="sub-header">{CONST.SUGGESTED_RELEASE_DATE}</div>
              <div className="date-picker-container">
                <DatePicker
                  selected={suggestedDate}
                  onChange={(date) => setSuggestedDate(date)}
                  autoFocus={false}
                  preventOpenOnFocus
                  minDate={getDateAfterThreeWeeks()}
                  id="date-picker-resource-release"
                  dateFormat="MMMM d, yyyy"
                  className={`date-picker date-picker-release-approval-request`}
                  calendarClassName="date-picker-resource-release"
                  placeholderText="MM/DD/YYYY"
                />
              </div>
            </div>
            <div className="details-cont details-cont-reason">
              <div className="sub-header">{CONST.WFM_SPOC}</div>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="release-reason"
                options={wfmTeamList}
                getOptionLabel={(option) => option.employeeName}
                getOptionValue={(option) => option.employeeName}
                onChange={setAllotedWfmSPOC}
                value={allotedWfmSPOC}
                placeholder={CONST.WFM_SPOC_PERSONS_PLACEHOLDER}
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

        <div className="rejection-wrapper">
          <div className="sub-header">{CONST.RELEASE_REJECTION_COMMENT}</div>
          <div className="input-field">
            <textarea
              className="textarea-add-comment"
              value={releaseComment}
              onChange={handleChange}
              placeholder={CONST.REJECTION_COMMENT_PLACEHOLDER}
              rows={5}
              cols={50}
              maxLength={200}
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="cancel modal-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`modal-button ${
              releaseComment?.length > 0 ? "" : "disabled"
            }`}
            onClick={handleRejection}
          >
            Reject
          </button>
          <button
            className={`modal-button ${
              (allotedWfmSPOC && suggestedDate) ||
              employeeDetails?.status ===
                GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.WithdrawRequested
                ? ""
                : "disabled"
            }`}
            onClick={handleApproval}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReleaseApprovalPopup;
