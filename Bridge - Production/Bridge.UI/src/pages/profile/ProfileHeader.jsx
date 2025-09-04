import React, { useState } from "react";
import emailIcon from "../../resources/mail.svg";
import phoneIcon from "../../resources/phone-icon.svg";
import mapIcon from "../../resources/map-icon.svg";
import avatar from "../../resources/user-icon.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../../components/home/home.scss";
import {
  getAboutMePercentage,
  getCertificationsPercentage,
  getEmidsProjectsWithResponsibilities,
  getPrevProjectPercentage,
  getPrimarySkillsPercentage,
  getProfileCompletenessPercentage,
  getSecondarySkillsPercentage,
} from "../../common/commonMethods";
import { Link } from "react-router-dom";

const ProfileHeader = ({
  employeeData,
  className = "",
  showProfileCompleteness = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to toggle the visibility of the div
  const toggleDiv = () => {
    setIsVisible(!isVisible);
  };

  // Function to close the profile completeness section
  const closeProfileCompleteness = () => {
    setIsVisible(false);
  };

  return (
    <div className={`profile-header ${className}`}>
      <img
        className="user"
        src={`${EMPLOYEE_IMG_URL_BASE}${
          employeeData.emidsUniqueId || employeeData.employeeId
        }.jpeg`}
        alt=""
        onError={(e) => {
          e.target.src = avatar;
        }}
      />
      <div className="head-details">
        <h1>{employeeData.employeeName}</h1>
        <span>
          {employeeData.designation} |{" "}
          {employeeData.emidsUniqueId || employeeData.employeeId}
        </span>
        <span className="contact-details">
          <span>
            <img src={emailIcon} alt="Email" />
            {employeeData.emailId}
          </span>
          <span>
            <img src={phoneIcon} alt="Phone" />
            {employeeData.phoneNumber}
          </span>
          <span>
            <img src={mapIcon} alt="Location" />
            {`${employeeData.workingLocation}, ${employeeData?.businessLocation}`}
          </span>
        </span>
      </div>
      {showProfileCompleteness && (
        <div
          className="profile-completeness-container"
          onBlur={closeProfileCompleteness}
          tabIndex={0} // Make the profile completeness section focusable
        >
          <div className="head-details profile-completeness">
            <Link className="rr-link" onClick={toggleDiv}>
              <span className="profile-completeness-header">
                Profile Completeness %
              </span>
              <div style={{ width: 50, height: 50 }}>
                <CircularProgressbar
                  value={getProfileCompletenessPercentage(employeeData)}
                  text={`${Math.round(
                    getProfileCompletenessPercentage(employeeData)
                  )}%`}
                  styles={buildStyles({
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 1,
                  })}
                />
              </div>
            </Link>
          </div>
          {/* Conditional rendering based on the state */}
          {isVisible && (
            <div className="profile-completeness-details">
              <table>
                <thead>
                  <tr>
                    <th>Categories</th>
                    <th>Assigned</th>
                    <th>Calculated from Profile</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>About Me</td>
                    <td>10%</td>
                    <td>{`${getAboutMePercentage(employeeData)}%`}</td>
                  </tr>
                  <tr>
                    <td>Primary Skills</td>
                    <td>5%</td>
                    <td>{`${getPrimarySkillsPercentage(employeeData)}%`}</td>
                  </tr>
                  <tr>
                    <td>Secondary Skills</td>
                    <td>5%</td>
                    <td>{`${getSecondarySkillsPercentage(
                      employeeData
                    )}%`}</td>
                  </tr>
                  <tr>
                    <td>Certifications</td>
                    <td>10%</td>
                    <td>{`${getCertificationsPercentage(employeeData)}%`}</td>
                  </tr>
                  <tr>
                    <td>Project Responsibilities</td>
                    <td>40%</td>
                    <td>{`${getEmidsProjectsWithResponsibilities(
                      employeeData
                    )}%`}</td>
                  </tr>
                  <tr>
                    <td>Previous Projects</td>
                    <td>30%</td>
                    <td>{`${getPrevProjectPercentage(employeeData)}%`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
