import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import loaderImage from "../../../resources/Loader.svg";
import Pagination from "../../../components/pagination";
import {
  setApproveTalentAllocationPageCount,
  sortAllocationRequest,
} from "../../../redux/actions/wfmActions";
import EmptyComponent from "../../../components/empty/emptyComponent";
import PeopleEmpty from "../../../resources/PeopleGroup.svg";
import "../../../components/home/home.scss";
import "./index.scss";
import { NO_DATA_PLACEHOLDER } from "./ApproveTalentPopup/constant";
import { getAging } from "../../../common/commonMethods";

const ApproveTalentTable = ({
  handleApproveClick,
  fetchAction,
  dataSelector,
}) => {
  const dispatch = useDispatch();
  const allocationData = useSelector(dataSelector) || [];
  const [loading, setLoading] = useState(false);

  const currentPage = useSelector(
    (state) => state?.wfm?.approveTalentAllocationCount
  );

  // Initialize with an empty string for no initial sorting
  const sortColumn = useSelector(
    (state) => state?.wfm?.sortColumnAllocationRequest
  );
  const sortOrder = useSelector(
    (state) => state?.wfm?.sortOrderAllocationRequest
  );
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
    if (allocationData && allocationData?.length > 0) {
      setSortedJobData(allocationData);
    }
  }, [allocationData]);

  useEffect(() => {
    // Not calling API if already had data in store.
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
    dispatch(setApproveTalentAllocationPageCount(page));
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      // Toggle sorting order if the same column is clicked again
      dispatch(
        sortAllocationRequest(columnName, sortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      // Set the new column to sort by and default to ascending order
      dispatch(sortAllocationRequest(columnName, "asc"));
    }
  };

  return (
    <div className="talent-approve-table-wrapper">
      {!loading && allocationData?.length > 0 && (
        <>
          <ul className="list-table">
            <li className="list-header">
              <div onClick={() => handleSort("rrNumber")}>
                RR
                {sortColumn === "rrNumber" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "rrNumber" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div onClick={() => handleSort("requesterName")}>
                Requesting PM
                {sortColumn === "requesterName" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "requesterName" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div onClick={() => handleSort("candidate")}>
                Candidate
                {sortColumn === "candidate" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "candidate" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div>Skills</div>
              <div onClick={() => handleSort("location")}>
                Location
                {sortColumn === "location" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "location" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div onClick={() => handleSort("allocationStartDate")}>
                Allocation Date
                {sortColumn === "allocationStartDate" &&
                  sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                {sortColumn === "allocationStartDate" &&
                  sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
              </div>
              <div onClick={() => handleSort("allocationPercentage")}>
                % Allocation
                {sortColumn === "allocationPercentage" &&
                  sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                {sortColumn === "allocationPercentage" &&
                  sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
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
              <div onClick={() => handleSort("wfmSpoc")}>
                WFM SPOC
                {sortColumn === "wfmSpoc" && sortOrder === "asc" && (
                  <span className="sort-arrow-up"></span>
                )}
                {sortColumn === "wfmSpoc" && sortOrder === "desc" && (
                  <span className="sort-arrow-down"></span>
                )}
              </div>
              <div>Action</div>
            </li>
            {itemsToShow?.map((item, index) => {
              const allocationStartDate = new Date(item?.allocationStartDate);
              const options = { month: "short", day: "numeric" };
              const formattedAllocationDate =
                allocationStartDate.toLocaleString(undefined, options);
              const primarySkills = item.primarySkill
                ? item.primarySkill.split(",")
                : [];
              const secondarySkills = item.secondarySkill
                ? item.secondarySkill.split(",")
                : [];
              return (
                <Fragment key={index}>
                  <li key={index} className="list-data">
                    <div>
                      <Link
                        className="rr-link"
                        to={`/rrs?id=${item?.rrId}&allocation=${true}`}
                      >
                        {item?.rrNumber}
                      </Link>
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item?.requesterName}`}
                    >
                      {item?.requesterName}
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item?.employeeName}`}
                    >
                      {item?.employeeName}
                    </div>
                    <div
                      className="tooltip"
                      data-tooltip={`${item.primarySkill}, ${item?.secondarySkill}`}
                    >
                      {`${item.primarySkill}, ${item?.secondarySkill}`}
                    </div>
                    <div>{item?.cityName}</div>
                    <div>{formattedAllocationDate}</div>
                    <div>{`${item?.allocationPercentage}%`}</div>
                    <div>{`${getAging(item)} days`}</div>
                    <div>{item?.wfmSpoc}</div>
                    <div>
                      <button
                        className="btn"
                        onClick={() => handleApproveClick(item)}
                      >
                        Review
                      </button>
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
      {loading && allocationData?.length === 0 && (
        <span className="loader table-loader">
          <img src={loaderImage} alt="Loading" className="loader-img" />
        </span>
      )}
      {!loading && allocationData?.length === 0 && (
        <EmptyComponent imgSrc={PeopleEmpty} message={NO_DATA_PLACEHOLDER} />
      )}
    </div>
  );
};

export default ApproveTalentTable;
