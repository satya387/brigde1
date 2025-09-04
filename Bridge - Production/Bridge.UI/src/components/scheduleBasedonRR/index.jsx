import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchManagerAppliedJobById,
  fetchManagerJobById,
  scheduleDiscussion,
} from "../../redux/actions/managerActions";
import { SendInvite } from "../../redux/actions/employeeActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import loaderImage from "../../resources/Loader.svg";
import Toaster from "../../components/toaster";
import emailIcon from "../../resources/mail.svg";
import phoneIcon from "../../resources/phone-icon.svg";
import skillIcon from "../../resources/skill.svg";
import avatar from "../../resources/user-icon.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import { emailRegex, getNearestMaxQuarter } from "../../common/commonMethods";
import * as GLOBAL_CONST from "../../common/constants";
import "../home/home.scss";

const ScheduleBasedonRR = () => {
  const dispatch = useDispatch();
  const managerId = useSelector((state) => state.user.employeeId);
  const myRRData = useSelector((state) => state.manager.managerJobByID) || [];
  const [selectedRRNumber, setSelectedRRNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const { empID } = useParams();
  const employeeData = useSelector((state) => state.employee.employeeProfile);
  const managerMailId = useSelector((state) => state.user.employeeEmailId);
  const [discussionStartTime, setDiscussionStartTime] = useState(null);
  const [discussionEndTime, setDiscussionEndTime] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discussionStart = new Date(discussionStartTime);
  const discussionEnd = new Date(discussionEndTime);

  const role = useSelector((state) => state.user.role);
  const managerIdFromStore = useSelector((state) => state.user.employeeId);

  const discussionDurationMinutes = Math.round(
    (discussionEnd - discussionStart) / (1000 * 60)
  );

  useEffect(() => {
    const requestData = {
      managerId: managerId,
      employeeId: employeeData?.emidsUniqueId,
    };
    dispatch(fetchManagerJobById(requestData));
  }, [dispatch, employeeData?.emidsUniqueId, managerId]);

  useEffect(() => {
    const startTime = getNearestMaxQuarter();
    const endTime = new Date(startTime.getTime() + 30 * 60000);
    setDiscussionStartTime(startTime);
    setDiscussionEndTime(endTime);
  }, []);

  const handleSelectChange = (event) => {
    setSelectedRRNumber(event.target.value);
  };

  const handleScheduleClick = () => {
    if (!selectedRRNumber) {
      setToasterMessage("Please select the RR Number");
      setToasterType("error");
      setShowToaster(true);
      setIsLoading(false);
      return;
    }
    if (selectedRRNumber && discussionEndTime) {
      setIsLoading(true);

      const discussionStart = new Date(discussionStartTime);
      const discussionEnd = new Date(discussionEndTime);
      const now = new Date();
      if (discussionStart <= now && discussionEnd <= now) {
        setShowToaster(true);
        setToasterMessage("Discussion date is in the past");
        setToasterType("error");
        setIsLoading(false);
        return;
      } else if (discussionEnd < discussionStart) {
        setShowToaster(true);
        setToasterMessage("Discussion end time should be after start time");
        setToasterType("error");
        setIsLoading(false);
        return;
      } else if (
        discussionEnd.getDate() === discussionStart.getDate() &&
        discussionEnd.getHours() === discussionStart.getHours() &&
        discussionEnd.getMinutes() <= discussionStart.getMinutes()
      ) {
        setShowToaster(true);
        setToasterMessage("Discussion end time should be after start time");
        setToasterType("error");
        setIsLoading(false);
        return;
      }
      const participantsEmails = participants.join(";"); // Use semicolon as separator
      const participantsArray = participantsEmails
        .split(";")
        .map((email) => email.trim());

      const invalidEmails = participantsArray.filter(
        (email) => !emailRegex.test(email)
      );

      if (invalidEmails.length > 0) {
        setShowToaster(true);
        setToasterMessage(
          "Invalid email addresses: " + invalidEmails.join(", ")
        );
        setToasterType("error");
        setIsLoading(false);
        return;
      }

      const selectedRRData = myRRData.find(
        (data) => data.rrNumber === selectedRRNumber
      );

      if (selectedRRData) {
        const discussionData = {
          discussionStartTime,
          discussionDuration: discussionDurationMinutes,
          optionalAttendees: participants.join(";"),
          employeeMailId: employeeData.emailId,
          employeeId: employeeData.emidsUniqueId,
          managerEmployeeMailId: managerMailId,
          managerEmployeeId: managerId,
          location: employeeData.location,
          resourceRequestNumber: selectedRRNumber,
          rrId: selectedRRData.rrId,
          status: GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM?.Scheduled,
        };
        const emailData = {
          employeeName: employeeData.employeeName,
          rrNumber: selectedRRNumber,
          jobTitle: selectedRRData?.jobTitle,
          project: selectedRRData?.projectName,
          employeeMailId: employeeData.emailId,
          managerMailId: managerMailId,
          optionalAttendees: participantsEmails,
          startDate: discussionStartTime,
          endDate: discussionEndTime,
        };
        dispatch(SendInvite(emailData));
        dispatch(scheduleDiscussion(discussionData))
          .then(() => {
            setToasterMessage("Discussion scheduled successfully");
            if (role === GLOBAL_CONST.Manager && managerIdFromStore) {
              dispatch(fetchManagerAppliedJobById(managerIdFromStore));
            }
            dispatch(
              fetchManagerJobById({
                managerId: managerId || managerIdFromStore,
                employeeId: employeeData?.emidsUniqueId,
              })
            );
            setToasterType("success");
            setShowToaster(true);
            setIsLoading(false);
            setIsModalOpen(false);
            setSelectedRRNumber("");
          })
          .catch((error) => {
            console.error("Error scheduling discussion:", error);
            setToasterMessage("Error scheduling discussion");
            setToasterType("error");
            setShowToaster(true);
            setIsLoading(false);
          });
      } else {
        setToasterMessage("Selected RR data not found");
        setToasterType("error");
        setShowToaster(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="schedule-wrapper">
      <button
        className="withdraw-btn blue-btn btn show"
        onClick={() => setIsModalOpen(true)}
      >
        Schedule
      </button>
      {isModalOpen && (
        <div className="modal-overlay schedule">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule discussion</h2>
              <p>
                Choose a date and time slot, and include recipients if needed.
              </p>
            </div>
            <div className="modal-cont">
              <div className="profile-header">
                <img
                  className="user"
                  src={`${EMPLOYEE_IMG_URL_BASE}${employeeData.emidsUniqueId}.jpeg`}
                  alt=""
                  onError={(e) => {
                    e.target.src = avatar;
                  }}
                />
                <div className="head-details">
                  <h1>{employeeData.employeeName}</h1>
                  <span>
                    {employeeData.designation} | {employeeData.emidsUniqueId}
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
                    <span className="skills">
                      <img src={skillIcon} alt="Skills" />
                      {employeeData.primarySkills
                        .split(",")
                        .map((skill, index) => (
                          <span key={index}>{skill.trim()}</span>
                        ))}
                    </span>
                  </span>
                </div>
              </div>
              <div className="select-rr">
                <p>Select RR For The Candidate</p>
                <select value={selectedRRNumber} onChange={handleSelectChange}>
                  <option value="">Select RR Number</option>
                  {myRRData.map((data) => (
                    <option
                      key={data.rrNumber}
                      value={data.rrNumber}
                      className="nn"
                    >
                      {data.rrNumber} - {data.projectName} - {data.jobTitle} -{" "}
                      {data.primarySkill}
                    </option>
                  ))}
                </select>
              </div>
              <div className="calendar">
                <p>Date and Time Slots</p>
                <div className="calendar-input">
                  <DatePicker
                    selected={discussionStartTime}
                    onChange={(date) => setDiscussionStartTime(date)}
                    dateFormat="MMMM d, yyyy"
                    className="date-picker"
                    placeholderText="MM/DD/YYYY"
                    minDate={new Date()}
                  />
                  <DatePicker
                    selected={discussionStartTime}
                    onChange={(date) => setDiscussionStartTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="From"
                    dateFormat="h:mm aa"
                    className="time-picker"
                    placeholderText="00:00"
                  />
                  <DatePicker
                    selected={discussionEndTime || discussionStartTime}
                    onChange={(date) => {
                      const newEndTime = new Date(discussionStartTime);
                      newEndTime.setHours(date.getHours());
                      newEndTime.setMinutes(date.getMinutes());
                      setDiscussionEndTime(newEndTime);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="To"
                    dateFormat="h:mm aa"
                    className="time-picker"
                    placeholderText="00:00"
                  />
                </div>
              </div>
              <div className="participants-wrap">
                <p>Optional attendees (separated by semicolon)</p>
                <input
                  type="text"
                  id="email-input"
                  placeholder="Add participants separated by semicolon"
                  value={participants.join(", ")}
                  onChange={(e) =>
                    setParticipants(
                      e.target.value.split(",").map((email) => email.trim())
                    )
                  }
                />
              </div>
            </div>
            <div className="modal-buttons">
              {isLoading && (
                <span className="loader">
                  <img src={loaderImage} alt="Loading" />
                </span>
              )}
              <button className="modal-button" onClick={handleScheduleClick}>
                Schedule
              </button>
              <button
                className="cancel modal-button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {toasterMessage && showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
    </div>
  );
};

export default ScheduleBasedonRR;
