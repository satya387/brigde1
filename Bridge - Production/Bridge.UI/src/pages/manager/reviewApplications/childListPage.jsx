import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../../../components/home/home.scss";
import loaderImage from "../../../resources/Loader.svg";
import matchIcon from "../../../resources/thumbs-up-yellow.svg";
import lessMatchIcon from "../../../resources/thumbs-up-grey.svg";
import infoIcon from "../../../resources/info-grey.svg";
import notepadIcon from "../../../resources/notepadIcon.svg";
import Suitability from "../../../components/home/suitability";
import {
  disaproveOpportunity,
  scheduleDiscussion,
  scheduleL2Discussion,
  disapprovalReason,
  fetchManagerAppliedJobById,
  rejectCandidate,
  allocateCandidate,
  getRRMatchingLaunchPadEmployees,
  setMatchingResource,
} from "../../../redux/actions/managerActions";
import { SendInvite } from "../../../redux/actions/employeeActions";
import Pagination from "../../../components/pagination";
import ViewToggle from "../../../components/tilelistview";
import avatar from "../../../resources/user-icon.svg";
import Toaster from "../../../components/toaster";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import backIcon from "../../../resources/back-arrow.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../../config";
import emailIcon from "../../../resources/mail.svg";
import skillIcon from "../../../resources/skill.svg";
import * as CONST from "./constant";
import {
  formatDate,
  checkScheduleTimePassed,
  getNearestMaxQuarter,
  convertUTCtoIST,
  sendEmail,
  sendChat,
} from "../../../common/commonMethods";
import "./reviewApplication.scss";
import UpdateStatus from "./UpdateStatus";
import ConfirmationPopup from "../../../components/ConfirmationPopup";
import * as GLOBAL_CONST from "../../../common/constants";
import ShowMatchingResources from "./showMatchingResources";
import {
  MANAGER_DECLINE_EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
  MANAGER_SCHEDULE_EMAIL_DATA,
  MANAGER_INTERVIEW_REJECTION_EMAIL_DATA,
  MANAGER_RESOURCE_ALLOCATION_REQUEST_EMAIL_DATA,
  MANAGER_L2SCHEDULE_EMAIL_DATA,
} from "../../../common/emailConstants";
import { fetchRRs } from "../../../redux/actions/rrActions";
import { fetchEmployeeProfile } from "../../../redux/actions/employeeActions";
import ActionButton from "./ActionButton";
import { applyForJob } from "../../../redux/actions/jobActions";
import WithdrawActionButton from "./WithdrawActionButton";
import Popup from "reactjs-popup";
import ViewManagerComments from "../../../components/ViewManagerComments";

const PaginatedReviewApplicationChildPage = ({
  fetchAction,
  dataSelector,
  viewType,
  managerId,
}) => {
  const dispatch = useDispatch();
  const jobData = useSelector(dataSelector) || [];
  const disapproveReason =
    useSelector((state) => state.manager.disapproveReason) || [];
  const managerMailId = useSelector((state) => state.user.employeeEmailId);
  const employeeId = useSelector((state) => state.user.employeeId);
  const role = useSelector((state) => state.user.role);
  const managerIdFromStore = useSelector((state) => state.user.employeeId);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [withdrawReason, setWithdrawReason] = useState("");

  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [discussionStartTime, setDiscussionStartTime] = useState("");
  const [discussionEndTime, setDiscussionEndTime] = useState("");
  const [participants, setParticipants] = useState([]);
  const [interviewRejectionPopup, setInterviewRejectionPopup] = useState(false);
  const [resourceAllocationPopup, setResourceAllocationPopup] = useState(false);
  const [childScreenLoader, setChildScreenLoader] = useState(true);

  // Initialize sorting state
  const [sortColumn, setSortColumn] = useState("employeeName");
  const [sortOrder, setSortOrder] = useState("asc");

  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [openOptionMenu, setOpenOptionMenu] = useState(false);
  const [empData, setEmpData] = useState(null);
  const matchingResources = useSelector(
    (state) => state?.manager?.matchingResources
  );
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const rrs = useSelector((state) => state.rr.rrs) || [];
  const employeeProfile =
    useSelector((state) => state.employee.employeeProfile) || [];
  const [openRevertConfirmation, setOpenRevertConfirmation] = useState(false);
  const [rejectionCommentPopup, setRejectionCommentPopup] = useState(false);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set the new column to sort by and default to ascending order
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    dispatch(disapprovalReason());
  }, [dispatch]);

  useEffect(() => {
    const startTime = getNearestMaxQuarter();
    const endTime = new Date(startTime?.getTime() + 30 * 60000);
    setDiscussionStartTime(startTime);
    setDiscussionEndTime(endTime);
  }, []);

  const { jobId } = useParams();
  const [isListMode, setListMode] = useState(true);

  const handleViewChange = (mode) => {
    setListMode(mode);
  };

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (managerId && role === GLOBAL_CONST.Manager) {
      dispatch(fetchAction(managerId));
    }
  }, [dispatch, fetchAction, managerId, role]);

  useEffect(() => {
    if (role === GLOBAL_CONST.WFMTeam && jobId) {
      dispatch(fetchAction(jobId));
      setTimeout(() => {
        setChildScreenLoader(false);
      }, 1000);
    }
  }, [jobId, role, dispatch, fetchAction]);

  const selectedJob = jobData?.find((job) => job?.rrId === Number(jobId));

  useEffect(() => {
    if (selectedJob) {
      const requestDataForRRMatchEmployees = {
        rrNumber: selectedJob?.rrNumber,
        projectName: null,
        jobTitle: selectedJob?.jobTitle,
        primarySkill: selectedJob?.primarySkill,
        secondarySkill: selectedJob?.secondarySkill,
        experience: selectedJob?.requiredExperience,
        allocation: 0,
        location: selectedJob?.location,
        startDate: null,
        designation: selectedJob?.jobTitle,
        rrId: selectedJob?.rrId,
        matchPercentage: 0,
        matchCriteria: null,
      };
      dispatch(getRRMatchingLaunchPadEmployees(requestDataForRRMatchEmployees));
    }
  }, [dispatch, selectedJob]);

  useEffect(() => {
    if (selectedJob) {
      dispatch(fetchRRs(selectedJob?.rrId, employeeId));
    }
  }, [dispatch, selectedJob]);

  useEffect(() => {
    if (empData) {
      dispatch(fetchEmployeeProfile(empData?.employeeUniqueId));
    }
  }, [dispatch, empData]);

  if (!selectedJob) {
    if (role === GLOBAL_CONST.WFMTeam && childScreenLoader) {
      return (
        <span className="loader">
          <img src={loaderImage} alt="Loading" />
        </span>
      );
    }
  }

  const earmarkedSorter = (a, b) => {
    if (a.status === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked) {
      return -1;
    }
    if (b.status === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked) {
      return 1;
    }
    return a?.status < b?.status ? -1 : 1;
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    selectedJob?.employeeApplications?.length / itemsPerPage
  );
  // const totalRecords = selectedJob.employeeApplications.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = selectedJob?.employeeApplications?.slice(
    startIndex,
    endIndex
  );

  const getIsAnyResourceEarmarkedForRR = () => {
    const earmarkedResource = itemsToShow?.filter(
      (item) => item?.status === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked
    );
    return earmarkedResource?.length > 0;
  };

  const toggleMenu = (job) => {
    setEmpData(job);
    setOpenOptionMenu(!openOptionMenu);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleConfirmationPopup = (value, job) => {
    //TODO: Remove this line if you found some issue
    setEmpData(job);
    setUserAction(value);
    setConfirmationPopup(true);
    dispatch(fetchEmployeeProfile(job.employeeUniqueId));

    if (value === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn) {
      setConfirmationMessage(GLOBAL_CONST.ScheduledForWithDrawnStatus);
    } else if (value === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined) {
      setConfirmationMessage(GLOBAL_CONST.ScheduledForDeclinedStatus);
    } else if (value === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped) {
      setConfirmationMessage(GLOBAL_CONST.scheduleForDroppedStatus);
    } else if (value === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.L2Discussion) {
      setConfirmationMessage(GLOBAL_CONST.scheduleForL2Discussion);
    } else if (
      value === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.AllocationRequested
    ) {
      setConfirmationMessage(GLOBAL_CONST.revertConfirmation);
    } else {
      setConfirmationMessage("");
    }
  };

  const openConfirmationModal = (application) => {
    dispatch(fetchEmployeeProfile(application.employeeUniqueId));
    setSelectedApplication(application);
    setShowConfirmationPopup(true);
  };

  const openConfirmationModalForScheduleL2 = (application) => {
    setOpenOptionMenu(false);
    setSelectedApplication(application);
    setShowConfirmationPopup(true);
  };

  const handleProceedToSchedule = () => {
    setShowConfirmationPopup(false);
    setShowSchedulePopup(true);
  };

  const handleConfirmationAction = (action, job) => {
    if (
      userAction === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn &&
      action === "Yes"
    ) {
      openConfirmationModal(job);
    } else if (
      userAction === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined &&
      action === "Yes"
    ) {
      openConfirmationModal(job);
    } else if (
      userAction === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.L2Discussion &&
      action === "Yes"
    ) {
      openConfirmationModal(job);
    } else if (
      userAction === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.AllocationRequested &&
      action === "Yes"
    ) {
      handleRevert(job);
    }
    setUserAction(null);
    setConfirmationPopup(false);
  };

  const handleRevert = async (job) => {
    try {
      const response = await applyForJob(
        job?.employeeUniqueId,
        selectedJob?.rrId,
        selectedJob?.rrNumber,
        employeeId
      );
      if (response) {
        setToasterMessage("Reverted successfully");
        setShowToaster(true);
        setToasterType("success");
        setTimeout(() => {
          if (managerId) {
            dispatch(fetchManagerAppliedJobById(managerId));
          } else {
            if (role === GLOBAL_CONST.Manager && managerIdFromStore) {
              dispatch(fetchManagerAppliedJobById(managerIdFromStore));
            }
          }
        }, 20);
      }
    } catch (error) {}
  };

  const openWithdrawModal = (application) => {
    dispatch(fetchEmployeeProfile(application.employeeUniqueId));
    setSelectedApplication(application);
    setShowWithdrawPopup(true);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawPopup(false);
    setSelectedApplication(null);
    setWithdrawReason("");
  };

  const handleCloseConfirmationPopup = () => {
    setShowConfirmationPopup(false);
    closeWithdrawModal();
    dispatch(fetchEmployeeProfile(null));
  };

  const handleWithdraw = async () => {
    setIsLoading(true);

    if (selectedApplication !== null && withdrawReason?.trim() !== "") {
      const requestData = {
        employeeId: selectedApplication?.employeeUniqueId,
        resourceRequestId: selectedJob?.rrId,
        resourceRequestNumber: selectedJob?.rrNumber,
        disapprovedBy: "Manager",
        reasonForDisapprove: withdrawReason,
      };

      try {
        await dispatch(disaproveOpportunity(requestData));

        setToasterMessage("Declined successfully");
        setShowToaster(true);
        setToasterType("success");
        const emailBody =
          MANAGER_DECLINE_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailBody
            ?.replace("<EMPLOYEE_NAME>", employeeProfile?.employeeName)
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
            ?.replace("<REASON_REJECTION>", requestData?.reasonForDisapprove)
            ?.replace(
              "<MANAGER_NAME>",
              rrs?.resourceRequestDetails?.requesterName
            );
        const emailSubject =
          MANAGER_DECLINE_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailSubject?.replace(
            "<RR_NUMBER>",
            rrs?.resourceRequestDetails?.rrNumber
          );
        const toRecipients = [employeeProfile?.emailId];
        const ccRecipients = [
          rrs?.resourceRequestDetails?.requesterMailId,
          WFM_TEAM_EMAIL_ADDRESS,
        ];
        await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
        await sendChat(
          emailBody?.replaceAll("<br>", ""),
          employeeProfile?.emailId
        );
        closeWithdrawModal();
        setTimeout(() => {
          if (managerId) {
            dispatch(fetchManagerAppliedJobById(managerId));
          } else {
            if (role === GLOBAL_CONST.Manager && managerIdFromStore) {
              dispatch(fetchManagerAppliedJobById(managerIdFromStore));
            }
          }
        }, 1000);
      } catch (error) {
        setShowErrorMessage(true);
      } finally {
        setIsLoading(false);

        setTimeout(() => {
          setShowToaster(false);
        }, 1000);
      }
    } else {
      setShowErrorMessage(true);
      setIsLoading(false);
    }
  };

  const handleInterviewRejection = async (
    RRInfo,
    employeeDetails,
    rejectionReason
  ) => {
    setIsLoading(true);
    const requestData = {
      employeeId: employeeDetails?.employeeUniqueId,
      resourceRequestId: RRInfo?.rrId,
      resourceRequestNumber: RRInfo?.rrNumber,
      disapprovedBy: "Manager",
      reasonForDisapprove: rejectionReason?.reason,
      additionalComments: rejectionReason?.comments
        ? rejectionReason?.comments
        : "",
      isMeetingHappened: true,
    };
    try {
      await dispatch(rejectCandidate(requestData));

      setToasterMessage("Dropped successfully");
      setShowToaster(true);
      setToasterType("success");

      const emailBody =
        MANAGER_INTERVIEW_REJECTION_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailBody
          ?.replace("<EMPLOYEE_NAME>", empData?.employeeName)
          ?.replace(
            "<MANAGER_NAME>",
            rrs?.resourceRequestDetails?.requesterName
          );
      const emailSubject =
        MANAGER_INTERVIEW_REJECTION_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailSubject?.replace(
          "<RR_NUMBER>",
          rrs?.resourceRequestDetails?.rrNumber
        );
      const toRecipients = [employeeProfile?.emailId];
      const ccRecipients = [
        rrs?.resourceRequestDetails?.requesterMailId,
        WFM_TEAM_EMAIL_ADDRESS,
      ];
      await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);

      await sendChat(
        emailBody?.replaceAll("<br>", ""),
        employeeProfile?.emailId
      );

      const wfmEmailBody =
        MANAGER_INTERVIEW_REJECTION_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailBody
          ?.replace("<EMPLOYEE_NAME>", empData?.employeeName)
          ?.replace(
            "<REJECTION_REASON>",
            rejectionReason?.reason ? rejectionReason?.reason : ""
          )
          ?.replace(
            "<COMMENTS>",
            rejectionReason?.comments ? rejectionReason?.comments : ""
          )
          ?.replace(
            "<MANAGER_NAME>",
            rrs?.resourceRequestDetails?.requesterName
          );
      const wfmEmailSubject =
        MANAGER_INTERVIEW_REJECTION_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailSubject?.replace(
          "<RR_NUMBER>",
          rrs?.resourceRequestDetails?.rrNumber
        );

      await sendEmail(
        wfmEmailBody,
        wfmEmailSubject,
        WFM_TEAM_EMAIL_ADDRESS,
        rrs?.resourceRequestDetails?.requesterMailId
      );

      setInterviewRejectionPopup(false);
      setTimeout(() => {
        if (managerId) {
          dispatch(fetchManagerAppliedJobById(managerId));
        } else {
          if (role === GLOBAL_CONST.Manager && managerIdFromStore) {
            dispatch(fetchManagerAppliedJobById(managerIdFromStore));
          }
        }
      }, 1000);
    } catch (error) {
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowToaster(false);
      }, 1000);
    }
  };

  const handleReallocation = async (
    RRInfo,
    employeeDetails,
    additionalComments,
    allocationStartDate,
    allocationPercentage
  ) => {
    setIsLoading(true);
    const requestData = {
      employeeId: employeeDetails?.employeeUniqueId,
      rrId: RRInfo?.rrId,
      allocationStartDate: convertUTCtoIST(allocationStartDate?.toISOString()),
      additionalComments: additionalComments ? additionalComments : "",
      allocationPercentage: allocationPercentage?.value,
      wfmAllocationPercentage: null,
      wfmAllocationStartDate: null,
      requesterID: managerIdFromStore,
      status: GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.AllocationRequested,
    };
    try {
      await dispatch(allocateCandidate(requestData));

      setToasterMessage("Allocation successfully");
      setShowToaster(true);
      setToasterType("success");

      const emailBody =
        MANAGER_RESOURCE_ALLOCATION_REQUEST_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailBody
          ?.replace("<CANDIDATE_NAME>", employeeProfile?.employeeName)
          ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
          ?.replace("<ROLE_NAME>", rrs?.resourceRequestDetails?.jobTitle)
          ?.replace("<PROJECT_NAME>", rrs?.resourceRequestDetails?.accountName)
          ?.replace(
            "<ALLOCATION_DATE>",
            rrs?.resourceRequestDetails?.startDate?.split("T")[0]
          )
          ?.replace(
            "<ALLOCATION_PERCENTAGE>",
            rrs?.resourceRequestDetails?.allocation
          )
          ?.replace(
            "<MANAGER_NAME>",
            rrs?.resourceRequestDetails?.requesterName
          );
      const emailSubject =
        MANAGER_RESOURCE_ALLOCATION_REQUEST_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_WFM?.emailSubject?.replace(
          "<RR_NUMBER>",
          rrs?.resourceRequestDetails?.rrNumber
        );
      const ccRecipients = [];
      if (
        rrs?.resourceRequestDetails?.requesterMailId !==
        rrs?.resourceRequestDetails?.projectManagerMailID
      ) {
        ccRecipients.push(
          rrs?.resourceRequestDetails?.requesterMailId,
          rrs?.resourceRequestDetails?.projectManagerMailID
        );
      } else {
        ccRecipients.push(rrs?.resourceRequestDetails?.requesterMailId);
      }
      const toRecipients = [WFM_TEAM_EMAIL_ADDRESS];
      await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);

      setResourceAllocationPopup(false);
      setTimeout(() => {
        if (managerId) {
          dispatch(fetchManagerAppliedJobById(managerId));
        } else {
          if (role === GLOBAL_CONST.Manager && managerIdFromStore) {
            dispatch(fetchManagerAppliedJobById(managerIdFromStore));
          }
        }
      }, 1000);
    } catch (error) {
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowToaster(false);
      }, 1000);
    }
  };

  const handleScheduleDiscussion = async () => {
    setIsLoading(true);
    setShowToaster(false);
    setToasterMessage("");
    setToasterType("");
    setShowErrorMessage(false);
    if (selectedApplication !== null) {
      const discussionStart = new Date(discussionStartTime);
      const discussionEnd = new Date(discussionEndTime);
      const now = new Date();

      if (discussionStart <= now || discussionEnd <= now) {
        setShowToaster(true);
        setToasterMessage("Discussion date is in the past");
        setToasterType("error");
        setIsLoading(false);
        return;
      } else if (discussionEnd < discussionStart) {
        setShowToaster(true);
        setToasterMessage("Discussion end time should be after start time");
        setToasterType("error");
        setIsLoading(false);
        return;
      } else if (
        discussionEnd.getDate() === discussionStart.getDate() &&
        discussionEnd.getHours() === discussionStart.getHours() &&
        discussionEnd.getMinutes() <= discussionStart.getMinutes()
      ) {
        setShowToaster(true);
        setToasterMessage("Discussion end time should be after start time");
        setToasterType("error");
        setIsLoading(false);
        return;
      }

      const participantsEmails = participants.join(";"); // Use semicolon as separator
      const participantsArray = participantsEmails
        .split(";")
        .map((email) => email.trim());

      const emailRegex = /^$|^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      const invalidEmails = participantsArray?.filter(
        (email) => !emailRegex.test(email)
      );

      if (invalidEmails?.length > 0) {
        setShowToaster(true);
        setToasterMessage(
          "Invalid email addresses: " + invalidEmails.join(", ")
        );
        setToasterType("error");
        setIsLoading(false);
        return;
      }
      const discussionDurationMinutes = Math.round(
        (discussionEnd - discussionStart) / (1000 * 60)
      );
      const requestScheduleData = {
        discussionStartTime: discussionStart?.toISOString(),
        discussionDuration: discussionDurationMinutes,
        optionalAttendees: participantsEmails,
        employeeMailId: selectedApplication?.employeeEmailId,
        employeeId: selectedApplication?.employeeUniqueId,
        managerEmployeeMailId: managerMailId,
        managerEmployeeId: managerId,
        rrId: selectedJob?.rrId,
        resourceRequestNumber: selectedJob?.rrNumber,
        location: selectedJob?.workLocation,
        status:
          selectedApplication?.status ===
          GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled
            ? GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.L2Discussion
            : GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM?.Scheduled,
      };

      const emailData = {
        employeeName: selectedApplication?.employeeName,
        rrNumber: selectedJob?.rrNumber,
        jobTitle: selectedJob?.jobTitle,
        project: selectedJob?.project,
        employeeMailId: selectedApplication?.employeeEmailId,
        managerMailId: managerMailId,
        optionalAttendees: participantsEmails,
        startDate: discussionStartTime,
        endDate: discussionEndTime,
        isL2Discussion:
          empData?.status === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled &&
          new Date() > new Date(empData?.scheduledDate),
      };
      try {
        await dispatch(SendInvite(emailData));
        await dispatch(scheduleDiscussion(requestScheduleData));

        setToasterMessage("Scheduled discussion successfully");
        setToasterType("success");
        setShowToaster(true);

        if (
          empData?.status === GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled
        ) {
          const emailBody =
            MANAGER_L2SCHEDULE_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailBody
              ?.replace("<EMPLOYEE_NAME>", employeeProfile?.employeeName)
              ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
              ?.replace(
                "<MANAGER_NAME>",
                rrs?.resourceRequestDetails?.requesterName
              );
          const emailSubject =
            MANAGER_L2SCHEDULE_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailSubject?.replace(
              "<RR_NUMBER>",
              rrs?.resourceRequestDetails?.rrNumber
            );
          const toRecipients = [employeeProfile?.emailId];
          const ccRecipients = [
            rrs?.resourceRequestDetails?.requesterMailId,
            WFM_TEAM_EMAIL_ADDRESS,
          ];
          await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
          await sendChat(
            emailBody?.replaceAll("<br>", ""),
            employeeProfile?.emailId
          );
        } else {
          const emailBody =
            MANAGER_SCHEDULE_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailBody
              ?.replace("<EMPLOYEE_NAME>", employeeProfile?.employeeName)
              ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
              ?.replace(
                "<MANAGER_NAME>",
                rrs?.resourceRequestDetails?.requesterName
              );
          const emailSubject =
            MANAGER_SCHEDULE_EMAIL_DATA?.MANAGER_MAIL_BODY_TO_EMPLOYEE?.emailSubject?.replace(
              "<RR_NUMBER>",
              rrs?.resourceRequestDetails?.rrNumber
            );
          const toRecipients = [employeeProfile?.emailId];
          const ccRecipients = [
            rrs?.resourceRequestDetails?.requesterMailId,
            WFM_TEAM_EMAIL_ADDRESS,
          ];
          await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
          await sendChat(
            emailBody?.replaceAll("<br>", ""),
            employeeProfile?.emailId
          );
        }
        closeWithdrawModal();
        setShowSchedulePopup(false);
        setTimeout(() => {
          if (managerId) {
            dispatch(fetchManagerAppliedJobById(managerId));
          } else {
            if (role === GLOBAL_CONST.Manager && managerIdFromStore) {
              dispatch(fetchManagerAppliedJobById(managerIdFromStore));
            }
          }
        }, 1500);
      } catch (error) {
        console.error("Schedule discussion error:", error);
        setShowErrorMessage(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowErrorMessage(true);
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    dispatch(setMatchingResource(!matchingResources));
  };

  const handleOpenRejectionComments = (job) => {
    setEmpData(job);
    setRejectionCommentPopup(true);
  };

  const closeRejectionCommentPopup = () => {
    setRejectionCommentPopup(false);
    setTimeout(() => {
      setEmpData(null);
    }, 100);
  };

  const handleBackButtonClick = () => {
    dispatch(setMatchingResource(false));
    navigate(-1);
  };

  return (
    <>
      <span className="back-arrow">
        <img
          src={backIcon}
          alt=""
          title="Go back"
          onClick={handleBackButtonClick}
        />
      </span>
      <div className="page-header">
        <h1>
          {selectedJob?.rrNumber} - {selectedJob?.project}
          <span className="job-title">
            {selectedJob?.jobTitle} &nbsp; | &nbsp;{" "}
            <div className="job-skills">
              {selectedJob?.primarySkill}, {selectedJob?.secondarySkill}
            </div>
          </span>
        </h1>
        <div className="filters reviewappfilter">
          {/* <button className="btn mb-4"> Show Matching Talents </button> */}
          <label className="future-available-checkbox-label">
            <input
              type="checkbox"
              checked={matchingResources}
              onChange={handleCheckboxChange}
              disabled={getIsAnyResourceEarmarkedForRR()}
            />
            Show Matching Talents
          </label>
          <ViewToggle onChange={handleViewChange} />
        </div>
      </div>
      {matchingResources ? (
        <>
          {isListMode ? (
            <ShowMatchingResources
              dataSelector={(state) => state.manager.getRRMatchingEmployeesData}
              selectedJob={selectedJob}
              viewType="list"
            />
          ) : (
            <ShowMatchingResources
              dataSelector={(state) => state.manager.getRRMatchingEmployeesData}
              selectedJob={selectedJob}
              viewType="tile"
            />
          )}
        </>
      ) : (
        <>
          {isListMode && (
            <ul className="list-table review-child-list">
              <li className="list-header">
                <div
                  className="empname"
                  onClick={() => handleSort("employeeName")}
                >
                  Applied By
                  {sortColumn === "employeeName" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "employeeName" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div onClick={() => handleSort("employeePreviousProject")}>
                  Previous Project
                  {sortColumn === "employeePreviousProject" &&
                    sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                  {sortColumn === "employeePreviousProject" &&
                    sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                </div>
                <div onClick={() => handleSort("jobAppliedOn")}>
                  Applied On
                  {sortColumn === "jobAppliedOn" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "jobAppliedOn" && sortOrder === "desc" && (
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
                <div onClick={() => handleSort("employeeExperience")}>
                  Overall Experience
                  {sortColumn === "employeeExperience" &&
                    sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                  {sortColumn === "employeeExperience" &&
                    sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                </div>
                <div onClick={() => handleSort("status")}>
                  Status
                  {sortColumn === "status" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "status" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                {role === GLOBAL_CONST.WFMTeam ||
                role === GLOBAL_CONST.Manager ? (
                  <div
                    className="suitability suitability-header"
                    onClick={() => handleSort("matchPercentage")}
                  >
                    Match Indicator
                    <Suitability />
                    {sortColumn === "matchPercentage" &&
                      sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                    {sortColumn === "matchPercentage" &&
                      sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                  </div>
                ) : (
                  <div></div>
                )}
                 {role === GLOBAL_CONST.Manager && <div>Available Allocation</div>}
                {role !== GLOBAL_CONST.WFMTeam && <div>Actions</div>}
              </li>
              {itemsToShow
                ?.slice()
                ?.sort((a, b) => {
                  if (sortColumn) {
                    const aValue = String(a[sortColumn] || ""); // Ensure aValue is a string
                    const bValue = String(b[sortColumn] || ""); // Ensure bValue is a string
                    if (sortOrder === "asc") {
                      return aValue.localeCompare(bValue);
                    } else {
                      return bValue.localeCompare(aValue);
                    }
                  }
                  return 0;
                })
                ?.sort(earmarkedSorter)
                ?.map((job, index) => {
                  const startDate = new Date(job?.jobAppliedOn);
                  const options = { month: "short", day: "numeric" };
                  const formattedDate = startDate.toLocaleString(
                    undefined,
                    options
                  );
                  const primarySkills = job?.primarySkill
                    ? job?.primarySkill.split(",")
                    : [];
                  const secondarySkills = job?.secondarySkill
                    ? job?.secondarySkill.split(",")
                    : [];
                  const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job?.employeeUniqueId}.jpeg`;

                  return (
                    <Fragment key={index}>
                      <li key={job?.rrId} className="list-data">
                        <div className="empname">
                          <Link
                            className="list-data-emp-head"
                            to={`/review-appication/${job.employeeUniqueId}`}
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
                              <h2>{job?.employeeName}</h2>
                              <h3>{job?.employeeEmailId}</h3>
                              <h4>{job?.employeeDesignation}</h4>
                            </span>
                          </Link>
                        </div>
                        <div style={{ whiteSpace: "nowrap" }}>
                          {job?.employeePreviousProject}
                        </div>
                        <div>{formattedDate}</div>
                        <div
                          className="skills tooltip"
                          data-tooltip={`${job?.primarySkill},${job?.secondarySkill}`}
                        >
                          {primarySkills.map((skill, index) => (
                            <span key={index}>{skill.trim()}</span>
                          ))}
                          {secondarySkills.map((skill, index) => (
                            <span key={index}>{skill.trim()}</span>
                          ))}
                        </div>
                        <div>{job?.employeeExperience}</div>
                        <div className="status-cont">
                          {job?.status ===
                          GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.L2Discussion ? (
                            <div className="status-schedule-wrapper">
                              <div className="disapproved status-schedule">
                                <p className="L2schedule">L2 Scheduled</p>
                              </div>
                              {job?.scheduledDate && (
                                <div className="date-format">
                                  {formatDate(job?.scheduledDate)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {job?.status ===
                              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ? (
                                <div className={`status-${job?.status}`}>
                                  {job?.status}
                                  <span
                                    className="notepad-icon-container"
                                    onClick={() =>
                                      handleOpenRejectionComments(job)
                                    }
                                  >
                                    <img
                                      className="notepad-icon"
                                      src={notepadIcon}
                                      alt="View Comments"
                                    />
                                  </span>
                                </div>
                              ) : job?.status ===
                                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                  .Scheduled ? (
                                <div className="status-schedule-wrapper">
                                  <div className="disapproved status-schedule">
                                    <p className="L2schedule"> {job?.status}</p>
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
                                    job?.status ===
                                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped
                                      ? "dropped"
                                      : job.status ===
                                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                          .AllocationRequested
                                      ? "resource-allocation"
                                      : `colorstatus${job?.status}`
                                  }
                                >
                                  {job?.status}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div>
                          {role === GLOBAL_CONST?.WFMTeam ||
                          role === GLOBAL_CONST?.Manager ? (
                            <div className="suitability">
                              {job?.matchPercentage < 30 ? (
                                <img src={lessMatchIcon} alt="Suitability" />
                              ) : (
                                <img src={matchIcon} alt="Suitability" />
                              )}
                              {job?.matchPercentage}%
                              <Popup
                                trigger={(open) => (
                                  <img
                                    className="tooltip-img"
                                    src={infoIcon}
                                    alt="info"
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                                position="top center"
                                on={["hover", "focus"]}
                                arrow={true}
                                closeOnDocumentClick
                              >
                                <div
                                  style={{
                                    background: "#fff",
                                    fontSize: 14,
                                    border: "1px solid #533eed",
                                    borderRadius: 8,
                                    boxShadow: "0px 0px 16px 0px #d5d5e0",
                                    padding: "10px 20px",
                                    color: "#666",
                                  }}
                                >
                                  {job?.matchCriteria || "No Matching Criteria"}
                                </div>
                              </Popup>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                        {role === GLOBAL_CONST.Manager &&    <div> 
                            {job.availableAllocationPercentage==100
                            ? <span>{job.availableAllocationPercentage}%</span> 
                            :<span className="AllocationLessThanHundreds">{job.availableAllocationPercentage}%</span> 
                            }
                       
                        </div>}
                        {role !== GLOBAL_CONST.WFMTeam && (
                          <div>
                            {job?.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ? (
                              <button
                                className="btn mb-4"
                                onClick={() =>
                                  handleConfirmationPopup(
                                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                      .Declined,
                                    job
                                  )
                                }
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.SCHEDULE_DISCUSSION}
                              </button>
                            ) : job.status ===
                                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                  .Scheduled ||
                              job.status ===
                                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                  .L2Discussion ? (
                              job?.scheduledDate &&
                              checkScheduleTimePassed(job?.scheduledDate) ? (
                                <>
                                  <UpdateStatus
                                    selectedJob={selectedJob}
                                    employeeDetails={empData}
                                    interviewRejectionPopup={
                                      interviewRejectionPopup
                                    }
                                    setInterviewRejectionPopup={
                                      setInterviewRejectionPopup
                                    }
                                    resourceAllocationPopup={
                                      resourceAllocationPopup
                                    }
                                    setResourceAllocationPopup={
                                      setResourceAllocationPopup
                                    }
                                    handleInterviewRejection={
                                      handleInterviewRejection
                                    }
                                    handleReallocation={handleReallocation}
                                    isLoading={isLoading}
                                    openOptionMenu={openOptionMenu}
                                    setOpenOptionMenu={setOpenOptionMenu}
                                    handleToggle={() => toggleMenu(job)}
                                    sameOpt={
                                      empData?.employeeUniqueId ===
                                      job?.employeeUniqueId
                                        ? true
                                        : false
                                    }
                                    openConfirmationModalForScheduleL2={
                                      openConfirmationModalForScheduleL2
                                    }
                                    showAllocation={selectedJob?.employeeApplications?.some(
                                      (obj) =>
                                        obj?.status ===
                                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                          .AllocationRequested
                                    )}
                                    isDisabled={getIsAnyResourceEarmarkedForRR()}
                                  />
                                </>
                              ) : (
                                <button
                                  className="btn mb-4"
                                  onClick={() => openWithdrawModal(job)}
                                  disabled={getIsAnyResourceEarmarkedForRR()}
                                >
                                  {CONST.DECLINE}
                                </button>
                              )
                            ) : job.status ===
                              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ? (
                              <div className="update-status-wrapper">
                                <WithdrawActionButton
                                  openWithdrawModal={openWithdrawModal}
                                  handleConfirmationPopup={
                                    handleConfirmationPopup
                                  }
                                  job={job}
                                  isDisabled={getIsAnyResourceEarmarkedForRR()}
                                />
                              </div>
                            ) : job?.status ===
                              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped ? (
                              <button
                                className="btn mb-4"
                                onClick={() => openConfirmationModal(job)}
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.SCHEDULE_DISCUSSION}
                              </button>
                            ) : job?.status ===
                              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                .AllocationRequested ? (
                              <button
                                className="btn mb-4"
                                onClick={() =>
                                  handleConfirmationPopup(
                                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                      .AllocationRequested,
                                    job
                                  )
                                }
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.REVERT}
                              </button>
                            ) : (
                              <div className="update-status-wrapper">
                                <ActionButton
                                  openWithdrawModal={openWithdrawModal}
                                  openConfirmationModal={openConfirmationModal}
                                  job={job}
                                  isDisabled={getIsAnyResourceEarmarkedForRR()}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {
                          //TODO: put back job={job} if causing any issue
                        }
                        <ConfirmationPopup
                          confirmationPopup={confirmationPopup}
                          handleConfirmationAction={handleConfirmationAction}
                          confirmationMessage={confirmationMessage}
                          job={empData}
                        />
                      </li>
                    </Fragment>
                  );
                })}
            </ul>
          )}
          {!isListMode && (
            <div className="tile-table card-wrap">
              {itemsToShow.map((job, index) => {
                const startDate = new Date(job.jobAppliedOn);
                const options = { month: "short", day: "numeric" };
                const formattedDate = startDate.toLocaleString(
                  undefined,
                  options
                );
                const primarySkills = job.primarySkill
                  ? job.primarySkill.split(",")
                  : [];
                const secondarySkills = job.secondarySkill
                  ? job.secondarySkill.split(",")
                  : [];
                const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job.employeeUniqueId}.jpeg`;

                return (
                  <div key={index} className="card">
                    <Link
                      className="card-header review-child-card"
                      to={`/review-appication/${job.employeeUniqueId}`}
                    >
                      <div className="card-emp-head">
                        <div>
                          {employeeImg && (
                            <img
                              className="empimg"
                              src={employeeImg}
                              alt=""
                              onError={(e) => (e.target.src = avatar)}
                            />
                          )}
                        </div>
                        <div>
                          <h2>{job.employeeName}</h2>
                          <h3>{job.employeeEmailId}</h3>
                        </div>
                      </div>
                    </Link>
                    <div className="card-cont">
                      <p>
                        <b>Applied on:</b> {formattedDate}
                      </p>
                      <p>
                        <b>Overall Experience:</b> {job.employeeExperience}{" "}
                        Years
                      </p>
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
                      <div className="status-card">
                        Status:
                        {job.status ===
                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ? (
                          <div className="disapproved">{job.status}</div>
                        ) : job.status ===
                          GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled ? (
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
                                : ""
                            }
                          >
                            {job.status}
                          </div>
                        )}
                      </div>
                    </div>
                    {role !== GLOBAL_CONST.WFMTeam && (
                      <div className="card-footer">
                        <div>
                          {job.status ===
                          GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined ? (
                            <button
                              className="btn mb-4"
                              onClick={() =>
                                handleConfirmationPopup(
                                  GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Declined,
                                  job
                                )
                              }
                              disabled={getIsAnyResourceEarmarkedForRR()}
                            >
                              {CONST.SCHEDULE_DISCUSSION}
                            </button>
                          ) : job.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled ? (
                            job?.scheduledDate &&
                            checkScheduleTimePassed(job?.scheduledDate) ? (
                              <UpdateStatus
                                selectedJob={selectedJob}
                                employeeDetails={empData}
                                interviewRejectionPopup={
                                  interviewRejectionPopup
                                }
                                setInterviewRejectionPopup={
                                  setInterviewRejectionPopup
                                }
                                resourceAllocationPopup={
                                  resourceAllocationPopup
                                }
                                setResourceAllocationPopup={
                                  setResourceAllocationPopup
                                }
                                handleInterviewRejection={
                                  handleInterviewRejection
                                }
                                handleReallocation={handleReallocation}
                                isLoading={isLoading}
                                openOptionMenu={openOptionMenu}
                                setOpenOptionMenu={setOpenOptionMenu}
                                handleToggle={() => toggleMenu(job)}
                                sameOpt={
                                  empData?.employeeUniqueId ===
                                  job?.employeeUniqueId
                                    ? true
                                    : false
                                }
                                showAllocation={selectedJob?.employeeApplications?.some(
                                  (obj) =>
                                    obj?.status ===
                                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                      .AllocationRequested
                                )}
                              />
                            ) : (
                              <button
                                className="btn mb-4"
                                onClick={() => openWithdrawModal(job)}
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.DECLINE}
                              </button>
                            )
                          ) : job.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Withdrawn ? (
                            <>
                              <button
                                className="btn mb-4"
                                onClick={() => openWithdrawModal(job)}
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.DECLINE}
                              </button>
                              <button
                                className="btn mb-4"
                                onClick={() =>
                                  handleConfirmationPopup(
                                    GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                                      .Withdrawn,
                                    job
                                  )
                                }
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.SCHEDULE_DISCUSSION}
                              </button>
                            </>
                          ) : job?.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Dropped ? (
                            <button
                              className="btn mb-4"
                              onClick={() => openConfirmationModal(job)}
                              disabled={getIsAnyResourceEarmarkedForRR()}
                            >
                              {CONST.SCHEDULE_DISCUSSION}
                            </button>
                          ) : job?.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                              .AllocationRequested ? (
                            <button
                              className="btn mb-4"
                              onClick={() => openConfirmationModal(job)}
                              disabled={getIsAnyResourceEarmarkedForRR()}
                            >
                              {CONST.REVERT}
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn mb-4"
                                onClick={() => openWithdrawModal(job)}
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.DECLINE}
                              </button>
                              <button
                                className="btn mb-4"
                                onClick={() => openConfirmationModal(job)}
                                disabled={getIsAnyResourceEarmarkedForRR()}
                              >
                                {CONST.SCHEDULE_DISCUSSION}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
      {showWithdrawPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Reason for Disapprove</h2>
              <p>Please select a reason for decline</p>
            </div>
            <div className="modal-cont" key={selectedJob.rrId}>
              <img
                className="profile-img"
                src={`${EMPLOYEE_IMG_URL_BASE}${selectedApplication.employeeUniqueId}.jpeg`}
                alt=""
                onError={(e) => (e.target.src = avatar)}
              />
              <div>
                <div>
                  <b>Employee Name : </b>
                  {selectedApplication.employeeName}
                </div>
                <div>
                  <b>Overall Experience : </b>
                  {selectedApplication.employeeExperience}
                </div>
                <div className="skills">
                  <b>Skills : </b>
                  {selectedApplication.primarySkill ? (
                    <span>{selectedApplication.primarySkill}</span>
                  ) : null}
                  {selectedApplication.secondarySkill ? (
                    <span>{selectedApplication.secondarySkill}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className="error-text-msg"
              style={{ display: showErrorMessage ? "block" : "none" }}
            >
              Please select a reason for decline.
            </div>

            <select
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              {disapproveReason.map((reason, index) => (
                <option key={index} value={reason.reason}>
                  {reason.disapprovalReason}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              {isLoading && (
                <span className="loader">
                  <img src={loaderImage} alt="Loading" />
                </span>
              )}
              <button className="modal-button" onClick={handleWithdraw}>
                Decline
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
      {showConfirmationPopup && (
        <div className="modal-overlay schedule">
          <div className="modal-content w-400">
            <div className="modal-header">
            {  
     (selectedJob.employeeApplications?.find((job) => job.employeeName === selectedApplication.employeeName)?.allocationPercentage===100) ?(
              <p>

                Are you sure you want to proceed with Scheduling{" "}
                {selectedApplication.status ===
                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled
                  ? "an L2"
                  : "a"}{" "}
                discussion for <b>{selectedApplication.employeeName}</b> for the
                role of {selectedJob.jobTitle} in {selectedJob.project}?
              </p>):<p> {selectedApplication.status ===
                GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Scheduled
                  ? "an L2"
                  : ""}{" "}Talent selected is available for {100-selectedJob.employeeApplications?.find((job) => job.employeeName === selectedApplication.employeeName)?.allocationPercentage} allocation only, are you certain to continue with this Talent? </p>
}
            </div>
            <div className="modal-cont" key={selectedJob.rrId}></div>
            <div className="modal-buttons">
              <button
                className="modal-button"
                onClick={handleProceedToSchedule}
              >
                Proceed
              </button>
              <button
                className="cancel modal-button"
                onClick={handleCloseConfirmationPopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSchedulePopup && (
        <div className="modal-overlay schedule">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule Discussion</h2>
              <p>
                Choose a date and time slot, and include recipients if needed.
              </p>
            </div>
            <div className="modal-cont" key={selectedJob.rrId}>
              <div className="profile-header">
                <img
                  className="user"
                  src={`${EMPLOYEE_IMG_URL_BASE}${selectedApplication.emidsUniqueId}.jpeg`}
                  alt=""
                  onError={(e) => {
                    e.target.src = avatar;
                  }}
                />
                <div className="head-details">
                  <h1>{selectedApplication.employeeName}</h1>
                  <span>
                    {selectedApplication.employeeRole} |{" "}
                    {selectedApplication.employeeUniqueId}
                  </span>
                  <span className="contact-details">
                    <span>
                      <img src={emailIcon} alt="Email" />
                      {selectedApplication.employeeEmailId}
                    </span>
                    <span className="skills">
                      <img src={skillIcon} alt="Skills" />
                      {selectedApplication.primarySkill
                        .split(",")
                        .map((skill, index) => (
                          <span key={index}>{skill.trim()}</span>
                        ))}
                    </span>
                  </span>
                </div>
              </div>
              <div className="calendar">
                <p>Date and Time Slots</p>
                <div className="calendar-input">
                  <DatePicker
                    selected={discussionStartTime}
                    onChange={(date) => setDiscussionStartTime(date)}
                    dateFormat="MMMM d, yyyy"
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    minDate={new Date()}
                  />
                  <DatePicker
                    selected={discussionStartTime}
                    onChange={(date) => setDiscussionStartTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="From"
                    dateFormat="h:mm aa"
                    className="time-picker"
                    placeholderText="00:00"
                  />
                  <DatePicker
                    selected={discussionEndTime || discussionStartTime}
                    onChange={(date) => {
                      const newEndTime = new Date(discussionStartTime);
                      newEndTime.setHours(date.getHours());
                      newEndTime.setMinutes(date.getMinutes());
                      setDiscussionEndTime(newEndTime);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="To"
                    dateFormat="h:mm aa"
                    className="time-picker"
                    placeholderText="00:00"
                  />
                </div>
              </div>
              <div className="participants-wrap">
                <p>Optional attendees(seperately by semicolon)</p>
                <input
                  type="text"
                  id="email-input"
                  placeholder="Add participants separated by semicolon"
                  value={participants.join(", ")}
                  onChange={(e) =>
                    setParticipants(
                      e.target.value.split(",").map((email) => email.trim())
                    )
                  }
                />
              </div>
            </div>
            <div className="modal-buttons">
              {isLoading && (
                <span className="loader">
                  <img src={loaderImage} alt="Loading" />
                </span>
              )}
              <button
                className="modal-button"
                onClick={handleScheduleDiscussion}
              >
                Schedule
              </button>
              <button
                className="cancel modal-button"
                onClick={() => setShowSchedulePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Popup
        open={rejectionCommentPopup}
        onClose={() => closeRejectionCommentPopup()}
        closeOnDocumentClick={true}
      >
        <ViewManagerComments
          empData={empData}
          handleClose={() => closeRejectionCommentPopup()}
        />
      </Popup>
    </>
  );
};

export default PaginatedReviewApplicationChildPage;
