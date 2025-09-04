import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Header from "../../components/header/header";
import Home from "../../components/home/home.jsx";
import LeftMenu from "../../components/leftmenu";
import '../../pages/dashboard/dashboard.scss';
import '../../components/home/home.scss';
import ViewToggle from "../../components/tilelistview";
import './../home/home.scss';
import locationIcon from '../../resources/map-icon.svg';
import calIcon from '../../resources/calendar.svg';
import loaderImage from '../../resources/Loader.svg';
import { Link } from "react-router-dom";
import Model from "../../components/tilelistview/model";
import Pagination from "../pagination";
import "./index.scss"; // Import your custom CSS for styling

const ResourceTab = ({ employeeResults }) => {
  const searchResults = useSelector(state => state.manager.search)|| [];  
  const [isManager, setIsManager] = useState(false);

  const [isListMode, setListMode] = useState(true);
  const searchInputData = localStorage.getItem('searchInputText');
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = searchResults.resourceRequestSearchResult
  ? Math.ceil(searchResults.resourceRequestSearchResult.length / itemsPerPage)
  : 0;

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const itemsToShow = searchResults.resourceRequestSearchResult
  ? searchResults.resourceRequestSearchResult.slice(startIndex, endIndex)
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
    
    <h1> {`RRs Search Results (${searchResults?.resourceRequestSearchResult?.length})`}</h1> 
        <div className="filters">
          <ViewToggle onChange={handleViewChange} />
        </div>        
      </div>
    {isListMode ? 
      <>      
      <ul className="list-table">
                    {itemsToShow.map((job) => {
                        return (
                            <>
                                <li className="list-header">
                                    <div>RR Number</div>
                                    <div>Project</div>
                                    <div>Role</div>
                                    <div>Skills</div>
                                    <div>Required Exp.</div>
                                    {job.allocation ? <div>Project Assignment</div> : null}
                                    <div>Location</div>
                                    <div>Posted On</div>
                                    {job.jobAppliedOn ? <div>Applied on</div> : null}
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



                        const anchorId = (job.rrId); 

                        return (
                            <Fragment key={job.id} >
                                <li key={job.id} className="list-data">
                                    <div><Link className="rr-link" to={`/rrs?id=${job.rrId}&search=${true}`}>{job.rrNumber}</Link></div>
                                    <div className="tooltip" data-tooltip={job.projectName || job.project}>{job.projectName || job.project}</div>
                                    <div className="tooltip" data-tooltip={job.jobTitle}>{job.jobTitle}</div>
                                    <div className="skills tooltip" data-tooltip={`${job.primarySkill},${job.secondarySkill}`}>
                                        {primarySkills.map((skill, index) => (
                                            <span key={index}>{skill.trim()}</span>
                                        ))}
                                        {secondarySkills.map((skill, index) => (
                                            <span key={index}>{skill.trim()}</span>
                                        ))}
                                    </div>
                                    <div>{job.experience || job.requiredExperience} Years</div>
                                    {job.allocation ? <div>{job.allocation} %</div> : null}
                                    <div>{job.location}</div>
                                    <div>{formattedDate}</div>
                                </li>
                            </Fragment>
                        );
                    })}
                </ul>
      </>
       : 
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
                                        <h3><b>RR:</b> <Link className="rr-link" to={`/rrs?id=${job.rrId}`}>{job.rrNumber}</Link></h3>
                                    </div>
                                </div>
                                <div className="card-cont">
                                    <p><b>Role:</b> {job.jobTitle}</p>
                                    <p><b>experience:</b> {job.experience || job.requiredExperience} Years</p>


                                    {job.allocation ? <p><b>Project Assignment:</b> {job.allocation} %</p> : null}
                                    <p className="skills tooltip" data-tooltip={`${job.primarySkill},${job.secondarySkill}`}>
                                        <b>Skills:</b>
                                        {primarySkills.map((skill, index) => (
                                            <span key={index}>{skill.trim()}</span>
                                        ))}
                                        {secondarySkills.map((skill, index) => (
                                            <span key={index}>{skill.trim()}</span>
                                        ))}
                                    </p>

                                </div>
                                <div className="card-footer">
                                    <span><img src={locationIcon} alt="" />{job.location}</span>
                                    <span><img src={calIcon} alt="" />Posted On - {formattedDate}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
       </>
        }   
        <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
             />   
    </>
  );
};

export default ResourceTab;
