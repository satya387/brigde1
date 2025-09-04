import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../components/home/home.scss";
import loaderImage from "../../resources/Loader.svg";
import { Link } from "react-router-dom";
import avatar from "../../resources/user-icon.svg";
import Pagination from "../../components/pagination";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import {
  filterFutureEmp,
  setFutureAvailableResourcesPageCount,
  sortFutureResources,
} from "../../redux/actions/managerActions";
import FilterInput from "../../components/FilterInput";
import EmptyComponent from "../../components/empty/emptyComponent";

const FutureAvailableResources = ({
  fetchAction,
  dataSelector,
  viewType,
  wlocation,
}) => {
  const dispatch = useDispatch();
  const jobData = useSelector(dataSelector) || [];
  // const [currentPage, setCurrentPage] = useState(1);
  const currentPage = useSelector(
    (state) => state?.manager?.futureAvailableResourceCount
  );
  // Initialize sorting state
  const sortColumn = useSelector(
    (state) => state?.manager?.columnFutureResources
  );
  const sortOrder = useSelector(
    (state) => state?.manager?.sortOrderFutureResources
  );
  const [sortedJobData, setSortedJobData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobData && jobData?.length > 0) {
      setSortedJobData(jobData);
    }
  }, [jobData]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAction(wlocation));
    setTimeout(() => {
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, wlocation]);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortFutureResources(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortFutureResources(columnName, "asc"));
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setFutureAvailableResourcesPageCount(page));
  };

  const handleFilter = (value, applyOn) => {
    dispatch(setFutureAvailableResourcesPageCount(1));
    dispatch(filterFutureEmp(value, applyOn));
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
        <>
          {/* Display the data using the appropriate structure based on viewType */}
          {viewType === "list" && (
            <ul className="list-table">
              <li className="list-header">
                <div className="list-flex">
                  <span onClick={() => handleSort("employeeName")}>
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
                    applySelector={(state) => state?.manager?.filterFutureEmp}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("projectName")}>
                    Current Project
                    {sortColumn === "projectName" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "projectName" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"projectName"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("availableOn")}>
                    Available From
                    {sortColumn === "availableOn" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "availableOn" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>
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
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"primarySkills"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
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
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"designation"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("experience")}>
                    Experience (In Years)
                    {sortColumn === "experience" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "experience" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"experience"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
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
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"workingLocation"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("wfmspoc")}>
                    WFM SPOC
                    {sortColumn === "wfmspoc" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "wfmspoc" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"wfmspoc"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("reportingManagerName")}>
                    Current PM
                    {sortColumn === "reportingManagerName" &&
                      sortOrder === "asc" && (
                        <span className="sort-arrow-up"></span>
                      )}
                    {sortColumn === "reportingManagerName" &&
                      sortOrder === "desc" && (
                        <span className="sort-arrow-down"></span>
                      )}
                  </span>{" "}
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"reportingManagerName"}
                    applySelector={(state) => state?.manager?.filterFutureEmp}
                  />
                </div>
                <div className="list-flex">
                  <span onClick={() => handleSort("releaseStatus")}>
                   Release Status
                    {sortColumn === "releaseStatus" && sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                    {sortColumn === "releaseStatus" && sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                  </span>{" "}
                </div>
              </li>

              {itemsToShow.map((job, index) => {
                const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job.employeeId}.jpeg`;

                return (
                  <Fragment key={index}>
                    <li className="list-data">
                      <div className="tooltip" data-tooltip={job.employeeName}>
                        <Link
                          className="view-profile empname"
                          to={`/m-available-resources/${job.employeeId}`}
                        >
                          <img
                            className="empimg"
                            src={employeeImg}
                            alt=""
                            onError={(e) => {
                              e.target.src = avatar;
                            }}
                          />
                          {job?.employeeName}
                        </Link>
                      </div>
                      <div>{job?.projectName}</div>
                      <div>{job?.availableOn}</div>
                      <div
                        className="skills tooltip"
                        data-tooltip={`${job?.primarySkills},${job.secondarySkills}`}
                      >
                        {job?.primarySkills ? (
                          <span>{job?.primarySkills}</span>
                        ) : (
                          ""
                        )}
                        {job?.secondarySkills ? (
                          <span>{job?.secondarySkills}</span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>{job?.designation}</div>
                      <div>{job?.experience}</div>
                      <div>{job?.workingLocation}</div>
                      <div>{job?.wfmspoc}</div>
                      <div>{job?.reportingManagerName}</div>
                      <div>{job?.releaseStatus}</div>
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
                        <b>Overall Experience:</b> {job.experience} Years
                      </p>
                      <p>
                        <b>Location:</b> {job.location}{" "}
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
        </>
      )}
    </>
  );
};

export default FutureAvailableResources;
