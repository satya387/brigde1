import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../components/home/home.scss";
import locationIcon from "../../resources/map-icon.svg";
import calIcon from "../../resources/calendar.svg";
import loaderImage from "../../resources/Loader.svg";
import { Link } from "react-router-dom";
import { withdrawOpportunity } from "../../redux/actions/managerActions";
import Model from "./../../components/tilelistview/model";
import Pagination from "../../components/pagination";
import Toaster from "../../components/toaster";
import { formatDate } from "../../common/commonMethods";
import "./index.scss";
import * as GLOBAL_CONST from "../../common/constants";
import EmptyComponent from "../../components/empty/emptyComponent";
import {
  applyForJob,
  fetchSelfApplyJob,
  setSelfAppliedPageCount,
  sortByColumnAppliedJob,
} from "../../redux/actions/jobActions";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { sendEmail, sendChat } from "../../common/commonMethods";
import {
  APPLY_OPPORTUNITY_EMAIL_DATA,
  EMPLOYEE_WITHDRAW_EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
} from "../../common/emailConstants";
import { fetchRRs } from "../../redux/actions/rrActions";
import HoverTooltip from "../../components/HoverTooltip";
import "../../components/home/home.scss";
import { authenticateUser } from "../../redux/actions/employeeActions";

const PaginatedSelfAppliedList = ({
  employeeId,
  fetchAction,
  dataSelector,
  viewType,
}) => {
  const dispatch = useDispatch();
  const rrs = useSelector((state) => state.rr.rrs) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeEmail = user?.employeeEmailId;
  const userName = employeeEmail?.split("@")[0];
  const employeeName = userName?.split(".")[0];
  const jobData = useSelector(dataSelector) || [];
  const isLoading = useSelector((state) => state.job.loading);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [withdrawReason, setWithdrawReason] = useState("");

  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showLaunchpadErrorMsg, setShowLaunchpadErrorMsg] = useState(false);
  const [showEarmarkedErrorMsg, setShowEarmarkedErrorMsg] = useState(false);
  const [showResignedErrorMsg, setShowResignedErrorMsg] = useState(false);
  const [showExceedMaxLimitErrorMsg, setExceedMaxLimitForApply] =
    useState(false);
  const [jobForConfirmation, setJobForConfirmation] = useState(null);
  const [showCrossRegionErrorMsg, setShowCrossRegionErrorMsg] = useState(false);
  const [isListMode, setListMode] = useState(true);

  // const [currentPage, setCurrentPage] = useState(1);
  const currentPage = useSelector((state) => state?.job?.selfAppliedPageCount);
  const sortColumn = useSelector((state) => state?.job?.sortedColumnAppliedJob);
  const sortOrder = useSelector((state) => state?.job?.sortOrderAppliedJob);
  const itemsPerPage = 10;

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Create a function to sort the jobData based on the current sortColumn and sortOrder
  const [sortedJobData, setSortedJobData] = useState([]);

  useEffect(() => {
    dispatch(fetchAction(employeeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId, fetchAction]);

  useEffect(() => {
    if (jobData && jobData?.length > 0) {
      setSortedJobData(jobData);
    }
  }, [jobData]);

  const handleConfirmationPopup = (value, job) => {
    dispatch(fetchRRs(job.rrId, employeeId));
    setUserAction(value);
    setConfirmationPopup(true);
    setJobForConfirmation(job);

    if (value === "Withdraw") {
      setConfirmationMessage(GLOBAL_CONST.EmployeeWithdrawnMsg);
    } else if (value === "Apply Opportunity") {
      const currentStatus = job.status;
      if (currentStatus === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn) {
        setConfirmationMessage(GLOBAL_CONST.ApplyOpportunityOnWithdrawStatus);
      } else if (
        currentStatus === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined
      ) {
        setConfirmationMessage(GLOBAL_CONST.ApplyOpportunityOnDeclinedStatus);
      } else if (
        currentStatus === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped
      ) {
        setConfirmationMessage(GLOBAL_CONST.ApplyOpportunityOnDroppedStatus);
      } else {
        setConfirmationMessage("");
      }
    }
  };

  const handleConfirmationAction = (action) => {
    const job = jobForConfirmation;
    if (userAction === "Withdraw" && action === "Yes" && job) {
      openWithdrawModal(job.rrId);
    } else if (userAction === "Apply Opportunity" && action === "Yes" && job) {
      handleApply(employeeId, job.rrId, job.rrNumber, job.rrCountry);
    }
    setUserAction(null);
    setConfirmationPopup(false);
    setJobForConfirmation(null);
  };

  const handleApply = async (employeeId, rrId, rrNumber, rrCountry) => {
    try {
      setLoading(true);
      let user = JSON.parse(localStorage.getItem("user"));
      const userName = localStorage.getItem("userName");
      if (user) {
        await dispatch(
          authenticateUser(userName, false, user?.employeeUserName)
        );
      }
      user = JSON.parse(localStorage.getItem("user"));
      if (user?.exceedMaxLimitForApplyOpportunity) {
        setExceedMaxLimitForApply(true);
        return;
      }
      if (user.employeeCountry.toLowerCase() !== rrCountry.toLowerCase()) {
        setShowCrossRegionErrorMsg(true);
        return;
      }
      if (user.employeeStatus === "Earmarked") {
        setShowEarmarkedErrorMsg(true);
        return;
      }
      if (user.employeeStatus === "Resigned") {
        setShowResignedErrorMsg(true);
        return;
      }
      if (user.isLaunchpadEmployee === 0 && !user.isFutureReleaseEmployee) {
        setShowLaunchpadErrorMsg(true);
        return;
      }
      const response = await applyForJob(employeeId, rrId, rrNumber);

      if (response) {
        if (response.status === 200) {
          setToasterMessage("Applied opportunity successfully");
          setToasterType("success");
          const emailBody =
            APPLY_OPPORTUNITY_EMAIL_DATA?.EMPLOYEE_MAIL_BODY_TO_MANAGER?.emailBody
              ?.replace(
                "<MANAGER_NAME>",
                rrs?.resourceRequestDetails?.requesterName
              )
              ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
              ?.replace("<EMPLOYEE_NAME>", employeeName);
          const emailSubject =
            APPLY_OPPORTUNITY_EMAIL_DATA?.EMPLOYEE_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
              "<RR_NUMBER>",
              rrs?.resourceRequestDetails?.rrNumber
            );
          const toRecipients = [
            rrs.resourceRequestDetails?.requesterMailId,
            rrs.resourceRequestDetails?.projectManagerMailID,
          ];
          const ccRecipients = [employeeEmail, WFM_TEAM_EMAIL_ADDRESS];
          await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
          await sendChat(
            emailBody?.replaceAll("<br>", ""),
            rrs.resourceRequestDetails.requesterMailId
          );
        } else if (response.status === 409) {
          setToasterMessage("Already applied");
          setToasterType("failure");
        }
        setShowToaster(true);
        setTimeout(() => {
          setShowToaster(false);
          dispatch(fetchAction(employeeId));
        }, 1000);
      }
    } catch (error) {
    } finally {
      setLoading(false); // Hide the loader when the application process is completed
    }
  };

  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortByColumnAppliedJob(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortByColumnAppliedJob(columnName, "asc"));
    }
  };

  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setSelfAppliedPageCount(page));
  };

  const openWithdrawModal = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const closeWithdrawModal = () => {
    setSelectedApplicationId(null);
    setWithdrawReason("");
  };
  const handleWithdraw = async () => {
    try {
      setLoading(true);
      if (selectedApplicationId !== null) {
        const selectedJob = sortedJobData.find(
          (job) => job.rrId === selectedApplicationId
        );
        if (!selectedJob) {
          setLoading(false);
          return;
        }

        const requestData = {
          employeeId: employeeId,
          resourceRequestId: selectedJob.rrId,
          resourceRequestNumber: selectedJob.rrNumber,
          disapprovedBy: "", // You can change this to the actual manager's name
          reasonForDisapprove: withdrawReason,
        };

        await dispatch(withdrawOpportunity(requestData));

        setShowToaster(true);
        setToasterMessage("Withdrawn opportunity successfully");
        setToasterType("success");

        const emailBody =
          EMPLOYEE_WITHDRAW_EMAIL_DATA?.EMPLOYEE_MAIL_BODY_TO_MANAGER?.emailBody
            ?.replace(
              "<MANAGER_NAME>",
              rrs?.resourceRequestDetails?.requesterName
            )
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
            ?.replace("<COMMENTS>", withdrawReason ? withdrawReason : "")
            ?.replace("<EMPLOYEE_NAME>", employeeName);
        const emailSubject =
          EMPLOYEE_WITHDRAW_EMAIL_DATA?.EMPLOYEE_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
            "<RR_NUMBER>",
            rrs?.resourceRequestDetails?.rrNumber
          );

        const toRecipients = [];
        if (
          rrs?.resourceRequestDetails?.requesterMailId !==
          rrs?.resourceRequestDetails?.projectManagerMailID
        ) {
          toRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId,
            rrs?.resourceRequestDetails?.projectManagerMailID
          );
        } else {
          toRecipients.push(rrs?.resourceRequestDetails?.requesterMailId);
        }

        const ccRecipients = [employeeEmail, WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
        await sendChat(
          emailBody?.replaceAll("<br>", ""),
          rrs?.resourceRequestDetails?.requesterMailId
        );

        closeWithdrawModal();
        setTimeout(() => {
          setShowToaster(false);
          dispatch(fetchAction(employeeId));
        }, 1000);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div>
        <img src={loaderImage} alt="loading" />
      </div>
    );
  }

  if (!sortedJobData.length) {
    return <EmptyComponent />;
  }
  if (!sortedJobData) {
    return (
      <div>
        <img src={loaderImage} alt="Loading" />
      </div>
    );
  }

  return (
    <>
      {/* Display the data using the appropriate structure based on viewType */}
      {viewType === "list" && (
        <ul className="list-table">
          <li className="list-header">
            <div onClick={() => handleSort("rrNumber")}>
              RR Number
              {sortColumn === "rrNumber" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "rrNumber" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("projectName")}>
              Project
              {sortColumn === "projectName" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "projectName" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("jobTitle")}>
              Role
              {sortColumn === "jobTitle" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "jobTitle" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("primarySkill")}>
              Skills
              {sortColumn === "primarySkill" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "primarySkill" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("requiredExperience")}>
              Required Exp.
              {sortColumn === "requiredExperience" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "requiredExperience" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            {sortedJobData[0].allocation && (
              <div onClick={() => handleSort("allocation")}>
                Project Assignment
                {sortColumn === "allocation" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "allocation" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
            )}
            <div onClick={() => handleSort("location")}>
              Location
              {sortColumn === "location" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "location" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("jobAppliedOn")}>
              Posted On
              {sortColumn === "jobAppliedOn" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "jobAppliedOn" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            {sortedJobData[0].jobAppliedOn && (
              <div onClick={() => handleSort("appliedOn")}>
                Applied on
                {sortColumn === "appliedOn" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "appliedOn" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
            )}
            <div onClick={() => handleSort("status")}>
              Status
              {sortColumn === "status" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "status" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div>Actions</div>
          </li>

          {itemsToShow.map((job) => {
            const jobModel = new Model(job);

            const formattedDate = jobModel.getFormattedDate();
            const experienceInYears = jobModel.getExperienceInYears();
            const firstTwoLetters = jobModel.getFirstTwoLetters();
            const primarySkills = jobModel.getPrimarySkills();
            const secondarySkills = jobModel.getSecondarySkills();

            return (
              <Fragment key={job.id}>
                <li key={job.jdid} className="list-data">
                  <div className="tooltip" data-tooltip={job.rrNumber}>
                    <Link className="rr-link" to={`/appliedrrs?id=${job.rrId}`}>
                      {job.rrNumber}
                    </Link>
                  </div>
                  <div
                    className="tooltip"
                    data-tooltip={job.projectName || job.project}
                  >
                    {job.projectName || job.project}
                  </div>
                  <div className="tooltip" data-tooltip={job.jobTitle}>
                    {job.jobTitle}
                  </div>
                  <div
                    className="skills tooltip"
                    data-tooltip={`${job.primarySkill},${job.secondarySkill}`}
                  >
                    {primarySkills.map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                    {secondarySkills.map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                  </div>
                  <div>{job.experience || job.requiredExperience} Years</div>
                  {job.allocation ? <div>{job.allocation} %</div> : null}
                  <div>{job.location}</div>
                  <div>{formattedDate}</div>
                  {job.status ===
                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ||
                    job.status ===
                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ? (
                    <div className="disapproved hover-tooltip">
                      <div className={`status-${job?.status}`}>
                        {job.status}
                      </div>{" "}
                      {job.status ===
                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined && (
                          <HoverTooltip hoverData={job?.comments} />
                        )}
                    </div>
                  ) : job.status === "Scheduled" ? (
                    <div className="status-schedule-wrapper">
                      <div className="disapproved status-schedule">
                        <p className="L2schedule">{job.status}</p>
                      </div>
                      {job?.scheduledDate && (
                        <div className="date-format">
                          {formatDate(job?.scheduledDate)}
                        </div>
                      )}
                    </div>
                  ) : job.status === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Closed ? (
                      <div className="closed-status hover-tooltip">
                        <div className="status-closed">
                          {job.status}
                        </div>
                        <HoverTooltip hoverData={"No more activity is allowed on this RR"} />
                      </div>
                    ) : (
                      <div
                        className={
                          job.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped
                            ? "dropped"
                            : job.status ===
                              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                .AllocationRequested
                              ? "resource-allocation"
                              : job.status ===
                                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.L2Discussion
                                ? "L2Discussion"
                                : job.status ===
                                  GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked
                                  ? "colorstatusEarmarked"
                                  : "active"
                        }
                      >
                        {job.status}
                        {job.status ===
                          GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped && (
                            <HoverTooltip
                              handleFilter={() => { }}
                              applyOn={"requiredExperience"}
                              applySelector={(state) =>
                                state?.manager?.filtersReviewApplication
                              }
                              hoverData={job?.comments || "N/A"}
                            />
                          )}
                      </div>
                    )}

                  {job.status ===
                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Active ? (
                    <div>
                      <button
                        className="btn"
                        onClick={() => handleConfirmationPopup("Withdraw", job)}
                      >
                        Withdraw
                      </button>
                    </div>
                  ) : job.status ===
                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ? (
                    <div>
                      <button
                        className="btn break-space"
                        onClick={() =>
                          handleConfirmationPopup("Apply Opportunity", job)
                        }
                      >
                        Apply Opportunity
                      </button>
                    </div>
                  ) : job.status ===
                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ||
                    job.status ===
                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped ? (
                    <div>
                      <button
                        className="btn break-space"
                        onClick={() =>
                          handleConfirmationPopup("Apply Opportunity", job)
                        }
                      >
                        Apply Opportunity
                      </button>
                    </div>
                  ) : (
                    <div>-</div>
                  )}
                </li>
                <ConfirmationPopup
                  confirmationPopup={confirmationPopup}
                  handleConfirmationAction={handleConfirmationAction}
                  confirmationMessage={confirmationMessage}
                  job={job}
                />
              </Fragment>
            );
          })}
        </ul>
      )}
      {viewType === "tile" && (
        <div className="tile-table card-wrap">
          {itemsToShow.map((job) => {
            const startDate = new Date(job.startDate || job.projectStartDate);
            const options = { month: "short", day: "numeric" };
            const formattedDate = startDate.toLocaleString(undefined, options);
            const experienceInYears = Math.round(job.experience / 12);
            const projectName = job.projectName || job.project;
            const firstTwoLetters = projectName.substring(0, 2);

            const primarySkills = job.primarySkill
              ? job.primarySkill.split(",")
              : [];
            const secondarySkills = job.secondarySkill
              ? job.secondarySkill.split(",")
              : [];

            return (
              <div key={job.id} className="card">
                <div className="card-header">
                  <div>
                    <span className="proj-logo">{firstTwoLetters}</span>
                  </div>
                  <div>
                    <h2>{job.projectName || job.project}</h2>
                    <h3>
                      <b>RR:</b>{" "}
                      <Link className="rr-link" to={`/rrs?id=${job.rrId}`}>
                        {job.rrNumber}
                      </Link>
                    </h3>
                  </div>
                </div>
                <div className="card-cont">
                  <p>
                    <b>Role:</b> {job.jobTitle}
                  </p>
                  <p>
                    <b>experience:</b>{" "}
                    {job.experience || job.requiredExperience} Years
                  </p>

                  {job.allocation ? (
                    <p>
                      <b>Project Assignment:</b> {job.allocation} %
                    </p>
                  ) : null}
                  <p
                    className="skills tooltip"
                    data-tooltip={`${job.primarySkill},${job.secondarySkill}`}
                  >
                    <b>Skills:</b>
                    {primarySkills.map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                    {secondarySkills.map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                  </p>
                  <div className="status">
                    <div className="status-card">
                      <b>Status:</b>&nbsp;
                      {job.status ===
                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ||
                        job.status ===
                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ? (
                        <div className="disapproved">{job.status}</div>
                      ) : job.status === "Scheduled" ? (
                        <div className="status-schedule-wrapper">
                          <div className="disapproved status-schedule">
                            {job.status}
                          </div>
                          {job?.scheduledDate && (
                            <div className="date-format">
                              {formatDate(job?.scheduledDate)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={
                            job.status ===
                              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped
                              ? "dropped"
                              : job.status ===
                                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                  .AllocationRequested
                                ? "resource-allocation"
                                : job.status ===
                                  GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked
                                  ? `colorstatus${job?.status}`
                                  : "active"
                          }
                        >
                          {job.status}
                        </div>
                      )}
                    </div>
                    {job.status ===
                      GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM?.Active ? (
                      <div>
                        <button
                          className="btn"
                          onClick={() =>
                            handleConfirmationPopup("Withdraw", job)
                          }
                        >
                          Withdraw
                        </button>
                      </div>
                    ) : job.status ===
                      GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ? (
                      <div>
                        <button
                          className="btn break-space"
                          onClick={() =>
                            handleConfirmationPopup("Apply Opportunity", job)
                          }
                        >
                          Apply Opportunity
                        </button>
                      </div>
                    ) : job.status ===
                      GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ||
                      job.status ===
                      GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped ? (
                      <div>
                        <button
                          className="btn break-space"
                          onClick={() =>
                            handleConfirmationPopup("Apply Opportunity", job)
                          }
                        >
                          Apply Opportunity
                        </button>
                      </div>
                    ) : (
                      <div>-</div>
                    )}                  
                  </div>
                </div>
                <div className="card-footer">
                  <span>
                    <img src={locationIcon} alt="" />
                    {job.location}
                  </span>
                  <span>
                    <img src={calIcon} alt="" />
                    Posted On - {formattedDate}
                  </span>
                </div>                              
                <ConfirmationPopup
                  confirmationPopup={confirmationPopup}
                  handleConfirmationAction={handleConfirmationAction}
                  confirmationMessage={confirmationMessage}
                  job={job}
                />
              </div>   
            );           
          })}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
      {selectedApplicationId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Reason for Withdraw Opportunity</h2>
              <p>Please mention your reason to withdraw Opportunity.</p>
            </div>
            {sortedJobData.map((selectedJob) => {
              if (selectedJob.rrId === selectedApplicationId) {
                const jobModel = new Model(selectedJob);
                return (
                  <div className="modal-cont" key={selectedJob.rrId}>
                    <div>
                      <div>
                        <b>RR Number: </b>
                        {selectedJob.rrNumber}
                      </div>
                      <div>
                        <b>Project :</b> {selectedJob.project}
                      </div>
                      <div>
                        <b>Overall Experience :</b>{" "}
                        {selectedJob.requiredExperience} Years
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <div className="rejection-header">
              Withdrawal Reason <span className="required-field">*</span>
            </div>
            <textarea
              className="modal-textarea"
              placeholder="Enter reason for withdrawal..."
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
            />
            <div className="modal-buttons">
              {loading && (
                <span className="loader">
                  <img src={loaderImage} alt="saving" />
                </span>
              )}
              <button
                className={`modal-button ${withdrawReason === "" ? "disabled" : ""
                  }`}
                onClick={handleWithdraw}
                disabled={withdrawReason === ""}
              >
                Withdraw
              </button>
              <button
                className="cancel modal-button"
                onClick={closeWithdrawModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {toasterMessage && showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
      {showLaunchpadErrorMsg && (
        <div className="modal-overlay">
          <div className="modal-content w-400 alert-styling">
            <div className="modal-header">
              <p>
                Currently “Apply” option is available only to members on
                Launchpad. If this role interests you, you can reach out to a
                WFM team member or write to WFM-Team@emids.com
              </p>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setShowLaunchpadErrorMsg(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showEarmarkedErrorMsg && (
        <div className="modal-overlay">
          <div className="modal-content w-400 alert-styling">
            <div className="modal-header">
              <p>
                You are already allocated to a different project under an RR,
                kindly check with WFM team members for more details.
              </p>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setShowEarmarkedErrorMsg(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showResignedErrorMsg && (
        <div className="modal-overlay">
          <div className="modal-content w-400 alert-styling">
            <div className="modal-header">
              <p>{GLOBAL_CONST.APPLY_OPPORTUNITY_RESIGNED_ERROR_MSG}</p>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setShowResignedErrorMsg(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showExceedMaxLimitErrorMsg && (
        <div className="modal-overlay">
          <div className="modal-content w-400 alert-styling">
            <div className="modal-header">
              <p>{GLOBAL_CONST.EXCEED_MAX_LIMIT_ERROR_MSG}</p>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setExceedMaxLimitForApply(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showCrossRegionErrorMsg && (
        <div className="modal-overlay">
          <div className="modal-content w-400 alert-styling">
            <div className="modal-header">
              <p>
                You are applying for a Cross Geo RR. Please connect with WFM
                team at wfm-team@emids.com before applying for this RR
              </p>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={() => setShowCrossRegionErrorMsg(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaginatedSelfAppliedList;
