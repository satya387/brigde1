import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/header";
import Home from "../../components/home/home.jsx";
import LeftMenu from "../../components/leftmenu";
import "../../pages/dashboard/dashboard.scss";
import "../../components/home/home.scss";
import ViewToggle from "../../components/tilelistview";
import "./../home/home.scss";
import locationIcon from "../../resources/map-icon.svg";
import calIcon from "../../resources/calendar.svg";
import loaderImage from "../../resources/Loader.svg";
import { Link } from "react-router-dom";
import Model from "../../components/tilelistview/model";
import Pagination from "../pagination";
import "./index.scss"; // Import your custom CSS for styling

const EmployeeTab = ({ employeeResults, showFuture = false }) => {
  const searchResults = useSelector((state) => state.manager.search) || [];
  const [isManager, setIsManager] = useState(false);

  const [isListMode, setListMode] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = showFuture
    ? searchResults.futureAvailableEmployees
      ? Math.ceil(searchResults.futureAvailableEmployees.length / itemsPerPage)
      : 0
    : searchResults.employeeSearchResult
    ? Math.ceil(searchResults.employeeSearchResult.length / itemsPerPage)
    : 0;

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToShow = showFuture
    ? searchResults.futureAvailableEmployees
      ? searchResults.futureAvailableEmployees.slice(startIndex, endIndex)
      : []
    : searchResults.employeeSearchResult
    ? searchResults.employeeSearchResult.slice(startIndex, endIndex)
    : [];

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewChange = (mode) => {
    setListMode(mode);
  };
  return (
    <>
      <div className="page-header">
        <h1>Employee Search Results</h1>
        <div className="filters">
          <ViewToggle onChange={handleViewChange} />
        </div>
      </div>
      {isListMode ? (
        <>
          <ul className="list-table">
            {itemsToShow.map((job) => {
              return (
                <>
                  <li className="list-header">
                    <div>Employee Name</div>
                    <div>Employee ID</div>
                    <div>Employee Email</div>
                    <div>Employee Role</div>
                    <div>Overall Experirience</div>
                    <div>Skills</div>
                    <div>Project Name</div>
                    <div>Location</div>
                  </li>
                </>
              );
            })}

            {itemsToShow.map((job) => {
              const jobModel = new Model(job);

              const formattedDate = jobModel.getFormattedDate();
              const experienceInYears = jobModel.getExperienceInYears();
              const firstTwoLetters = jobModel.getFirstTwoLetters();
              const primarySkills = jobModel.getPrimarySkills();
              const secondarySkills = jobModel.getSecondarySkills();

              const anchorId = job.rrId;

              return (
                <Fragment key={job.id}>
                  <li key={job.id} className="list-data">
                    <div className="tooltip" data-tooltip={job.employeeName}>
                      <Link to={`/search/${job.employeeId}`}>
                        {job.employeeName}
                      </Link>
                    </div>
                    <div>{job.employeeId}</div>
                    <div className="tooltip" data-tooltip={job.employeeEmailId}>
                      {job.employeeEmailId}
                    </div>
                    <div>{job.employeeRole}</div>
                    <div>{job.experience} Years</div>
                    <div
                      className="skills tooltip"
                      data-tooltip={`${job.primarySkills},${job.secondarySkills}`}
                    >
                      <span>{job.primarySkills}</span>
                      <span>{job.secondarySkills}</span>
                    </div>
                    <div>{job.projectName}</div>
                    <div>{job.workingLocation}</div>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <div className="tile-table card-wrap">
            {itemsToShow.map((job) => {
              const jobModel = new Model(job);

              const formattedDate = jobModel.getFormattedDate();
              const experienceInYears = jobModel.getExperienceInYears();
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
                      <h3>
                        <b>Employee ID:</b> {job.employeeId}
                      </h3>
                    </div>
                  </div>
                  <div className="card-cont">
                    <div>
                      <b>Employee Name: </b>
                      {job.employeeName}
                    </div>
                    <div>
                      <b>Email: </b>
                      {job.employeeEmailId}
                    </div>
                    <div>
                      <b>Role:</b>
                      {job.employeeRole}
                    </div>
                    <div>
                      <b>Overall Experience</b>
                      {job.experience} Years
                    </div>
                    <p className="skills">
                      <b>Skills:</b>
                      <span>{job.primarySkills}</span>
                      <span>{job.secondarySkills}</span>
                    </p>
                  </div>
                  <div className="card-footer">
                    <span>
                      <img src={locationIcon} alt="" />
                      {job.workingLocation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default EmployeeTab;
