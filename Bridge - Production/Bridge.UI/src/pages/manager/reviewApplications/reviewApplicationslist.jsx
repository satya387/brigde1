import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../../components/home/home.scss";
import locationIcon from "../../../resources/map-icon.svg";
import calIcon from "../../../resources/calendar.svg";
import loadingImage from "../../../resources/Loading.png";
import loaderImage from "../../../resources/Loader.svg";
import { Link } from "react-router-dom";
import Model from "./model";
import Pagination from "../../../components/pagination";
import EmptyComponent from "../../../components/empty/emptyComponent";
import {
  filterReviewApplication,
  setManagerReviewPageCount,
  sortReviewApplication,
} from "../../../redux/actions/managerActions";
import FilterInput from "../../../components/FilterInput";

const PaginatedReviewApplication = ({
  fetchAction,
  dataSelector,
  viewType,
  managerId,
}) => {
  const dispatch = useDispatch();
  const jobData = useSelector(dataSelector) || [];
  const isLoading = useSelector((state) => state.job.loading);
  //   const [currentPage, setCurrentPage] = useState(1);
  const currentPage = useSelector(
    (state) => state?.manager?.managerReviewCount
  );
  // Initialize sorting state
  const sortColumn = useSelector(
    (state) => state?.manager?.columnReviewApplication
  );
  const sortOrder = useSelector(
    (state) => state?.manager?.sortOrderReviewApplication
  );
  const [sortedJobData, setSortedJobData] = useState([]);

  useEffect(() => {
    dispatch(fetchAction(managerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchAction, managerId]);

  useEffect(() => {
    if (jobData && jobData?.length > 0) {
      setSortedJobData(jobData);
    }
  }, [jobData]);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortReviewApplication(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortReviewApplication(columnName, "asc"));
    }
  };

  const itemsPerPage = 10;
  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Sort the jobData array based on the selected column and order
  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setManagerReviewPageCount(page));
  };

  const handleFilter = (value, applyOn) => {
    dispatch(setManagerReviewPageCount(1));
    dispatch(filterReviewApplication(value, applyOn));
  };

  if (!jobData.length) {
    return <EmptyComponent />;
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
      {/* Display the data using the appropriate structure based on viewType */}
      {viewType === "list" && (
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
                      applySelector={(state) =>
                        state?.manager?.filtersReviewApplication
                      }
                    />
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("project")}>
                      Project
                      {sortColumn === "project" && sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                      {sortColumn === "project" && sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={"project"}
                      applySelector={(state) =>
                        state?.manager?.filtersReviewApplication
                      }
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
                      applySelector={(state) =>
                        state?.manager?.filtersReviewApplication
                      }
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
                      applySelector={(state) =>
                        state?.manager?.filtersReviewApplication
                      }
                    />
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("requiredExperience")}>
                      Required Exp. (Years)
                      {sortColumn === "requiredExperience" &&
                        sortOrder === "asc" && (
                          <span className="sort-arrow-up"></span>
                        )}
                      {sortColumn === "requiredExperience" &&
                        sortOrder === "desc" && (
                          <span className="sort-arrow-down"></span>
                        )}
                    </span>
                    <FilterInput
                      handleFilter={handleFilter}
                      applyOn={"requiredExperience"}
                      applySelector={(state) =>
                        state?.manager?.filtersReviewApplication
                      }
                      slider
                      sliderData={jobData}
                      sliderKey={"requiredExperience"}
                    />
                  </div>
                  {job.allocation ? <div>Project Assignment</div> : null}
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
                  </div>
                  <div className="list-flex">
                    <span onClick={() => handleSort("projectStartDate")}>
                      Posted
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
                  </div>
                  {job.jobAppliedOn ? <div>Applied on</div> : null}
                  <div className="list-flex">
                    <span onClick={() => handleSort("applicantsCount")}>
                      Applicants
                      {sortColumn === "applicantsCount" &&
                        sortOrder === "asc" && (
                          <span className="sort-arrow-up"></span>
                        )}
                      {sortColumn === "applicantsCount" &&
                        sortOrder === "desc" && (
                          <span className="sort-arrow-down"></span>
                        )}
                    </span>
                  </div>
                </li>
              </>
            );
          })}
          {itemsToShow.map((job) => {
            const jobModel = new Model(job);
            const formattedDate = jobModel.getFormattedMMDDYYYDate();
            const primarySkills = jobModel.getPrimarySkills();
            const secondarySkills = jobModel.getSecondarySkills();
            const aging = jobModel?.getAging();

            return (
              <Fragment key={job.id}>
                <li key={job.rrId} className="list-data">
                  <div>
                    <Link to={`/m-reviewapplications/selectedRR/${job.rrId}`}>
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
                  <div>{job.experience || job.requiredExperience}</div>
                  {job.allocation ? <div>{job.allocation} %</div> : null}
                  <div>{job.location}</div>
                  <div>{formattedDate}</div>
                  <div style={{ paddingLeft: 0 }}>
                    {aging ? `${aging} days` : "N/A"}
                  </div>
                  <div>{job.applicantsCount}</div>
                </li>
              </Fragment>
            );
          })}
        </ul>
      )}
      {viewType === "tile" && (
        <div className="tile-table card-wrap">
          {itemsToShow.map((job) => {
            const startDate = new Date(job.startDate || job.projectStartDate);
            const options = {year: "numeric", month: "short", day: "numeric" };
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
                      <Link to={`/m-reviewapplications/selectedRR/${job.rrId}`}>
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
                  <p>
                    <b>Applicants:</b>
                    {job.applicantsCount}
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
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default PaginatedReviewApplication;
