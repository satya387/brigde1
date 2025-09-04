/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "../../../components/pagination";
import {
  setApproveTalentReleasePageCount,
  sortReleaseRequest,
} from "../../../redux/actions/wfmActions";
import avatar from "../../../resources/user-icon.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../../config";
import loaderImage from "../../../resources/Loader.svg";
import EmptyComponent from "../../../components/empty/emptyComponent";
import ResourceEmpty from "../../../resources/ResourceEmpty.svg";
import * as GLOBAL_CONST from "../../../common/constants";
import "../../../components/home/home.scss";
import "./index.scss";
import { NO_DATA_RELEASE_PLACEHOLDER } from "./constant";

const TalentReleaseTable = ({
  handleApproveClick,
  fetchAction,
  dataSelector,
}) => {
  const dispatch = useDispatch();
  const releaseRequestData = useSelector(dataSelector) || [];
  const currentPage = useSelector(
    (state) => state?.wfm?.approveTalentReleaseCount
  );

  // Initialize with an empty string for no initial sorting
  const sortColumn = useSelector(
    (state) => state?.wfm?.sortColumnReleaseRequest
  );
  const sortOrder = useSelector((state) => state?.wfm?.sortOrderReleaseRequest);
  const [sortedJobData, setSortedJobData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Apply sorting to the jobData array
  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  useEffect(() => {
    if (releaseRequestData && releaseRequestData?.length > 0) {
      setSortedJobData(releaseRequestData);
    }
  }, [releaseRequestData]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAction());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchAction]);

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setApproveTalentReleasePageCount(page));
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortReleaseRequest(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortReleaseRequest(columnName, "asc"));
    }
  };

  return (
    <div className="talent-relase-table-wrapper">
      {!loading && releaseRequestData?.length > 0 && (
        <>
          <ul className="list-table review-list">
            <li className="list-header">
              <div
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
              </div>
              <div onClick={() => handleSort("projectName")}>
                Current Project
                {sortColumn === "projectName" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "projectName" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div>Skills</div>
              <div onClick={() => handleSort("reportingManagerName")}>
                Project Manager
                {sortColumn === "reportingManagerName" &&
                  sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                {sortColumn === "reportingManagerName" &&
                  sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
              </div>
              <div onClick={() => handleSort("releaseRequestOn")}>
                Release Request On
                {sortColumn === "releaseRequestOn" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "releaseRequestOn" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div onClick={() => handleSort("plannedReleaseDate")}>
                Planned Release Date
                {sortColumn === "plannedReleaseDate" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "plannedReleaseDate" &&
                  sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
              </div>
              <div onClick={() => handleSort("experience")}>
                Experience
                {sortColumn === "experience" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "experience" && sortOrder === "desc" && (
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
              <div>Available Allocation</div> <div>Action</div>
            </li>
            {itemsToShow.map((item, index) => {
              const releaseRequestDate = new Date(item?.releaseRequestOn);
              const plannedReleaseDate = new Date(item?.plannedReleaseDate);
              const options = { month: "short", day: "numeric", year: "numeric" };
              const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${item.employeeId}.jpeg`;

              // Below code Covert the Date like Jan 25
              const formattedReleaseRequestDate =
                releaseRequestDate.toLocaleString(undefined, options);
              const formattedPlannedDate = plannedReleaseDate?.toLocaleString(
                undefined,
                options
              );

              const primarySkills = item.primarySkills
                ? item.primarySkills.split(",")
                : [];
              const secondarySkills = item.secondarySkills
                ? item.secondarySkills.split(",")
                : [];
              return (
                <Fragment key={index}>
                  <li key={index} className="list-data">
                    <div className=" empname tooltip" data-tooltip={`${item?.employeeName}`}>
                      <Link
                        className="list-data-emp-head"
                        to={`/review-appication/${item.employeeId}`}
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
                          <h2 className="emp-name">{item.employeeName}</h2>
                        </span>
                      </Link>
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item?.projectName}`}
                    >
                      {item?.projectName}
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item.primarySkills}, ${item?.secondarySkills}`}
                    >
                      {primarySkills.map((skill, index) => (
                        <span key={index}>{skill.trim()}</span>
                      ))}
                      {secondarySkills.map((skill, index) => (
                        <span key={index}>{skill.trim()}</span>
                      ))}
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item?.reportingManagerName}`}
                    >
                      {item?.reportingManagerName}
                    </div>
                    <div>{formattedReleaseRequestDate}</div>
                    <div>{formattedPlannedDate}</div>
                    <div>{item?.experience}</div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item?.status}`}
                    >
                    {item?.status}
                    </div>
                    <div>
                      {(item?.availableAllocationPercentage != null || item?.availableAllocationPercentage === 100)
                        ? <span>{item?.availableAllocationPercentage}%</span>
                        : <span className="AllocationLessThanHundreds">{item?.availableAllocationPercentage ?? 0}%</span>
                      }
                    </div>
                    <div>
                      {item?.status !==
                        GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM
                          ?.ReleaseRejected && (
                          <button
                            className="btn"
                            onClick={() => handleApproveClick(item)}
                          >
                            Review
                          </button>
                        )}
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
      {loading && releaseRequestData?.length === 0 && (
        <span className="loader table-loader">
          <img src={loaderImage} alt="Loading" className="loader-img" />
        </span>
      )}
      {!loading && releaseRequestData?.length === 0 && (
        <EmptyComponent
          imgSrc={ResourceEmpty}
          message={NO_DATA_RELEASE_PLACEHOLDER}
        />
      )}
    </div>
  );
};

export default TalentReleaseTable;
