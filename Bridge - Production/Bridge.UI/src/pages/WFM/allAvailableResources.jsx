import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../components/home/home.scss";
import loaderImage from "../../resources/Loader.svg";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../resources/user-icon.svg";
import Pagination from "../../components/pagination";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import Popup from "reactjs-popup";
import ResourceAvailability from "../../components/ResourceAvailability";
import EarmakedPopup from "../../components/EarmakedPopup";
import UpdateEmployeeConfirmationPopUp from "../../components/UpdateEmployeeConfirmationPopUp";
import {
  getAllAvailableResources,
  saveResourceAvailability,
  sortAvailableResources,
  setAvailableResourcesPageCount,
  filterAvailableResource,
} from "../../redux/actions/managerActions";
import SingleResource from "./SingleResource";
import {
  getDashSeparatedDate,
  convertDateFromSlashSeparatedToDashSeparated,
} from "../../common/commonMethods";
import { getWFMTeamList } from "../../redux/actions/managerActions";
import NominatePopup from "../../components/NominatePopup";
import Toast from "../../components/Toast";
import * as GLOBAL_CONST from "../../common/constants";
import { applyForJob } from "../../redux/actions/jobActions";
import FilterInput from "../../components/FilterInput";
import { fetchRRs } from "../../redux/actions/rrActions";
import { fetchEmployeeProfile } from "../../redux/actions/employeeActions";
import {
  WFM_NOMINATING_RESOURCE_EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
  WFM_UPDATE_RESOURCE_AS_EARMARKED_EMAIL_DATA,
  GLOBAL_RMG_EMAIL_ADDRESS,
  WFM_UPDATE_RESOURCE_STATUS_EMAIL_DATA,
} from "../../common/emailConstants";
import { sendChat, sendEmail } from "../../common/commonMethods";
import { approveCandidateAllocation } from "../../redux/actions/wfmActions";
import EmptyComponent from "../../components/empty/emptyComponent";
import "./index.scss";
import ViewHistory from "../../components/ViewHistory";

const AllAvailableResources = ({
  fetchAction,
  dataSelector,
  viewType,
  wlocation,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rrs = useSelector((state) => state.rr.rrs) || [];
  const employeeProfile =
    useSelector((state) => state.employee.employeeProfile) || [];
  const jobData = useSelector(dataSelector) || [];
  const wfmTeamList = useSelector((state) => state.manager.getWFMTeamList);
  const employeeId = useSelector((state) => state.user.employeeId);
  const [resourceAvailabilityPopup, setResourceAvailabilityPopup] =
    useState(false);
  const [isEarmarkedPopupOpen, setEarmarkedPopupOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [
    isUpdateEmployeeConfirmationPopUpVisible,
    setIsUpdateEmployeeConfirmationPopUpVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedAvailableStatus] = useState("");
  const [selectedWFMSpocName, setSelectedWFMSpocName] = useState("");
  const [effectiveDate, setEffecttiveDate] = useState();
  const [effectiveDateForEarmark, setEffecttiveDateForEarmark] = useState();
  const [allocationPercentage, setAllocationPercentage] = useState(100);
  const [selectedResource, setSelectedResource] = useState();
  const [isNominatePopupOpen, setNominatePopupOpen] = useState(false);
  const [selectedRR, setSelectedRR] = useState(null);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [toasterInfo, setToasterInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const currentPage = useSelector(
    (state) => state?.manager?.availableResourcesCount
  );
  // Initialize sorting state
  const sortColumn = useSelector(
    (state) => state?.manager?.columnAvailableResources
  );
  const sortOrder = useSelector(
    (state) => state?.manager?.sortOrderAvailableResources
  );
  const itemsPerPage = 10;
  const [selectedRRForEarmark, setSelectedRRForEarmark] = useState(null);

  // Apply sorting to the jobData array
  const [sortedJobData, setSortedJobData] = useState([]);
  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  useEffect(() => {
    if (jobData && jobData?.length > 0) {
      setSortedJobData(jobData);
    }
  }, [jobData]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAction(wlocation));
    dispatch(getWFMTeamList());
    setTimeout(() => {
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, wlocation]);

  useEffect(() => {
    if (toasterInfo.show) {
      setTimeout(() => {
        handleCloseToast();
      }, [10000]);
    }
  }, [toasterInfo?.show]);

  useEffect(() => {
    if (selectedRR?.rrId) {
      dispatch(fetchRRs(selectedRR?.rrId, employeeId));
    }
  }, [dispatch, selectedRR?.rrId]);

  useEffect(() => {
    if (userDetail?.employeeId) {
      dispatch(fetchEmployeeProfile(userDetail?.employeeId));
    }
  }, [dispatch, userDetail?.employeeId]);

  useEffect(() => {
    if (selectedRRForEarmark?.rrId) {
      dispatch(fetchRRs(selectedRRForEarmark?.rrId, employeeId));
    }
  }, [dispatch, selectedRRForEarmark?.rrId]);

  const handleCloseToast = () => {
    setToasterInfo({
      show: false,
      type: "",
      message: "",
    });
  };

  const handleOpenNominateConfirmation = () => {
    closehandleNominatePopup();
    setConfirmationPopup(true);
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(false);
    setSelectedRR(null);
    setUserDetail(null);
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortAvailableResources(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortAvailableResources(columnName, "asc"));
    }
  };

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setAvailableResourcesPageCount(page));
  };

  const getWFMEmpId = () => {
    return wfmTeamList?.find(
      (element) =>
        element?.employeeName ===
        (selectedWFMSpocName === "" ? userDetail?.wfmSpoc : selectedWFMSpocName)
    )?.employeeID;
  };

  const handleNomination = async () => {
    try {
      setIsLoading(true);
      const response = await applyForJob(
        userDetail?.employeeId,
        selectedRR?.rrId,
        selectedRR?.rrNumber,
        employeeId
      );
      // dispatch(getAllAvailableResources());
      if (response) {
        setToasterInfo({
          show: true,
          type: GLOBAL_CONST.TOASTER_SUCCESS,
          message: `You have successfully nominated ${
            userDetail?.employeeName
          } for ${`${selectedRR?.rrNumber} - ${selectedRR?.projectName}`}.`,
        });
        const emailManagerBody =
          WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailBody
            ?.replace(
              "<MANAGER_NAME>",
              rrs?.resourceRequestDetails?.requesterName
            )
            ?.replace("<CANDIDATE_NAME>", employeeProfile?.employeeName)
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber);
        const emailManagerSubject =
          WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
            "<RR_NUMBER>",
            rrs?.resourceRequestDetails?.rrNumber
          );
        const toManagerRecipients = [];
        if (
          rrs?.resourceRequestDetails?.requesterMailId !==
          rrs?.resourceRequestDetails?.projectManagerMailID
        ) {
          toManagerRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId,
            rrs?.resourceRequestDetails?.projectManagerMailID
          );
        } else {
          toManagerRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId
          );
        }
        const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(
          emailManagerBody,
          emailManagerSubject,
          toManagerRecipients,
          ccRecipients
        );
        await sendChat(
          emailManagerBody?.replaceAll("<br>", ""),
          rrs?.resourceRequestDetails?.requesterMailId
        );

        const emailEmployeeBody =
          WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_EMPLOYEE?.emailBody
            ?.replace("<CANDIDATE_NAME>", employeeProfile?.employeeName)
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber);
        const emailEmployeeSubject =
          WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_EMPLOYEE?.emailSubject?.replace(
            "<RR_NUMBER>",
            rrs?.resourceRequestDetails?.rrNumber
          );
        const toEmployeeRecipient = [employeeProfile?.emailId];
        await sendEmail(
          emailEmployeeBody,
          emailEmployeeSubject,
          toEmployeeRecipient,
          ccRecipients
        );
        await sendChat(
          emailEmployeeBody?.replaceAll("<br>", ""),
          employeeProfile?.emailId
        );

        setSelectedRR(null);
        closeConfirmationPopup();
      }
    } catch (error) {
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_ERROR,
        message: GLOBAL_CONST.DEFAULT_ERROR_MESSAGE,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResourceAvailabilityStatus = async () => {
    setIsLoading(true);
    const formattedEffectiveDate = getDashSeparatedDate(effectiveDate);

    const requestData = {
      employeeId: userDetail.employeeId,
      availableStatus:
        selectedStatus === "" ? userDetail?.availability : selectedStatus,
      effectiveTill: effectiveDate
        ? formattedEffectiveDate
        : userDetail?.effectiveTill
        ? convertDateFromSlashSeparatedToDashSeparated(
            userDetail?.effectiveTill
          )
        : getDashSeparatedDate(new Date()),
      wfmSpoc:
        selectedWFMSpocName === "" ? userDetail?.wfmSpoc : selectedWFMSpocName,
      wfmEmployeeId: getWFMEmpId() ?? null,
      managerApproveOrWithdrawDate: null,
      releaseReason: "",
      informedEmployee: false,
      wfmSuggestedDate: null,
    };
    try {
      await dispatch(saveResourceAvailability(requestData));
      setIsUpdateEmployeeConfirmationPopUpVisible(false);
      dispatch(getAllAvailableResources());
      if (userDetail?.availability === "Earmarked") {
        const emailManagerBody =
          WFM_UPDATE_RESOURCE_STATUS_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailBody
            ?.replace(
              "<MANAGER_NAME>",
              rrs?.resourceRequestDetails?.requesterName
            )
            ?.replace("<CANDIDATE_NAME>", employeeProfile?.employeeName)
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
            ?.replace(
              "<PROJECT_NAME>",
              rrs?.resourceRequestDetails?.accountName
            );
        const emailManagerSubject =
          WFM_UPDATE_RESOURCE_STATUS_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailSubject
            ?.replace(
              "<PROJECT_NAME>",
              rrs?.resourceRequestDetails?.accountName
            )
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber);

        const toManagerRecipients = [];
        if (
          rrs?.resourceRequestDetails?.requesterMailId !==
          rrs?.resourceRequestDetails?.projectManagerMailID
        ) {
          toManagerRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId,
            rrs?.resourceRequestDetails?.projectManagerMailID
          );
        } else {
          toManagerRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId
          );
        }
        const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(
          emailManagerBody,
          emailManagerSubject,
          toManagerRecipients,
          ccRecipients
        );
        await sendChat(
          emailManagerBody?.replaceAll("<br>", ""),
          rrs?.resourceRequestDetails?.requesterMailId
        );
        const rmgEmailBody = `
        <html>
          <head>
            <style>
              table {
                font-family: Arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <p>Dear Global RMG,</p>
            <p>Please DO NOT allocate ${
              employeeProfile?.employeeName
            } against ${rrs?.resourceRequestDetails?.rrNumber} for ${
          rrs?.resourceRequestDetails?.accountName
        }. We will be sending a revised update.</p>
            <table>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Project Name</th>
                <th>EffectiveDate</th>
              </tr>
              <tr>
                <td>${employeeProfile?.emidsUniqueId}</td>
                <td>${employeeProfile?.employeeName}</td>
                <td>${rrs?.resourceRequestDetails?.accountName}</td>
                <td>${requestData?.effectiveTill?.split("T")[0]}</td>
              </tr>
            </table>           
            <p>Thanking You,</p>
            <p>WFM Team</p>
          </body>
        </html>
      `;

        const rmgEmailSubject =
          WFM_UPDATE_RESOURCE_STATUS_EMAIL_DATA?.WFM_MAIL_BODY_TO_GLOBAL_RMG?.emailSubject
            ?.replace(
              "<PROJECT_NAME>",
              rrs?.resourceRequestDetails?.accountName
            )
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber);

        const toRMG = [GLOBAL_RMG_EMAIL_ADDRESS];
        const rmgCCRecipients = [WFM_TEAM_EMAIL_ADDRESS];

        await sendEmail(rmgEmailBody, rmgEmailSubject, toRMG, rmgCCRecipients);
      }
    } finally {
      setSelectedResource("");
      setEffecttiveDate();
      setSelectedAvailableStatus("");
      setSelectedWFMSpocName("");
      setIsLoading(false);
    }
  };

  const handleEarmarkClick = async () => {
    setIsLoading(true);
    const requestData = {
      employeeId: userDetail?.employeeId,
      rrId: selectedRRForEarmark?.rrId,
      additionalComments: "",
      allocationPercentage: allocationPercentage,
      wfmAllocationStartDate: effectiveDateForEarmark?.toISOString(),
      requesterID: employeeId,
      status: GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked,
      wfmAllocationPercentage: allocationPercentage,
      allocationStartDate: effectiveDateForEarmark?.toISOString(),
    };
    try {
      const response = await approveCandidateAllocation(requestData);
      if (response?.data === 200) {
        setToasterInfo({
          show: true,
          type: GLOBAL_CONST.TOASTER_SUCCESS,
          message: `Earmarking of ${
            userDetail?.employeeName
          } against the ${`${selectedRRForEarmark?.rrNumber} - ${selectedRRForEarmark?.projectName}`}. is successful.`,
        });
        dispatch(getAllAvailableResources());
        const emailManagerBody =
          WFM_UPDATE_RESOURCE_AS_EARMARKED_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailBody
            ?.replace(
              "<MANAGER_NAME>",
              rrs?.resourceRequestDetails?.requesterName
            )
            ?.replace("<CANDIDATE_NAME>", employeeProfile?.employeeName)
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
            ?.replace(
              "<ALLOCATION_DATE>",
              requestData?.allocationStartDate?.split("T")[0]
            )
            ?.replace(
              "<ALLOCATION_PERCENTAGE>",
              requestData?.allocationPercentage
            );
        const emailManagerSubject =
          WFM_UPDATE_RESOURCE_AS_EARMARKED_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailSubject
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
            ?.replace(
              "<PROJECT_NAME>",
              rrs?.resourceRequestDetails?.accountName
            );

        const toManagerRecipients = [];
        if (
          rrs?.resourceRequestDetails?.requesterMailId !==
          rrs?.resourceRequestDetails?.projectManagerMailID
        ) {
          toManagerRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId,
            rrs?.resourceRequestDetails?.projectManagerMailID
          );
        } else {
          toManagerRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId
          );
        }
        const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(
          emailManagerBody,
          emailManagerSubject,
          toManagerRecipients,
          ccRecipients
        );
        await sendChat(
          emailManagerBody?.replaceAll("<br>", ""),
          rrs?.resourceRequestDetails?.requesterMailId
        );

        const rmgEmailBody = `
        <html>
          <head>
            <style>
              table {
                font-family: Arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <p>Dear Global RMG,</p>
            <P>Please allocate ${employeeProfile?.employeeName} against ${
          rrs?.resourceRequestDetails?.rrNumber
        } effective ${requestData?.allocationStartDate?.split("T")[0]} with ${
          requestData?.allocationPercentage
        }% allocation. Details Given below Format</P>
            <table>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Project Name</th>
                <th>Resource Type</th>
                <th>Allocation %</th>
                <th>Assign Date</th>
                <th>RR Number</th>
              </tr>
              <tr>
                <td>${employeeProfile?.emidsUniqueId}</td>
                <td>${employeeProfile?.employeeName}</td>
                <td>${rrs?.resourceRequestDetails?.accountName}</td>
                <td>${"Billable"}</td>
                <td>${requestData?.allocationPercentage}</td>
                <td>${requestData?.allocationStartDate?.split("T")[0]}</td>
                <td>${rrs?.resourceRequestDetails?.rrNumber}</td>
              </tr>
            </table>
            <p>Thanking You,</p>
            <p>WFM Team</p>
          </body>
        </html>
      `;

        const rmgEmailSubject =
          WFM_UPDATE_RESOURCE_AS_EARMARKED_EMAIL_DATA?.WFM_MAIL_BODY_TO_GLOBAL_RMG?.emailSubject
            ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber)
            ?.replace(
              "<PROJECT_NAME>",
              rrs?.resourceRequestDetails?.accountName
            );

        const toRMG = [GLOBAL_RMG_EMAIL_ADDRESS];
        const rmgCCRecipients = [
          WFM_TEAM_EMAIL_ADDRESS,
          ...toManagerRecipients,
        ];

        await sendEmail(rmgEmailBody, rmgEmailSubject, toRMG, rmgCCRecipients);
      }
    } catch (error) {
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_ERROR,
        message: `Earmarking of ${
          userDetail?.employeeName
        } against the ${`${selectedRRForEarmark?.rrNumber} - ${selectedRRForEarmark?.projectName}`} has 
        failed due to ${error?.response?.data?.[0]?.errorMessage}.`,
      });
    } finally {
      setIsLoading(false);
      closEarmakedPopup();
    }
  };

  const handleResourceAvailabilityPopup = (job) => {
    setUserDetail(job);
    setResourceAvailabilityPopup(true);
    dispatch(fetchRRs(job?.rrId, job?.employeeId));
  };

  const handleEarmarkedPopup = (job) => {
    setUserDetail(job);
    setEarmarkedPopupOpen(true);
  };

  const closehandleResourceAvailabilityPopup = () => {
    setResourceAvailabilityPopup(false);
    setSelectedResource("");
    setEffecttiveDate();
    setSelectedAvailableStatus("");
  };

  const handleViewApplication = (job) => {
    navigate(`/view-application-status/${job?.employeeId}`);
  };

  const handleViewHistory = (job) => {
    setUserDetail(job);
    setViewHistory(true);
  };

  const closeViewHistory = () => {
    setViewHistory(false);
    setTimeout(() => {
      setUserDetail(null);
    }, 200);
  };

  const closEarmakedPopup = () => {
    setEarmarkedPopupOpen(false);
    setSelectedResource("");
    setEffecttiveDate();
    setSelectedAvailableStatus("");
    setSelectedWFMSpocName("");
    setEffecttiveDateForEarmark("");
    setSelectedRRForEarmark(null);
    setAllocationPercentage(100);
  };

  const handleNominatePopup = (job) => {
    setUserDetail(job);
    setNominatePopupOpen(true);
  };

  const closehandleNominatePopup = () => {
    setNominatePopupOpen(false);
  };

  const handleConfirmationCancel = () => {
    setIsUpdateEmployeeConfirmationPopUpVisible(false);
    setSelectedResource("");
    setEffecttiveDate();
    setSelectedAvailableStatus("");
  };

  const handleSubmitClick = (selectedResource) => {
    setSelectedResource(selectedResource);
    setResourceAvailabilityPopup(false);
    setIsUpdateEmployeeConfirmationPopUpVisible(true);
  };

  const handleConfirmationSubmit = () => {
    handleResourceAvailabilityStatus();
  };

  const handleFilter = (value, applyOn) => {
    dispatch(setAvailableResourcesPageCount(1));
    dispatch(filterAvailableResource(value, applyOn));
  };

  return (
    <>
      {loading && (
        <span className="loader table-loader">
          <img src={loaderImage} alt="Loading" className="loader-img" />
        </span>
      )}
      {!loading && jobData && jobData?.length === 0 && <EmptyComponent />}
      {!loading && jobData?.length > 0 && (
        <div className="update-talent-table-container">
          {/* Display the data using the appropriate structure based on viewType */}
          {viewType === "list" && (
            <ul className="list-table">
              <li className="list-header">
                <div className="list-flex empname-header-cont">
                  <span
                    className="empname-header"
                    onClick={() => handleSort("employeeName")}
                  >
                    Name
                    {sortColumn === "employeeName" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "employeeName" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"employeeName"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("designation")}>
                    Role
                    {sortColumn === "designation" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "designation" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"designation"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("primarySkills")}>
                    Skills
                    {sortColumn === "primarySkills" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "primarySkills" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"primarySkills"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("experience")}>
                    Overall Experience (Years)
                    {sortColumn === "experience" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "experience" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"experience"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                    slider
                    sliderData={sortedJobData}
                    sliderKey={"experience"}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("workingLocation")}>
                    Location
                    {sortColumn === "workingLocation" &&
                      sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                    {sortColumn === "workingLocation" &&
                      sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"workingLocation"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("availability")}>
                    Availability
                    {sortColumn === "availability" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "availability" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"availability"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("onLaunchPadFrom")}>
                    On LaunchPad From
                    {sortColumn === "onLaunchPadFrom" &&
                      sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                    {sortColumn === "onLaunchPadFrom" &&
                      sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                  </span>
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("aging")}>
                    Aging
                    {sortColumn === "aging" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "aging" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"aging"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                    slider
                    sliderData={sortedJobData}
                    sliderKey={"aging"}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("wfmSpoc")}>
                    WFM SPOC
                    {sortColumn === "wfmSpoc" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "wfmSpoc" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"wfmSpoc"}
                    applySelector={(state) =>
                      state?.manager?.filterAvailableResource
                    }
                  />
                </div>
                <div className="list-flex">
                <span onClick={() => handleSort("availableAllocationPercentage")}>
                  Available Allocation
                  {sortColumn === "availableAllocationPercentage" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "availableAllocationPercentage" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
                  </div>
                <div>Action</div>
              </li>

              {itemsToShow.map((job, index) => {
                const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job.employeeId}.jpeg`;

                return (
                  <SingleResource
                    index={index}
                    job={job}
                    employeeImg={employeeImg}
                    avatar={avatar}
                    handleResourceAvailabilityPopup={
                      handleResourceAvailabilityPopup
                    }
                    handleNominate={handleNominatePopup}
                    handleEarmarkedPopup={handleEarmarkedPopup}
                    handleViewApplication={handleViewApplication}
                    handleViewHistory={handleViewHistory}
                  />
                );
              })}
            </ul>
          )}
          {viewType === "tile" && (
            <div className="tile-table card-wrap available-resources">
              {itemsToShow.map((job) => {
                const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job.employeeId}.jpeg`;

                return (
                  <div key={job.id} className="card">
                    <div className="card-header">
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
                        <h3>{job.designation}</h3>
                      </div>
                    </div>
                    <div className="card-cont">
                      <p>
                        <b>Overall Experience:</b> {job.experience} Years
                      </p>
                      <p>
                        <b>Location:</b> {job.location}
                      </p>
                      <p
                        className="skills tooltip"
                        data-tooltip={`${job.primarySkills},${job.secondarySkills}`}
                      >
                        <b>Skills:</b>
                        {job.primarySkills ? (
                          <span>{job.primarySkills}</span>
                        ) : (
                          ""
                        )}
                        {job.secondarySkills ? (
                          <span>{job.secondarySkills}</span>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                    <div className="card-footer view-profile">
                      <Link
                        className="view-profile"
                        to={`/m-available-resources/${job.employeeId}`}
                      >
                        View profile
                      </Link>
                    </div>
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
          <Popup
            open={resourceAvailabilityPopup}
            closeOnEscape={false}
            closeOnDocumentClick={false}
          >
            <ResourceAvailability
              userDetail={userDetail}
              closehandleResourceAvailabilityPopup={
                closehandleResourceAvailabilityPopup
              }
              resourceAvailabilityPopup={resourceAvailabilityPopup}
              selectedStatus={selectedStatus}
              setSelectedAvailableStatus={setSelectedAvailableStatus}
              selectedWFMSpocName={selectedWFMSpocName}
              setSelectedWFMSpocName={setSelectedWFMSpocName}
              effectiveDate={effectiveDate}
              setEffecttiveDate={setEffecttiveDate}
              handleSubmitClick={handleSubmitClick}
            />
          </Popup>
          <Popup
            open={isEarmarkedPopupOpen}
            closeOnEscape={false}
            closeOnDocumentClick={false}
          >
            <EarmakedPopup
              userDetail={userDetail}
              closEarmakedPopup={closEarmakedPopup}
              isEarmarkedPopupOpen={isEarmarkedPopupOpen}
              selectedStatus={selectedStatus}
              setSelectedAvailableStatus={setSelectedAvailableStatus}
              selectedWFMSpocName={selectedWFMSpocName}
              setSelectedWFMSpocName={setSelectedWFMSpocName}
              effectiveDateForEarmark={effectiveDateForEarmark}
              setEffecttiveDateForEarmark={setEffecttiveDateForEarmark}
              selectedRRForEarmark={selectedRRForEarmark}
              setSelectedRRForEarmark={setSelectedRRForEarmark}
              allocationPercentage={allocationPercentage}
              setAllocationPercentage={setAllocationPercentage}
              handleEarmarkClick={handleEarmarkClick}
            />
          </Popup>
          <Popup
            open={isUpdateEmployeeConfirmationPopUpVisible}
            closeOnEscape={false}
            closeOnDocumentClick={false}
          >
            <UpdateEmployeeConfirmationPopUp
              userDetail={userDetail}
              effectiveDate={effectiveDate}
              selectedStatus={selectedStatus}
              handleConfirmationSubmit={handleConfirmationSubmit}
              handleConfirmationCancel={handleConfirmationCancel}
            />
          </Popup>
          <Popup
            open={isNominatePopupOpen}
            closeOnEscape={false}
            closeOnDocumentClick={false}
          >
            <NominatePopup
              userDetail={userDetail}
              handleClose={closehandleNominatePopup}
              selectedRR={selectedRR}
              setSelectedRR={setSelectedRR}
              handleSubmit={handleOpenNominateConfirmation}
            />
          </Popup>
          <Popup
            open={confirmationPopup}
            onClose={closeConfirmationPopup}
            closeOnDocumentClick={false}
          >
            <div className="modal-overlay">
              <div className="modal-content auto-width max-width-400 pb-15">
                <div>
                  Are you certain about nominating{" "}
                  <span style={{ fontWeight: 600 }}>
                    {userDetail?.employeeName}
                  </span>{" "}
                  for the{" "}
                  <span
                    style={{ fontWeight: 600 }}
                  >{`RR-${selectedRR?.rrNumber}`}</span>
                  ?
                </div>

                <div className="modal-buttons-wrapper">
                  {isLoading && (
                    <span className="loader">
                      <img src={loaderImage} alt="Loading" />
                    </span>
                  )}
                  <button
                    className="modal-button cancel"
                    onClick={closeConfirmationPopup}
                  >
                    Cancel
                  </button>
                  <button className={`modal-button`} onClick={handleNomination}>
                    Yes, Nominate
                  </button>
                </div>
              </div>
            </div>
          </Popup>
          <Popup
            open={viewHistory}
            onClose={closeViewHistory}
            closeOnDocumentClick={false}
          >
            <ViewHistory
              closePopup={closeViewHistory}
              details={userDetail}
              rrHistory={false}
            />
          </Popup>
          {toasterInfo?.show && (
            <Toast
              message={`${toasterInfo?.message}`}
              type={toasterInfo?.type}
              onClose={handleCloseToast}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AllAvailableResources;
