import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./../home/home.scss";
import locationIcon from "../../resources/map-icon.svg";
import calIcon from "../../resources/calendar.svg";
import loaderImage from "../../resources/Loader.svg";
import { Link, useNavigate } from "react-router-dom";
import Model from "./model";
import Pagination from "../pagination";
import matchIcon from "../../resources/thumbs-up-yellow.svg";
import lessMatchIcon from "../../resources/thumbs-up-grey.svg";
import infoIcon from "../../resources/info-grey.svg";
import Suitability from "../home/suitability";
import nodataImage from "../../resources/no-data.svg";
import MyJobs from "../../pages/myJobs";
import {
  filterHomeTable,
  setHomePageCount,
  sortByColumn,
} from "../../redux/actions/jobActions";
import "../../pages/myRRs/myRRs.scss";
import * as GLOBAL_CONST from "../../common/constants";
import FilterInput from "../FilterInput";
import ActionDropdown from "../ActionDropdown";
import { ACTION_OPTIONS } from "./const";
import Popup from "reactjs-popup";
import AddViewComment from "../AddViewComment";
import ViewHistory from "../ViewHistory";
import { calculateMinMax } from "../../common/commonMethods";

const PaginatedListView = ({
  employeeId,
  fetchAction,
  dataSelector,
  viewType,
  setCurrentPage,
  fromJob = true,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobData = useSelector(dataSelector) || [];
  const userRole = useSelector((state) => state.user.role);
  const currentPage = useSelector((state) => state?.job?.homePageCount);

  // Initialize with an empty string for initial sorting
  const sortColumn = useSelector((state) => state?.job?.sortedColumn);
  const sortOrder = useSelector((state) => state?.job?.sortOrder);
  const [commentPopup, setCommentPopup] = useState(false);
  const [viewHistoryPopup, setViewHistoryPopup] = useState(false);
  const [rrDetails, setRRDetails] = useState(null);
  const [viewComment, setViewComment] = useState(false);
  const itemsPerPage = 10;

  // Apply sorting to the jobData array
  const [sortedJobData, setSortedJobData] = useState([]);
  const [loading, setLoading] = useState(true);
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
    dispatch(fetchAction(employeeId));
    setTimeout(() => {
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId, fetchAction]);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(sortByColumn(columnName, sortOrder === "asc" ? "desc" : "asc"));
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortByColumn(columnName, "asc"));
    }
  };

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setHomePageCount(page));
  };

  const handleFilter = (value, applyOn) => {
    dispatch(setHomePageCount(1));
    dispatch(filterHomeTable(value, applyOn));
  };

  const handleActions = (label, job) => {
    switch (label) {
      case "View Applicants":
        navigate(`/home/selectedRR/${job?.rrId}`);
        return;
      case "Add Comments":
        setViewComment(false);
        setRRDetails(job);
        setCommentPopup(true);
        return;
      case "View Comments":
        setViewComment(true);
        setRRDetails(job);
        setCommentPopup(true);
        return;
      case "View History":
        setViewHistoryPopup(true);
        setRRDetails(job);
        return;
      default:
        return;
    }
  };

  const closeCommentPopup = () => {
    setCommentPopup(false);
    setViewComment(false);
  };

  const closeHistoryPopup = () => {
    setViewHistoryPopup(false);
    setTimeout(() => {
      setRRDetails(null);
    }, 200);
  };

  if (!jobData.length) {
    return (
      <div className="empty-record">
        <img src={nodataImage} alt="" />
        <p>
          No jobs posted for your role, click below to see other posted jobs
        </p>
        <div className="filter-btn">
          {" "}
          <MyJobs setCurrentPage={setCurrentPage} />
        </div>
      </div>
    );
  }
  if (!jobData) {
    return (
      <div>
        <img src={loaderImage} alt="Loading" />
      </div>
    );
  }

  return (
    <>
      {loading && (
        <span className="loader table-loader">
          <img src={loaderImage} alt="Loading" className="loader-img" />
        </span>
      )}
      {/* Display the data using the appropriate structure based on viewType */}
      {!loading && viewType === "list" && (
        <ul className="list-table">
          {itemsToShow.map((job) => {
            return (
              <>
                <li className="list-header">
                  <div className="list-flex">
                    <span onClick={() => handleSort("rrNumber")}>
                      RR Number
                      {sortColumn === "rrNumber" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "rrNumber" && sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={"rrNumber"}
                      applySelector={(state) => state?.job?.appliedFiltersHome}
                    />
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("projectName")}>
                      Project
                      {sortColumn === "projectName" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "projectName" && sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={fromJob ? "projectName" : "project"}
                      applySelector={(state) => state?.job?.appliedFiltersHome}
                    />
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("jobTitle")}>
                      Role
                      {sortColumn === "jobTitle" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "jobTitle" && sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={"jobTitle"}
                      applySelector={(state) => state?.job?.appliedFiltersHome}
                    />
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("primarySkill")}>
                      Skills
                      {sortColumn === "primarySkill" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "primarySkill" &&
                        sortOrder === "desc" && (
                          <span className="sort-arrow-down"></span>
                        )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={"primarySkill"}
                      applySelector={(state) => state?.job?.appliedFiltersHome}
                    />
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("experience")}>
                      Required Exp. (In Years)
                      {sortColumn === "experience" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "experience" && sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={fromJob ? "experience" : "requiredExperience"}
                      applySelector={(state) => state?.job?.appliedFiltersHome}
                      slider
                      sliderData={sortedJobData}
                      sliderKey={fromJob ? "experience" : "requiredExperience"}
                    />
                  </div>
                  {userRole !== GLOBAL_CONST?.WFMTeam && job?.allocation ? (
                    <div>Project Assignment</div>
                  ) : null}
                  {userRole === GLOBAL_CONST?.WFMTeam && (
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
                          state?.job?.appliedFiltersHome
                        }
                        slider
                        sliderData={sortedJobData}
                        sliderKey={"aging"}
                      />
                    </div>
                  )}
                  <div className="list-flex">
                    <span onClick={() => handleSort("location")}>
                      Location
                      {sortColumn === "location" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "location" && sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={"location"}
                      applySelector={(state) => state?.job?.appliedFiltersHome}
                    />
                  </div>

                  <div className="list-flex">
                    <span onClick={() => handleSort("projectStartDate")}>
                      Posted On
                      {sortColumn === "projectStartDate" &&
                        sortOrder === "asc" && (
                          <span className="sort-arrow-up"></span>
                        )}
                      {sortColumn === "projectStartDate" &&
                        sortOrder === "desc" && (
                          <span className="sort-arrow-down"></span>
                        )}
                    </span>
                  </div>
                  {jobData[0].jobAppliedOn ? (
                    <div className="list-flex">
                      <span onClick={() => handleSort("jobAppliedOn")}>
                        Applied on
                        {sortColumn === "jobAppliedOn" &&
                          sortOrder === "asc" && (
                            <span className="sort-arrow-up"></span>
                          )}
                        {sortColumn === "jobAppliedOn" &&
                          sortOrder === "desc" && (
                            <span className="sort-arrow-down"></span>
                          )}
                      </span>
                      <FilterInput
                        handleFilter={handleFilter}
                        applyOn={""}
                        applySelector={(state) =>
                          state?.job?.appliedFiltersHome
                        }
                      />
                    </div>
                  ) : null}
                  {userRole === GLOBAL_CONST.WFMTeam ? (
                    <div className="list-flex">
                      <span onClick={() => handleSort("employeeAppliedCount")}>
                        # Applicants
                        {sortColumn === "employeeAppliedCount" &&
                          sortOrder === "asc" && (
                            <span className="sort-arrow-up"></span>
                          )}
                        {sortColumn === "employeeAppliedCount" &&
                          sortOrder === "desc" && (
                            <span className="sort-arrow-down"></span>
                          )}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="suitability suitability-header"
                      onClick={() => handleSort("matchPercentage")}
                    >
                      Match Indicator <Suitability />
                      {sortColumn === "matchPercentage" &&
                        sortOrder === "asc" && (
                          <span className="sort-arrow-up"></span>
                        )}
                      {sortColumn === "matchPercentage" &&
                        sortOrder === "desc" && (
                          <span className="sort-arrow-down"></span>
                        )}
                    </div>
                  )}
                  {userRole === GLOBAL_CONST.WFMTeam && (
                    <div className="list-flex">Action</div>
                  )}
                </li>
              </>
            );
          })}
          {itemsToShow.map((job) => {
            const jobModel = new Model(job);
            const formattedDate = jobModel.getFormattedDate();
            const primarySkills = jobModel.getPrimarySkills();
            const secondarySkills = jobModel.getSecondarySkills();
            const aging = jobModel?.getAging();

            return (
              <Fragment key={job.id}>
                <li key={job.id} className="list-data">
                  {userRole === GLOBAL_CONST.EMPLOYEE ? (
                    <div className="tooltip" data-tooltip={job.rrNumber}>
                      <Link className="rr-link" to={`/rrs?id=${job.rrId}`}>
                        {job.rrNumber}
                      </Link>
                    </div>
                  ) : userRole === GLOBAL_CONST.Manager &&
                    window.location.pathname === "/m-myrrs" ? (
                    <div className="tooltip" data-tooltip={job.rrNumber}>
                      <Link
                        className="rr-link"
                        to={`/managermyrrs?id=${job.rrId}`}
                      >
                        {job.rrNumber}
                      </Link>
                    </div>
                  ) : (
                    <div className="tooltip" data-tooltip={job.rrNumber}>
                      <Link
                        className="rr-link"
                        to={`/managerrrs?id=${job.rrId}`}
                      >
                        {job.rrNumber}
                      </Link>
                    </div>
                  )}

                  <div
                    className="tooltip"
                    data-tooltip={job.projectName || job.project}
                  >
                    {job.projectName || job.project}
                  </div>
                  <div className="tooltip" data-tooltip={`${job.jobTitle}`}>
                    {job.jobTitle}
                  </div>
                  <div
                    className="tooltip"
                    data-tooltip={`${job.primarySkill}, ${
                      job.secondarySkill || "N/A"
                    }`}
                  >
                    {`${job.primarySkill}, ${job.secondarySkill || "N/A"}`}
                  </div>
                  <div>{job.experience || job.requiredExperience}</div>
                  {userRole === GLOBAL_CONST?.WFMTeam && (
                    <div style={{ paddingLeft: 0 }}>
                      {aging ? `${aging} days` : "N/A"}
                    </div>
                  )}
                  {userRole !== GLOBAL_CONST?.WFMTeam &&
                    job?.allocation >= 0 && <div>{job?.allocation} %</div>}
                  <div>{job?.location}</div>
                  <div>{formattedDate}</div>
                  {userRole === GLOBAL_CONST?.WFMTeam ? (
                    <div>{job?.employeeAppliedCount}</div>
                  ) : (
                    <div className="suitability">
                      {job.matchPercentage < 30 ? (
                        <img src={lessMatchIcon} alt="Suitability" />
                      ) : (
                        <img src={matchIcon} alt="Suitability" />
                      )}
                      {job.matchPercentage}%
                      <img className="tooltip-img" src={infoIcon} alt="" />
                      {job?.matchPercentage !== 0 && (
                        <div
                          className="suitability-cont"
                          style={{ "min-width": "300px" }}
                        >
                          {job.matchCriteria}
                        </div>
                      )}
                    </div>
                  )}
                  {userRole === GLOBAL_CONST.WFMTeam && (
                    <ActionDropdown
                      uniqueId={job?.rrId}
                      dropDownOptions={ACTION_OPTIONS}
                      handleClick={(label) => handleActions(label, job)}
                      show={false}
                      addedClassName="no-padding"
                    />
                  )}
                </li>
              </Fragment>
            );
          })}
        </ul>
      )}
      {!loading && viewType === "tile" && (
        <div className="tile-table card-wrap">
          {itemsToShow.map((job) => {
            const jobModel = new Model(job);
            const formattedDate = jobModel.getFormattedDate();
            const firstTwoLetters = jobModel.getFirstTwoLetters();
            const primarySkills = jobModel.getPrimarySkills();
            const secondarySkills = jobModel.getSecondarySkills();

            return (
              <div key={job.id} className="card">
                <div className="card-header">
                  <div>
                    <span className="proj-logo">{firstTwoLetters}</span>
                  </div>
                  <div>
                    <h2>{job.projectName || job.project}</h2>
                    {userRole === GLOBAL_CONST.EMPLOYEE ? (
                      <h3>
                        <b>RR:</b>{" "}
                        <Link className="rr-link" to={`/rrs?id=${job.rrId}`}>
                          {job.rrNumber}
                        </Link>
                      </h3>
                    ) : userRole === GLOBAL_CONST.Manager &&
                      window.location.pathname === "/m-myrrs" ? (
                      <h3>
                        <b>RR:</b>{" "}
                        <Link
                          className="rr-link"
                          to={`/managermyrrs?id=${job.rrId}`}
                        >
                          {job.rrNumber}
                        </Link>
                      </h3>
                    ) : (
                      <h3>
                        <b>RR:</b>{" "}
                        <Link
                          className="rr-link"
                          to={`/managerrrs?id=${job.rrId}`}
                        >
                          {job.rrNumber}
                        </Link>
                      </h3>
                    )}
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
                    data-tooltip={`${job.secondarySkill}, ${job.primarySkill}`}
                  >
                    <b>Skills:</b>
                    {primarySkills.map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                    {secondarySkills.map((skill, index) => (
                      <span key={index}>{skill.trim()}</span>
                    ))}
                  </p>
                  {userRole === GLOBAL_CONST.WFMTeam ? (
                    <p>
                      <b># Applicants:</b>
                      {job?.employeeAppliedCount}
                    </p>
                  ) : (
                    <div className="suitability">
                      {job.matchPercentage < 30 ? (
                        <img src={lessMatchIcon} alt="Suitability" />
                      ) : (
                        <img src={matchIcon} alt="Suitability" />
                      )}
                      {job.matchPercentage}%
                      <img className="tooltip-img" src={infoIcon} alt="" />
                      <div
                        className="suitability-cont"
                        style={{ "min-width": "300px" }}
                      >
                        {job.matchCriteria}
                      </div>
                    </div>
                  )}
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
      )}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
      <Popup
        open={commentPopup}
        onClose={closeCommentPopup}
        closeOnDocumentClick={false}
      >
        <AddViewComment
          rrDetails={rrDetails}
          onClose={closeCommentPopup}
          view={viewComment}
        />
      </Popup>

      <Popup
        open={viewHistoryPopup}
        onClose={closeHistoryPopup}
        closeOnDocumentClick={false}
      >
        <ViewHistory
          closePopup={closeHistoryPopup}
          details={rrDetails}
          rrHistory={true}
        />
      </Popup>
    </>
  );
};

export default PaginatedListView;
