import React, { Fragment, useEffect, useState } from "react";
import "../index.scss";
import loaderImage from "../../../resources/Loader.svg";
import PeopleEmpty from "../../../resources/PeopleGroup.svg";
import EmptyComponent from "../../../components/empty/emptyComponent";
import { NO_DATA } from "../const";
import * as GLOBAL_CONST from "../../../common/constants";
import { Link } from "react-router-dom";
import matchIcon from "../../../resources/thumbs-up-yellow.svg";
import lessMatchIcon from "../../../resources/thumbs-up-grey.svg";
import infoIcon from "../../../resources/info-grey.svg";
import { useDispatch } from "react-redux";
import notepadIcon from "../../../resources/notepadIcon.svg";
import Pagination from "../../../components/pagination";
import Popup from "reactjs-popup";
import ViewManagerComments from "../../../components/ViewManagerComments";

const EmployeeRRTable = ({ data, setData }) => {
  const dispatch = useDispatch();
  const [rrData, setRRData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("rrNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [empData, setEmpData] = useState(null);
  const [rejectionCommentPopup, setRejectionCommentPopup] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    if (data && data?.length) {
      setRRData(data);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  const sortByColumnAppliedJob = (columnNameAppliedJob, sortOrderApplied) => {
    const resData = [
      ...data?.sort((a, b) => {
        if (columnNameAppliedJob) {
          const aValue = String(
            a[columnNameAppliedJob] ||
              a["project"] ||
              a["projectStartDate"] ||
              ""
          );
          const bValue = String(
            b[columnNameAppliedJob] ||
              b["project"] ||
              b["projectStartDate"] ||
              ""
          );
          if (sortOrderApplied === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
        return 0;
      }),
    ];
    setData(resData);
    setSortColumn(columnNameAppliedJob);
    setSortOrder(sortOrderApplied);
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      sortByColumnAppliedJob(columnName, sortOrder === "asc" ? "desc" : "asc");
    } else {
      sortByColumnAppliedJob(columnName, "asc");
    }
  };

  return (
    <>
      <div className="employee-rr-table-wrapper">
        {loading && rrData?.length === 0 && (
          <span className="loader table-loader">
            <img src={loaderImage} alt="Loading" className="loader-img" />
          </span>
        )}
        {!loading && rrData?.length === 0 && (
          <EmptyComponent imgSrc={PeopleEmpty} message={NO_DATA} />
        )}
        {!loading && rrData?.length ? (
          <>
            <ul className="list-table">
              <li className="list-header">
                <div onClick={() => handleSort("rrNumber")}>
                  RR Number
                  {sortColumn === "rrNumber" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "rrNumber" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div onClick={() => handleSort("project")}>
                  Project Name
                  {sortColumn === "project" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "project" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div onClick={() => handleSort("jobTitle")}>
                  Role
                  {sortColumn === "jobTitle" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "jobTitle" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div>Skills</div>
                <div onClick={() => handleSort("jobAppliedOn")}>
                  Applied On
                  {sortColumn === "jobAppliedOn" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "jobAppliedOn" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div onClick={() => handleSort("status")}>
                  Current Status
                  {sortColumn === "status" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "status" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div onClick={() => handleSort("matchPercentage")}>
                  Match Indicator
                  {sortColumn === "matchPercentage" && sortOrder === "asc" && (
                    <span className="sort-arrow-up"></span>
                  )}
                  {sortColumn === "matchPercentage" && sortOrder === "desc" && (
                    <span className="sort-arrow-down"></span>
                  )}
                </div>
                <div>                Available Allocation               
                </div>
              </li>
              {rrData?.map((item, index) => {
                const appliedOn = new Date(item?.jobAppliedOn);
                const options = { month: "short", day: "numeric" };
                const formattedAppliedDate = appliedOn.toLocaleString(
                  undefined,
                  options
                );
           
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
                        data-tooltip={`${item?.project}`}
                      >
                        {item?.project}
                      </div>
                      <div
                        className="tooltip"
                        data-tooltip={`${item?.jobTitle}`}
                      >
                        {item?.jobTitle}
                      </div>
                      <div
                        className="tooltip"
                        data-tooltip={`${item.primarySkill}, ${item?.secondarySkill}`}
                      >
                        {`${item.primarySkill}, ${item?.secondarySkill}`}
                      </div>
                      <div>{formattedAppliedDate}</div>
                      <div style={{ display: "flex" }}>
                        {item?.status}
                        {(item?.status ===
                          GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM?.Declined ||
                          item?.status ===
                            GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM?.Dropped) && (
                          <span
                            className="notepad-icon-container"
                            onClick={() => handleOpenRejectionComments(item)}
                          >
                            <img
                              className="notepad-icon"
                              src={notepadIcon}
                              alt="View Comments"
                            />
                          </span>
                        )}
                      </div>
                      <div className="suitability">
                        {item?.matchPercentage < 30 ? (
                          <img src={lessMatchIcon} alt="Suitability" />
                        ) : (
                          <img src={matchIcon} alt="Suitability" />
                        )}
                        {item?.matchPercentage}%
                        <img className="tooltip-img" src={infoIcon} alt="" />
                        <div
                          className="suitability-cont"
                          style={{ "min-width": "300px" }}
                        >
                          {item?.matchCriteria}
                        </div>
                      </div>
                      <div> 
                            {(item?.availableAllocationPercentage == null || item?.availableAllocationPercentage<100)
                            ? <span className="AllocationLessThanHundreds">{item?.availableAllocationPercentage??0}%</span> 
                            :<span >{item?.availableAllocationPercentage}%</span> 
                            }
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
        ) : (
          <></>
        )}
      </div>

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

export default EmployeeRRTable;
