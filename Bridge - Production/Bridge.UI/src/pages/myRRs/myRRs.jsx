import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRRs } from "../../redux/actions/rrActions";
import { applyForJob, fetchSelfApplyJob } from "../../redux/actions/jobActions";
import "./myRRs.scss";
import expIcon from "../../resources/experiece.svg";
import locationIcon from "../../resources/map-icon.svg";
import userIcon from "../../resources/user-icon.svg";
import skillIcon from "../../resources/skill.svg";
import allocationIcon from "../../resources/percent.svg";
import usersIcon from "../../resources/users-icon.svg";
import { fetchJobById } from "../../redux/actions/jobActions";
import {
  withdrawOpportunity,
  globalSearch,
} from "../../redux/actions/managerActions";
import { fetchAllocationDataByWFM } from "../../redux/actions/wfmActions";
import calIcon from "../../resources/calendar.svg";
import Toaster from "../../components/toaster";
import loaderImage from "../../resources/Loader.svg";
import Model from "../../components/tilelistview/model";
import * as GLOBAL_CONST from "../../common/constants";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { sendEmail, sendChat } from "../../common/commonMethods";
import {
  APPLY_OPPORTUNITY_EMAIL_DATA,
  EMPLOYEE_WITHDRAW_EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
} from "../../common/emailConstants";
import matchIcon from "../../resources/thumbs-up-yellow.svg";
import lessMatchIcon from "../../resources/thumbs-up-grey.svg";
import infoIcon from "../../resources/info-grey.svg";
import { authenticateUser } from "../../redux/actions/employeeActions";

const RRS = () => {
  const rrs = useSelector((state) => state.rr.rrs) || [];
  const allJobs = useSelector((state) => state.job.jobById) || [];
  const appliedJobs = useSelector((state) => state.job.appliedJobById) || [];
  const managerJobs = useSelector((state) => state.rr.managerJobByID) || [];
  const searchData = useSelector((state) => state.manager.search) || [];
  const searchResults = searchData.resourceRequestSearchResult;
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeEmail = user.employeeEmailId;
  const userName = employeeEmail?.split("@")?.[0];
  const employeeName = userName?.split(".")?.[0];
  const userRole = useSelector((state) => state.user.role);
  const [showLaunchpadErrorMsg, setShowLaunchpadErrorMsg] = useState(false);
  const [showEarmarkedErrorMsg, setShowEarmarkedErrorMsg] = useState(false);
  const [showResignedErrorMsg, setShowResignedErrorMsg] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = window.location.pathname;
  const dispatch = useDispatch();
  const location = useLocation();
  const employeeId = useSelector((state) => state.user.employeeId);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [userAction, setUserAction] = useState(null);

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showCrossRegionErrorMsg, setShowCrossRegionErrorMsg] = useState(false);
  const [showExceedMaxLimitErrorMsg, setExceedMaxLimitForApply] =
    useState(false);
  const [fromSearch, setFromSearch] = useState(false);
  const [fromAllocation, setFromAllocation] = useState(false);
  const searchResultsData = useSelector((state) => state.manager.search) || [];
  const allocationData =
    useSelector((state) => state.wfm.allocationRequest) || [];
  const [allJobsData, setAllJobsData] = useState(allJobs);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const anchorId = searchParams.get("id");
    const fromSearchParam = searchParams.get("search");
    const fromAllocationParam = searchParams.get("allocation");

    if (fromSearchParam) {
      setFromSearch(fromSearchParam);
    }
    if (fromAllocationParam) {
      setFromAllocation(fromAllocationParam);
    }
    dispatch(fetchRRs(anchorId, employeeId));
  }, [dispatch, location.search]);

  useEffect(() => {
    dispatch(fetchJobById(employeeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

  useEffect(() => {
    dispatch(fetchSelfApplyJob(employeeId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (fromSearch && searchResultsData?.length === 0) {
      const searchInput = localStorage?.getItem("searchInputText");
      dispatch(
        globalSearch({
          searchElement: searchInput,
          isManager: true,
          employeeId: employeeId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fromSearch]);

  useEffect(() => {
    if (fromAllocation && allocationData?.length === 0) {
      dispatch(fetchAllocationDataByWFM());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fromAllocation]);

  useEffect(() => {
    if (fromSearch) {
      setAllJobsData(searchResultsData?.resourceRequestSearchResult || []);
    } else if (fromAllocation) {
      setAllJobsData(allocationData);
    } else {
      setAllJobsData(allJobs);
    }
  }, [fromSearch, searchResultsData, allJobs, fromAllocation, allocationData]);

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
        } else if (response.status === 409) {
          setApplied(true);
          setToasterMessage("Already applied");
          setToasterType("failure");
        }
        setShowToaster(true);
        setTimeout(() => {
          setShowToaster(false);
          dispatch(fetchSelfApplyJob(employeeId));
        }, 1000);
      }
    } catch (error) {
    } finally {
      setLoading(false); // Hide the loader when the application process is completed
    }
  };

  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [withdrawReason, setWithdrawReason] = useState("");

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
        const selectedJob = appliedJobs.find(
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

        setToasterMessage("Withdrawn opportunity successfully");
        setToasterType("success");
        setShowToaster(true);
        setToasterMessage("Applied opportunity successfully");
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
          dispatch(fetchSelfApplyJob(employeeId));
          setShowToaster(false);
        }, 500);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationPopup = (value, job) => {
    setUserAction(value);
    setConfirmationPopup(true);

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

  const handleConfirmationAction = (action, resourceRequestDetails) => {
    if (userAction === "Withdraw" && action === "Yes") {
      openWithdrawModal(resourceRequestDetails.rrId);
    } else if (userAction === "Apply Opportunity" && action === "Yes") {
      handleApply(
        employeeId,
        resourceRequestDetails.rrId,
        resourceRequestDetails.rrNumber,
        resourceRequestDetails.rrCountry
      );
    }
    setUserAction(null);
    setConfirmationPopup(false);
  };

  return (
    <>
      <div>
        <div className="rrs-container">
          <div className="rr-item">
            <div className="page-header">
              <h1>
                {rrs && rrs.resourceRequestDetails?.accountName}
                <span>
                  <b>RR: </b>
                  {rrs && rrs.resourceRequestDetails?.rrNumber} | <b>Role: </b>
                  {rrs && rrs.resourceRequestDetails?.jobTitle}
                </span>
              </h1>

              <div className="filters">
                {loading && (
                  <span className="loader">
                    <img src={loaderImage} alt="saving" />
                  </span>
                )}
                {userRole !== GLOBAL_CONST.WFMTeam &&
                rrs &&
                rrs.resourceRequestDetails
                  ? allJobsData
                      .filter(
                        (selectedJob) =>
                          selectedJob?.rrId ===
                          rrs?.resourceRequestDetails?.rrId
                      )
                      .map((selectedJob) =>
                        selectedJob.status ? null : appliedJobs?.some(
                            (obj) =>
                              obj?.rrId === rrs?.resourceRequestDetails?.rrId
                          ) ? null : (
                          <>
                            {rrs?.resourceRequestDetails?.rrRequesterId !==
                              employeeId &&
                              rrs?.resourceRequestDetails?.projectManagerId !==
                                employeeId && (
                                <button
                                  className="apply-btn blue-btn break-space"
                                  onClick={() =>
                                    handleApply(
                                      employeeId,
                                      rrs.resourceRequestDetails.rrId,
                                      rrs.resourceRequestDetails.rrNumber,
                                      rrs.resourceRequestDetails.rrCountry
                                    )
                                  }
                                >
                                  Apply Opportunity
                                </button>
                              )}
                          </>
                        )
                      )
                  : null}
                {userRole !== GLOBAL_CONST.WFMTeam &&
                rrs &&
                rrs.resourceRequestDetails
                  ? appliedJobs
                      .filter(
                        (selectedJob) =>
                          selectedJob?.rrId ===
                          rrs?.resourceRequestDetails?.rrId
                      )
                      .map((selectedJob) => (
                        <span key={selectedJob.id}>
                          {selectedJob.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ||
                          selectedJob.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ||
                          selectedJob.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped ? (
                            <button
                              className="apply-btn blue-btn show break-space"
                              onClick={() =>
                                handleConfirmationPopup(
                                  "Apply Opportunity",
                                  selectedJob
                                )
                              }
                            >
                              Apply Opportunity
                            </button>
                          ) : selectedJob.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Active ? (
                            <button
                              className="withdraw-btn blue-btn btn show"
                              onClick={() =>
                                handleConfirmationPopup("Withdraw", selectedJob)
                              }
                            >
                              Withdraw Opportunity
                            </button>
                          ) : (
                            <></>
                          )}
                        </span>
                      ))
                  : null}
              </div>
            </div>
            <div className="rrs-content-wrap">
              {allJobsData ? (
                <div className="col-one alljobs">
                  {allJobsData.map((job) => {
                    const startDate = new Date(job.startDate);
                    const options = { month: "short", day: "numeric" };
                    const formattedDate = startDate.toLocaleString(
                      undefined,
                      options
                    );
                    const experienceInYears = Math.round(job.experience / 12);
                    const projectName = job.projectName;
                    const firstTwoLetters = projectName.substring(0, 2);

                    return (
                      <div key={job.id} className="card">
                        <div className="card-header">
                          <div>
                            <span className="proj-logo">{firstTwoLetters}</span>
                          </div>
                          <div>
                            <h2 className="myh2">{job.projectName}</h2>
                            <h3>
                              <b>RR:</b>{" "}
                              <Link
                                className="rr-link"
                                to={`/rrs?id=${job.rrId}`}
                              >
                                {job.rrNumber}
                              </Link>
                            </h3>
                          </div>
                        </div>
                        <div className="card-cont">
                          <p>
                            <b>Role:</b> {job.designation}
                          </p>
                          <p>
                            <b>experience:</b> {job.experience} Years
                          </p>
                          <p>
                            <b>Project Assignment:</b> {job.allocation}
                          </p>
                          <p className="skills">
                            <b>Skills:</b>
                            {job.primarySkill ? (
                              <span>{job.primarySkill}</span>
                            ) : (
                              ""
                            )}
                            {job.secondarySkill ? (
                              <span>{job.secondarySkill}</span>
                            ) : (
                              ""
                            )}
                          </p>
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
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {appliedJobs ? (
                <div className="col-one allapplied">
                  {appliedJobs.map((apjob) => {
                    const startDate = new Date(apjob.projectStartDate);
                    const options = { month: "short", day: "numeric" };
                    const formattedDate = startDate.toLocaleString(
                      undefined,
                      options
                    );
                    const experienceInYears = Math.round(apjob.experience / 12);
                    const projectName = apjob.project;
                    const firstTwoLetters = projectName.substring(0, 2);

                    return (
                      <div key={apjob.id} className="card">
                        <div className="card-header">
                          <div>
                            <span className="proj-logo">{firstTwoLetters}</span>
                          </div>
                          <div>
                            <h2>{apjob.project}</h2>
                            <h3>
                              <b>RR:</b>
                              <Link
                                className="rr-link"
                                to={`/appliedrrs?id=${apjob.rrId}`}
                              >
                                {apjob.rrNumber}
                              </Link>
                            </h3>
                          </div>
                        </div>
                        <div className="card-cont">
                          <p>
                            <b>Role:</b> {apjob.jobTitle}
                          </p>
                          {/* <p><b>experience:</b> {job.experienceInMonths} Years</p> */}
                          <p>
                            <b>Overall Experience:</b>{" "}
                            {apjob.requiredExperience} Years
                          </p>

                          <p>
                            <b>Project:</b> {apjob.project}
                          </p>
                          <p className="skills">
                            <b>Skills:</b>
                            {apjob.primarySkill ? (
                              <span>{apjob.primarySkill}</span>
                            ) : (
                              ""
                            )}
                            {apjob.secondarySkill ? (
                              <span>{apjob.secondarySkill}</span>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                        <div className="card-footer">
                          <span>
                            <img src={locationIcon} alt="" />
                            {apjob.location}
                          </span>
                          <span>
                            <img src={calIcon} alt="" />
                            Posted On - {formattedDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {managerJobs ? (
                <div className="col-one all-mangerrrs">
                  {managerJobs.map((apjob) => {
                    const startDate = new Date(apjob.startDate);
                    const options = { month: "short", day: "numeric" };
                    const formattedDate = startDate.toLocaleString(
                      undefined,
                      options
                    );
                    const experienceInYears = Math.round(apjob.experience / 12);
                    const projectName = apjob.projectName;
                    const firstTwoLetters = projectName.substring(0, 2);

                    return (
                      <div key={apjob.id} className="card">
                        <div className="card-header">
                          <div>
                            <span className="proj-logo">{firstTwoLetters}</span>
                          </div>
                          <div>
                            <h2>{apjob.projectName}</h2>
                            <Link
                              className="rr-link"
                              to={
                                pathname === "/managermyrrs"
                                  ? `/managermyrrs?id=${apjob.rrId}`
                                  : `/managerrrs?id=${apjob.rrId}`
                              }
                            >
                              {apjob.rrNumber}
                            </Link>
                          </div>
                        </div>
                        <div className="card-cont">
                          <p>
                            <b>Role:</b> {apjob.jobTitle}
                          </p>
                          {/* <p><b>experience:</b> {job.experienceInMonths} Years</p> */}
                          <p>
                            <b>Overall Experience:</b>{" "}
                            {apjob.requiredExperience} Years
                          </p>

                          <p>
                            <b>Project:</b> {apjob.project}
                          </p>
                          <p className="skills">
                            <b>Skills:</b>
                            {apjob.primarySkill ? (
                              <span>{apjob.primarySkill}</span>
                            ) : (
                              ""
                            )}
                            {apjob.secondarySkill ? (
                              <span>{apjob.secondarySkill}</span>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                        <div className="card-footer">
                          <span>
                            <img src={locationIcon} alt="" />
                            {apjob.location}
                          </span>
                          <span>
                            <img src={calIcon} alt="" />
                            Posted On - {formattedDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="rrs-content">
                <div className="left-cont">
                  <ul>
                    {rrs && rrs.resourceRequestDetails ? (
                      <>
                        <li>
                          <img src={calIcon} alt="" />
                          <p>
                            <b>Posted On :</b>{" "}
                            {new Date(
                              rrs.resourceRequestDetails.startDate
                            ).toLocaleDateString()}
                          </p>
                        </li>
                        <li>
                          <img src={calIcon} alt="" />
                          <p>
                            <b>Open Till:</b>{" "}
                            {new Date(
                              rrs.resourceRequestDetails.openTill
                            ).toLocaleDateString()}
                          </p>
                        </li>
                        <li>
                          <img src={userIcon} alt="" />
                          <p>
                            <b>Account Name:</b>{" "}
                            {rrs.resourceRequestDetails.accountName}
                          </p>
                        </li>
                        <li>
                          <img src={expIcon} alt="" />
                          <p>
                            <b>Overall Experience:</b>{" "}
                            {rrs.resourceRequestDetails.minimumExp} years
                          </p>
                        </li>
                        <li>
                          <img src={allocationIcon} alt="" />
                          <p>
                            <b>Project Assignment:</b>{" "}
                            {rrs.resourceRequestDetails.allocation}
                          </p>
                        </li>
                        <li className="skills">
                          <img src={skillIcon} alt="" />
                          <p>
                            <b>Primary Skills: </b>
                          </p>
                          <p style={{'margin-left': '-1%'}}>
                            {rrs.resourceRequestDetails.primarySkill ? (
                              <span>
                                {rrs.resourceRequestDetails.primarySkill}
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                        </li>
                        <li className="skills">
                          <img src={skillIcon} alt="" />
                          <p>
                            <b>Secondary Skills: </b>
                          </p>
                          <p>
                            {rrs.resourceRequestDetails.secondarySkill ? (
                              <span>
                                {rrs.resourceRequestDetails.secondarySkill}
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                        </li>
                        <li>
                          <img src={locationIcon} alt="" />
                          <p>
                            <b>Location:</b>{" "}
                            {rrs.resourceRequestDetails.workLocation}
                          </p>
                        </li>
                        <li>
                          <img src={usersIcon} alt="" />
                          <p>
                            <b>Applicants:</b> {rrs.applicants}
                          </p>
                        </li>
                        <li>
                          <img src={usersIcon} alt="" />
                          <p>
                            <b>Requestor:</b>{" "}
                            {rrs.resourceRequestDetails.requesterName}
                          </p>
                        </li>
                        {userRole !== GLOBAL_CONST.WFMTeam && (
                          <li>
                            <img src={usersIcon} alt="" />
                            <p>
                              <b> Match Indicator:</b>{" "}
                            </p>
                            <div
                              style={{
                                display: "inline-block",
                                paddingTop: "9px",
                                paddingLeft: "0.5rem",
                              }}
                            >
                              <div className="suitability">
                                {rrs.matchPercentage < 30 ? (
                                  <img src={lessMatchIcon} alt="Suitability" />
                                ) : (
                                  <img src={matchIcon} alt="Suitability" />
                                )}
                                {rrs?.resourceRequestDetails?.matchPercentage ||
                                  0}
                                %
                                <img
                                  className="tooltip-img"
                                  src={infoIcon}
                                  alt=""
                                />
                                <div
                                  className="suitability-cont"
                                  style={{ "min-width": "300px" }}
                                >
                                  {rrs?.resourceRequestDetails?.matchCriteria}
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                      </>
                    ) : (
                      <li>Loading...</li>
                    )}
                  </ul>
                </div>
                <div className="right-cont">
                  <h2>About Project</h2>
                  {rrs?.resourceRequestDetails?.about && (
                    <>
                      <p>{rrs.resourceRequestDetails.about}</p>
                    </>
                  )}
                  <h2>Opportunity Summary & Key Responsibilities</h2>
                  {rrs?.resourceRequestDetails?.rolesandResponsibilities && (
                    <>
                      <p>
                        {rrs.resourceRequestDetails.rolesandResponsibilities}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toasterMessage && showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
      {selectedApplicationId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Reason for Withdraw Opportunity</h2>
              <p>Please mention your reason to withdraw Opportunity.</p>
            </div>
            {appliedJobs.map((selectedJob) => {
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
            <div className="withdraw-reason">
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
              <button style={{ color: 'blue' }}
                className={`modal-button ${
                  withdrawReason === "" ? "disabled" : ""
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
      <ConfirmationPopup
        confirmationPopup={confirmationPopup}
        handleConfirmationAction={handleConfirmationAction}
        confirmationMessage={confirmationMessage}
        job={rrs.resourceRequestDetails}
      />
    </>
  );
};

export default RRS;
