import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import ResourceFeedbackForm from "../ResourceFeedbackForm";
import TaskOptionsWithCheckbox from "../TaskOptionsWithCheckbox";
import Toast from "../Toast";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import * as CONST from "./constant";
import avatar from "../../resources/user-icon.svg";
import { postSelfSummary } from "../../redux/actions/managerActions";
import {
  DEFAULT_ERROR_MESSAGE,
  TOASTER_SUCCESS,
  TOASTER_ERROR,
} from "../../common/constants";
import { fetchEmployeeProfile } from "../../redux/actions/employeeActions";
import { getDashSeparatedDate } from "../../common/commonMethods";

import "./index.scss";

const ResourceFeedback = ({
  employeeDetails,
  onClose,
  releaseNoteManager = false,
}) => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.employee.employeeProfile);
  const [toasterInfo, setToasterInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (employeeDetails?.employeeId) {
      dispatch(fetchEmployeeProfile(employeeDetails?.employeeId));
    }
  }, [employeeDetails?.employeeId]);

  const [formState, setFormState] = useState({
    positiveObservations: "",
    technicalFeedback: "",
    trainingRecommendations: "",
    anyCommitments: "",
    releaseFeedBack: null,
    nineBoxGridRating: null,
    behavioralSkill: null,
    skillMatrixUpdated: false,
    goalSheetUpdated: false,
  });

  const handleFormState = (value, field) => {
    let formStateCopy = { ...formState };
    switch (field) {
      case CONST.FORM_FIELDS.releaseFeedBack:
        formStateCopy = { ...formState, releaseFeedBack: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.nineBoxGridRating:
        formStateCopy = { ...formState, nineBoxGridRating: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.behavioralSkill:
        formStateCopy = { ...formState, behavioralSkill: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.positiveObservations:
        formStateCopy = { ...formState, positiveObservations: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.technicalFeedback:
        formStateCopy = { ...formState, technicalFeedback: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.trainingRecommendations:
        formStateCopy = { ...formState, trainingRecommendations: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.anyCommitments:
        formStateCopy = { ...formState, anyCommitments: value };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.skillMatrixUpdated:
        formStateCopy = {
          ...formState,
          skillMatrixUpdated: value === "Yes" ? true : false,
        };
        setFormState(formStateCopy);
        break;
      case CONST.FORM_FIELDS.goalSheetUpdated:
        formStateCopy = {
          ...formState,
          goalSheetUpdated: value === "Yes" ? true : false,
        };
        setFormState(formStateCopy);
        break;
      default:
        break;
    }
  };

  const handleSubmitSelfSummary = async () => {
    try {
      setLoader(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const requestData = {
        employeeId: employeeDetails?.employeeId,
        employeeSummary: releaseNoteManager ? null : JSON.stringify(formState),
        managerSummary: releaseNoteManager ? JSON.stringify(formState) : null,
        managerID: releaseNoteManager ? user?.employeeId : null,
      };
      const response = await postSelfSummary(requestData);
      if (response) {
        setToasterInfo({
          show: true,
          type: TOASTER_SUCCESS,
          message: CONST.MANAGER_SUMMARY_CONFIRMATION_TOAST_MESSAGE,
        });
      }
    } catch (error) {
      setToasterInfo({
        show: true,
        type: TOASTER_ERROR,
        message: DEFAULT_ERROR_MESSAGE,
      });
    } finally {
      setTimeout(() => {
        setLoader(false);
        onClose();
      }, 1500);
    }
  };

  const handleCloseToast = () => {
    setToasterInfo({
      show: false,
      type: "",
      message: "",
    });
  };

  useEffect(() => {
    if (toasterInfo.show) {
      setTimeout(() => {
        handleCloseToast();
      }, [3000]);
    }
  }, [toasterInfo?.show]);

  return (
    <div className="modal-overlay modal-resource-feedback">
      {toasterInfo?.show && (
        <Toast
          message={toasterInfo?.message}
          type={toasterInfo?.type}
          onClose={handleCloseToast}
        />
      )}
      <div className="modal-content modal-content-resource-feedback">
        <div className="modal-header modal-header-resource-feedback">
          <h2>{CONST.RELEASE_HEADER}</h2>
          <p>{CONST.RELEASE_SUB_HEADING}</p>
          <div>CURRENT PROJECT DETAILS</div>
          <h3>{employeeData?.employeeProjects?.[0]?.projectName}</h3>
          <div className="project-details">
            Project Manager: {employeeData?.reportingManagerName} | Allocation
            Date :{" "}
            {getDashSeparatedDate(
              employeeData?.employeeProjects?.[0]?.assignDate
            )}
          </div>
          <div className="talent-details-header">TALENT DETAILS</div>
        </div>
        <div className="modal-buttons fixed-modal-buttons">
          <button className="cancel modal-button" onClick={onClose}>
            Cancel
          </button>
          <button className={`modal-button`} onClick={handleSubmitSelfSummary}>
            {loader ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="modal-cont modal-cont-resource-feedback">
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
              <span className="employee-detail">
                Title: {employeeDetails?.role}
              </span>
              <span className="seprator"></span>
              <span className="employee-detail">
                Email: {employeeData?.emailId}
              </span>
              <span className="seprator"></span>
              <span className="employee-detail">
                Location: {employeeData?.location}
              </span>
            </div>
            <div className="auto-width employee-detail-wrap">
              {employeeData?.primarySkills && (
                <span className="employee-detail emp-skills">
                  Primary Skills:{" "}
                  {employeeData?.primarySkills.split(",").map((skill) => (
                    <span key={skill.trim()}>{skill.trim()}</span>
                  ))}
                </span>
              )}
              {employeeData?.secondarySkills && (
                <span className="employee-detail emp-skills">
                  Secondary Skills:{" "}
                  {employeeData?.secondarySkills.split(",").map((skill) => (
                    <span key={skill.trim()}>{skill.trim()}</span>
                  ))}
                </span>
              )}
              {(employeeData?.skillMatrix?.beginnerSkills ||
                employeeData?.skillMatrix?.intermediateSkills ||
                employeeData?.skillMatrix?.advancedSkills ||
                employeeData?.skillMatrix?.expertSkills) && (
                <span className="employee-detail emp-skills">
                  Other Skills:{" "}
                  {employeeData?.skillMatrix?.beginnerSkills &&
                    employeeData?.skillMatrix?.beginnerSkills
                      .split(",")
                      .filter((skill) => skill.trim() !== "")
                      .map((skill) => (
                        <span key={skill.trim()}>{skill.trim()}</span>
                      ))}
                  {employeeData?.skillMatrix?.intermediateSkills &&
                    employeeData?.skillMatrix?.intermediateSkills
                      .split(",")
                      .filter((skill) => skill.trim() !== "")
                      .map((skill) => (
                        <span key={skill.trim()}>{skill.trim()}</span>
                      ))}
                  {employeeData?.skillMatrix?.advancedSkills &&
                    employeeData?.skillMatrix?.advancedSkills
                      .split(",")
                      .filter((skill) => skill.trim() !== "")
                      .map((skill) => (
                        <span key={skill.trim()}>{skill.trim()}</span>
                      ))}
                  {employeeData?.skillMatrix?.expertSkills &&
                    employeeData?.skillMatrix?.expertSkills
                      .split(",")
                      .filter((skill) => skill.trim() !== "")
                      .map((skill) => (
                        <span key={skill.trim()}>{skill.trim()}</span>
                      ))}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Below will be used when rating value is added in API from oracle */}
        <div className="row-wrapper">
          <div className="modal-header modal-header-resource-feedback">
            <div>LAST APPRAISAL DETAILS</div>
            <div className="rating-container">
              <div className="rating-single">
                <h3 className="rating-header">Current Year</h3>
                {/* Below rating will be added when rating value is added in API from oracle */}
                <div className="ratings">
                  H1 Rating: <span className="yellow-star">&#9733;</span> - H2
                  Rating: <span className="yellow-star">&#9733;</span> -
                </div>
              </div>
              <div className="rating-single">
                <h3 className="rating-header">Previous Year</h3>
                {/* Below rating will be added when rating value is added in API from oracle */}
                <div className="ratings">
                  H1 Rating: <span className="yellow-star">&#9733;</span> - H2
                  Rating: <span className="yellow-star">&#9733;</span> -
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-wrapper">
          <div className="modal-header modal-header-resource-feedback">
            <div>MANAGER FEEDBACK</div>
          </div>
        </div>
        <ResourceFeedbackForm
          isDisabled={false}
          constants={CONST}
          formState={formState}
          handleFormState={handleFormState}
        />
        <b>PRE-RELEASE TASKS</b>
        <div className="row-wrapper">
          <div className="option-container">
            <h2 className="option-heading">{CONST.RELEASE_DATE}</h2>
            <div className="option-wrapper">
              <b>{employeeDetails?.managerApproveOrWithdrawDate}</b>
            </div>
          </div>
          <div className="option-container" style={{ width: "250px" }}>
            <h2 className="option-heading">{CONST.RELEASE_REASON}</h2>
            <div className="option-wrapper" style={{ width: "250px" }}>
              <b>{employeeDetails?.releaseReason}</b>
            </div>
          </div>
          <TaskOptionsWithCheckbox
            heading={CONST.SKILL_MATRIX_UPDATED}
            onSelectedOption={(option) =>
              handleFormState(option, CONST.FORM_FIELDS.skillMatrixUpdated)
            }
            option1={CONST.OPTION_YES}
            option2={CONST.OPTION_NO}
          />
          <TaskOptionsWithCheckbox
            heading={CONST.GOAL_SHEET_UPDATED}
            onSelectedOption={(option) =>
              handleFormState(option, CONST.FORM_FIELDS.goalSheetUpdated)
            }
            option1={CONST.OPTION_YES}
            option2={CONST.OPTION_NO}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceFeedback;
