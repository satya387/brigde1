import React, { Fragment, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "../../../components/pagination";
import { EMPLOYEE_IMG_URL_BASE } from "../../../config";
import {
  setLaunchpadPageCount,
  sortLaunchpadPagination,
} from "../../../redux/actions/managerActions";
import Suitability from "../../../components/home/suitability";
import {
  applyForJob,
  fetchApplicatantByRRId,
  fetchJobById,
} from "../../../redux/actions/jobActions";
import Toast from "../../../components/Toast";
import * as CONST from "./constant";
import * as GLOBAL_CONST from "../../../common/constants";
import matchIcon from "../../../resources/thumbs-up-yellow.svg";
import lessMatchIcon from "../../../resources/thumbs-up-grey.svg";
import infoIcon from "../../../resources/info-grey.svg";
import loaderImage from "../../../resources/Loader.svg";
import avatar from "../../../resources/user-icon.svg";
import "../../../components/home/home.scss";
import { fetchRRs } from "../../../redux/actions/rrActions";
import { fetchEmployeeProfile } from "../../../redux/actions/employeeActions";
import "./index.scss";
import { sendChat, sendEmail } from "../../../common/commonMethods";
import {
  WFM_NOMINATING_RESOURCE_EMAIL_DATA, WFM_TEAM_EMAIL_ADDRESS
} from "../../../common/emailConstants";

const ShowMatchingResources = ({ dataSelector, selectedJob, viewType }) => {
  const dispatch = useDispatch();
  const jobData = useSelector(dataSelector) || [];
  const role = useSelector((state) => state.user.role);
  const employeeId = useSelector((state) => state.user.employeeId);
  const rrs = useSelector((state) => state.rr.rrs) || [];
  const employeeProfile = useSelector((state) => state.employee.employeeProfile) || [];

  const [candidateData, setCandidateData] = useState(null);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasterInfo, setToasterInfo] = useState({
    show: false,
    type: "",
    message: "",
  });

  const currentPage = useSelector(
    (state) => state?.manager?.launchpadPageCount
  );

  // Initialize sorting state
  const sortColumn = useSelector(
    (state) => state?.manager?.sortedColumnLaunchpad
  );
  const sortOrder = useSelector((state) => state?.manager?.sortOrderLaunchpad);
  const [sortedJobData, setSortedJobData] = useState([]);

  useEffect(() => {
    if (jobData && jobData?.length > 0) {
      setSortedJobData(jobData);
    }
  }, [jobData]);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortLaunchpadPagination(
          columnName,
          sortOrder === "asc" ? "desc" : "asc"
        )
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortLaunchpadPagination(columnName, "asc"));
    }
  };

  const itemsPerPage = 10;

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  useEffect(() => {
    if (toasterInfo.show) {
      setTimeout(() => {
        handleCloseToast();
      }, [3000]);
    }
  }, [toasterInfo?.show]);

  const handleCloseToast = () => {
    setToasterInfo({
      show: false,
      type: "",
      message: "",
    });
  };

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setLaunchpadPageCount(page));
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(false);
    setCandidateData(null);
  };

  const handleOpenNominateConfirmation = (job) => {
    dispatch(fetchRRs(selectedJob?.rrId,employeeId));
    dispatch(fetchEmployeeProfile(job?.emidsUniqueId));
    setCandidateData(job);
    setConfirmationPopup(true);
  };

  const handleNomination = async () => {
    try {
      setIsLoading(true);

      const response = await applyForJob(
        candidateData?.emidsUniqueId,
        selectedJob?.rrId,
        selectedJob?.rrNumber,
        employeeId
      );
      dispatch(fetchApplicatantByRRId(selectedJob?.rrId));
      dispatch(fetchJobById(employeeId));

      closeConfirmationPopup();
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_SUCCESS,
        message: `You have successfully nominated ${candidateData?.employeeName
          } for ${`${selectedJob?.rrNumber} - ${selectedJob?.project}`}.`,
      });

      const emailManagerBody = WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailBody
        ?.replace("<MANAGER_NAME>", rrs?.resourceRequestDetails?.requesterName)
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
        toManagerRecipients.push(rrs?.resourceRequestDetails?.requesterMailId);
      }
      const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
      await sendEmail(emailManagerBody, emailManagerSubject, toManagerRecipients, ccRecipients);
      await sendChat(
        emailManagerBody?.replaceAll("<br>", ""),
        rrs?.resourceRequestDetails?.requesterMailId,
      );

      const emailEmployeeBody = WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_EMPLOYEE?.emailBody
        ?.replace("<CANDIDATE_NAME>", employeeProfile?.employeeName)
        ?.replace("<RR_NUMBER>", rrs?.resourceRequestDetails?.rrNumber);
      const emailEmployeeSubject =
        WFM_NOMINATING_RESOURCE_EMAIL_DATA?.WFM_MAIL_BODY_TO_EMPLOYEE?.emailSubject?.replace(
          "<RR_NUMBER>",
          rrs?.resourceRequestDetails?.rrNumber
        );
      const toEmployeeRecipient = [employeeProfile?.emailId];
      await sendEmail(emailEmployeeBody, emailEmployeeSubject, toEmployeeRecipient, ccRecipients);
      await sendChat(
        emailEmployeeBody?.replaceAll("<br>", ""),
        employeeProfile?.emailId
      );
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

  return (
    <>
      {jobData.length === 0 && (
        <div>
          <h1>No Matching Talents Found</h1>
        </div>
      )}
      {/* Display the data using the appropriate structure based on viewType */}
      {jobData.length > 0 && viewType === "list" && (
        <ul className="list-table">
          <li className="list-header">
            <div onClick={() => handleSort("employeeName")}>
              Name
              {sortColumn === "employeeName" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "employeeName" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("primarySkills")}>
              Primary Skill
              {sortColumn === "primarySkills" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "primarySkills" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("designation")}>
              Role
              {sortColumn === "designation" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "designation" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("totalExperience")}>
              Overall Experience
              {sortColumn === "totalExperience" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "totalExperience" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div onClick={() => handleSort("workingLocation")}>
              Location
              {sortColumn === "workingLocation" && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "workingLocation" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            <div
              className="suitability suitability-header"
              onClick={() => handleSort("matchPercentage")}
            >
              Match Indicator <Suitability />
              {sortColumn === "   " && sortOrder === "asc" && (
                <span className="sort-arrow-up"></span>
              )}
              {sortColumn === "matchPercentage" && sortOrder === "desc" && (
                <span className="sort-arrow-down"></span>
              )}
            </div>
            {role === GLOBAL_CONST.WFMTeam && <div>Actions</div>}
          </li>

          {itemsToShow.map((job, index) => {
            const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job.employeeId}.jpeg`;

            return (
              <Fragment key={index}>
                <li className="list-data">
                  <div className="tooltip" data-tooltip={job.employeeName}>
                    <Link
                      className="view-profile empname"
                      to={`/m-available-resources/${job.emidsUniqueId}`}
                    >
                      <img
                        className="empimg"
                        src={employeeImg}
                        alt=""
                        onError={(e) => {
                          e.target.src = avatar;
                        }}
                      />
                      {job.employeeName}
                    </Link>
                  </div>
                  <div
                    className="skills tooltip"
                    data-tooltip={`${job.primarySkills},${job.secondarySkills}`}
                  >
                    {job.primarySkills ? <span>{job.primarySkills}</span> : ""}
                    {job.secondarySkills ? (
                      <span>{job.secondarySkills}</span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>{job.designation}</div>
                  <div>{job.totalExperience} Years</div>
                  <div>{job.location}</div>
                  <div className="suitability">
                    {job.matchPercentage < 30 ? (
                      <img src={lessMatchIcon} alt="Suitability" />
                    ) : (
                      <img src={matchIcon} alt="Suitability" />
                    )}
                    {job.matchPercentage}%
                    <img className="tooltip-img" src={infoIcon} alt="" />
                    <div className="suitability-cont"    style={{"min-width": "300px"}}>{job.matchCriteria}</div>
                  </div>
                  {role === GLOBAL_CONST.WFMTeam && (
                    <div>
                      <button
                        className="btn"
                        onClick={() => handleOpenNominateConfirmation(job)}
                      >
                        {CONST.NOMINATE}
                      </button>
                    </div>
                  )}
                </li>
              </Fragment>
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
                    {" "}
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
                    <b>Overall Experience:</b> {job.totalExperience} Years
                  </p>
                  <p>
                    <b>Location:</b> {job.location}{" "}
                  </p>
                  <p
                    className="skills tooltip"
                    data-tooltip={`${job.primarySkills},${job.secondarySkills}`}
                  >
                    <b>Skills:</b>
                    {job.primarySkills ? <span>{job.primarySkills}</span> : ""}
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
        open={confirmationPopup}
        onClose={closeConfirmationPopup}
        closeOnDocumentClick={false}
      >
        <div className="modal-overlay">
          <div className="modal-content auto-width max-width-400 pb-15">
            <div>
              Are you certain about nominating{" "}
              <span style={{ fontWeight: 600 }}>
                {candidateData?.employeeName}
              </span>{" "}
              for{" "}
              <span
                style={{ fontWeight: 600 }}
              >{`${selectedJob?.rrNumber} - ${selectedJob?.project}`}</span>
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
                Submit
              </button>
            </div>
          </div>
        </div>
      </Popup>
      {toasterInfo?.show && (
        <Toast
          message={`${toasterInfo?.message}`}
          type={toasterInfo?.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default ShowMatchingResources;
