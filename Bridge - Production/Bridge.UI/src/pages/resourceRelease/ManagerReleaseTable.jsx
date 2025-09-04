/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import {
  filterManagerRelease,
  setManagerReleasePageCount,
  sortManagerRelease,
} from "../../redux/actions/managerActions";
import Pagination from "../../components/pagination";
import FilterInput from "../../components/FilterInput";
import ActionDropdown from "../../components/ActionDropdown";
import * as GLOBAL_CONST from "../../common/constants";
import * as CONST from "./constant";
import avatar from "../../resources/user-icon.svg";
import loaderImage from "../../resources/Loader.svg";
import "../../components/home/home.scss";
import "./index.scss";
import EmptyComponent from "../../components/empty/emptyComponent";

const ManagerReleaseTable = ({ handleActions, loading }) => {
  const dispatch = useDispatch();
  const managerResources =
    useSelector((state) => state.manager.managerResources) || [];
  const currentPage = useSelector(
    (state) => state?.manager?.managerReleaseCount
  );

  // Initialize with an empty string for no initial sorting
  const sortColumn = useSelector(
    (state) => state?.manager?.columnManagerRelease
  );
  const sortOrder = useSelector((state) => state?.manager?.sortManagerRelease);
  const [sortedJobData, setSortedJobData] = useState([]);
  const itemsPerPage = 10;

  // Apply sorting to the jobData array
  const totalPages = Math.ceil(sortedJobData.length / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to display for the current page
  const itemsToShow = sortedJobData.slice(startIndex, endIndex);

  useEffect(() => {
    if (managerResources && managerResources?.length > 0) {
      setSortedJobData(managerResources);
    }
  }, [managerResources]);

  // Handle page changes
  const handlePageChange = (page) => {
    // setCurrentPage(page);
    dispatch(setManagerReleasePageCount(page));
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortManagerRelease(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortManagerRelease(columnName, "asc"));
    }
  };

  const handleFilter = (value, applyOn) => {
    dispatch(setManagerReleasePageCount(1));
    dispatch(filterManagerRelease(value, applyOn));
  };

  const getDropDownOptions = (item) => {
    if (item?.status === GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.Active) {
      return CONST.ACTIVE_OPTIONS;
    } else if (
      item?.status === GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested
    ) {
      return CONST.RELEASE_REQUESTED_OPTIONS;
    } else {
      return CONST.RELEASED_OPTION;
    }
  };

  return (
    <>
      {loading && (
        <span className="loader table-loader">
          <img src={loaderImage} alt="Loading" className="loader-img" />
        </span>
      )}
      {!loading && managerResources && managerResources?.length === 0 && (
        <EmptyComponent />
      )}
      {!loading && managerResources?.length > 0 && (
        <div className="manager-release-table-container">
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
                    state?.manager?.filterManagerRelease
                  }
                />
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("role")}>
                  Role
                  {sortColumn === "role" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "role" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </span>
                <FilterInput
                  handleFilter={handleFilter}
                  applyOn={"role"}
                  applySelector={(state) =>
                    state?.manager?.filterManagerRelease
                  }
                />
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("experienceYears")}>
                  Experience (Years)
                  {sortColumn === "experienceYears" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "experienceYears" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </span>
                <FilterInput
                  handleFilter={handleFilter}
                  applyOn={"experienceYears"}
                  applySelector={(state) =>
                    state?.manager?.filterManagerRelease
                  }
                />
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("projectName")}>
                  Project Name
                  {sortColumn === "projectName" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "projectName" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </span>
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("experienceInProject")}>
                  Experience in Emids
                  {sortColumn === "experienceInProject" &&
                    sortOrder === "asc" && (
                      <span className="sort-arrow-up"></span>
                    )}
                  {sortColumn === "experienceInProject" &&
                    sortOrder === "desc" && (
                      <span className="sort-arrow-down"></span>
                    )}
                </span>
                <FilterInput
                  handleFilter={handleFilter}
                  applyOn={"experienceInProject"}
                  applySelector={(state) =>
                    state?.manager?.filterManagerRelease
                  }
                />
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("allocatedOn")}>
                  Allocated On
                  {sortColumn === "allocatedOn" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "allocatedOn" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </span>
                <FilterInput
                  handleFilter={handleFilter}
                  applyOn={"allocatedOn"}
                  applySelector={(state) =>
                    state?.manager?.filterManagerRelease
                  }
                />
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("status")}>
                  Status
                  {sortColumn === "status" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "status" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </span>
                <FilterInput
                  handleFilter={handleFilter}
                  applyOn={"status"}
                  applySelector={(state) =>
                    state?.manager?.filterManagerRelease
                  }
                />
              </div>
              <div className="list-flex">
                <span onClick={() => handleSort("billingStatus")}>
                  Billing
                  {sortColumn === "billingStatus" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "billingStatus" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </span>
              </div>
              <div className="list-flex">Action</div>
            </li>
            {itemsToShow.map((item, index) => {
              const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${item?.employeeId}.jpeg`;
              return (
                <Fragment key={index}>
                  <li key={index} className="list-data">
                    <div className="empname">
                      <Link
                        className="list-data-emp-head"
                        to={`/m-available-resources/${item.employeeId}`}
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
                    {/* <div>{item?.employeeId}</div> */}
                    <div className="tooltip" data-tooltip={`${item?.role}`}>
                      {item?.role}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      {item?.experienceYears}
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item?.projectName}`}
                    >
                      {item?.projectName}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      {item?.experienceInProject}
                    </div>
                    <div>{item?.allocatedOn}</div>
                    <div class="availablity-status">
                      <span class="availablity-text">{item?.status}</span>
                      <span class="availablity-sub-text">
                        {item?.wfmSuggestedDate || item?.managerApproveOrWithdrawDate}
                      </span>
                    </div>
                    <div>{item?.billingStatus}</div>
                    <ActionDropdown
                      uniqueId={item?.employeeId}
                      dropDownOptions={getDropDownOptions(item)}
                      handleClick={(label) => handleActions(label, item)}
                      show={
                        item?.status ===
                        GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.WithdrawRequested
                      }
                    />
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
        </div>
      )}
    </>
  );
};

export default ManagerReleaseTable;
