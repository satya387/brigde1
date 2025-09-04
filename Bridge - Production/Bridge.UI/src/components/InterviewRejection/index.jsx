import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import * as CONST from "./constant";
import { styles } from "../../common/constants";
import loaderImage from "../../resources/Loader.svg";
import "./InterviewRejection.scss";
import "../home/home.scss";
import PopupUserProfile from "../PopupUserProfile";

const InterviewRejection = ({
  selectedJob,
  employeeDetails,
  closeInterviewRejectionPopup,
  handleInterviewRejection,
  isLoading,
}) => {
  const disapproveReason = useSelector(
    (state) => state.manager.disapproveReason
  );
  const [primarySkills, setPrimarySkills] = useState([]);
  const [disapprovalReason, setDisapprovalReason] = useState([]);
  const [withdrawReason, setWithdrawReason] = useState(null);
  const [withdrawlComment, setWithdrawlComment] = useState(null);

  useEffect(() => {
    if (disapproveReason && disapproveReason?.length) {
      let newDisapprovalReason = [];
      // eslint-disable-next-line array-callback-return
      disapproveReason?.map((item) => {
        const val = {
          value: item?.disapprovalReason,
          label: item?.disapprovalReason,
        };
        newDisapprovalReason?.push(val);
      });
      setDisapprovalReason(newDisapprovalReason);
    }
  }, [disapproveReason]);

  useEffect(() => {
    const primarySkills = (selectedJob.primarySkill || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");
    setPrimarySkills(primarySkills);
  }, [selectedJob, employeeDetails]);

  return (
    <div className="modal-overlay modal-interview-rejection">
      <div className="modal-content modal-content-rejection">
        <div className="modal-header modal-header-rejection">
          <h2>{CONST.HEADER}</h2>
          <p>{CONST.SUB_HEADING}</p>
        </div>
        <PopupUserProfile
          selectedJob={selectedJob}
          employeeDetails={employeeDetails}
          primarySkills={primarySkills}
          className={"modal-cont-rejection"}
          showRRDetails={true}
        />

        {disapprovalReason?.length > 0 && (
          <div className="rejection-reason-wrapper">
            <div className="rejection-header">{CONST.REASON_DISAPPROVAL}</div>
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="disapprovalReason"
              options={disapprovalReason}
              onChange={setWithdrawReason}
              placeholder={CONST.REASON_DISAPPROVAL_PLACEHOLDER}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#533EED",
                },
              })}
              styles={styles}
            />
          </div>
        )}

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
            onClick={closeInterviewRejectionPopup}
          >
            Cancel
          </button>
          <button
            className={`modal-button ${
              withdrawReason && withdrawlComment ? "" : "disabled"
            }`}
            onClick={() =>
              handleInterviewRejection(selectedJob, employeeDetails, {
                reason: withdrawReason?.value,
                comments: withdrawlComment,
              })
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewRejection;
