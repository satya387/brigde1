import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import ViewResourceFeedback from "../../components/ViewResourceFeedback";
import {
  fetchEmployeeProfile,
  updateEmployeeAbout,
  updateEmployeeRoles,
  upsertEmployeePreviousOrg,
  trackLoginAnalytics,
} from "../../redux/actions/employeeActions";
import calIcon from "../../resources/calendar.svg";
import loader from "../../resources/Loader.svg";
import editIcon from "../../resources/pencil.svg";
import deleteIcon from "../../resources/delete.svg";
import avatar from "../../resources/user-icon.svg";
import skillIcon from "../../resources/skill.svg";
import DownArrowBlue from "../../resources/DownBlue.svg";
import DownArrowWhite from "../../resources/DownWhite.svg";
import "./index.scss";
import Toaster from "../../components/toaster";
import ViewSelfSummaryForm from "../../components/ViewSelfSummaryForm";
import emptyProject from "../../resources/empty-project.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import EmployeeResume from "../../components/EmployeeResume";
import ProfileHeader from "./ProfileHeader";
import CertificationBlock from "./CertificationBlock";
import SkillsBlock from "./SkillsBlock";
import * as GLOBAL_CONST from "../../common/constants";
import * as CONST from "./constant";
import ClickAwayListener from "react-click-away-listener";
import { NOMINATE } from "../manager/reviewApplications/constant";
import NominatePopup from "../../components/NominatePopup";
import { applyForJob } from "../../redux/actions/jobActions";

const EmployeeProfileComponent = () => {
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.employee.employeeProfile);
  const isProfileRoute =
    window.location.pathname.startsWith("/profile/") ||
    window.location.pathname.startsWith("/m-profile/");
  const { employeeID, managerID, empID } = useParams();
  const isManagerProfileRoute =
    window.location.pathname.startsWith("/m-profile/");
  const isAvailableResourceRoute =
    window.location.pathname.startsWith("/m-available");
  const isReviewAppication =
    window.location.pathname.startsWith("/review-appication");
  const isSearchRoute = window.location.pathname.startsWith("/search");

  const employeeId = useSelector((state) => state.user.employeeId);
  const role = useSelector((state) => state.user.role);
  const [isLoading, setLoading] = useState(true);
  const [editedAbout, setEditedAbout] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPrevProject, setSelectedPrevProject] = useState(null);
  const [editedKeyRoles, setEditedKeyRoles] = useState("");
  const [editedProjectRole, setEditedProjectRole] = useState("");
  const [editedSkills, setEditedSkills] = useState("");
  const [isEditingKeyRoles, setIsEditingKeyRoles] = useState(false);
  const [isEditingPrevProject, setIsEditingPrevProject] = useState(false);
  const [isAddingAssignment, setAddingAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    keyResponsibilities: "",
  });

  const [editedPrevProject, setEditedPrevProject] = useState({});
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [selectedRR, setSelectedRR] = useState(null);
  const [isNominatePopupOpen, setNominatePopupOpen] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [errors, setErrors] = useState({
    projectName: "",
    startDate: "",
    endDate: "",
    projectRole: "",
    skills: "",
    keyResponsibilities: "",
  });
  const [
    isViewManagerFeedbackPopupVisible,
    setIsViewManagerFeedbackPopupVisible,
  ] = useState(false);
  const [isViewSelfFeedbackPopupVisible, setIsViewSelfFeedbackPopupVisible] =
    useState(false);

  const [dropdownMenu, setDrowDownMenu] = useState(false);
  const [icon, setIcon] = useState(DownArrowBlue);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  const maxAboutCharLimit = 350;
  const maxKeyRolesCharLimit = 1000;

  useEffect(() => {
    if (employeeID) {
      dispatch(fetchEmployeeProfile(employeeId));
    } else if (managerID) {
      dispatch(fetchEmployeeProfile(employeeId));
    } else if (empID) {
      setLoading(true);
      dispatch(fetchEmployeeProfile(empID));
    }
  }, [dispatch, employeeId, empID, managerID]);

  useEffect(() => {
    if (!dropdownMenu) {
      setIcon(DownArrowBlue);
    }
  }, [dropdownMenu]);

  const handleEditClick = () => {
    setEditedAbout(employeeData.about);
    setModalOpen(true);
  };

  const handleAboutChange = (event) => {
    const text = event.target.value;
    if (text.length <= maxAboutCharLimit) {
      setEditedAbout(text);
    }
  };

  const handleSaveClick = async () => {
    try {
      await dispatch(
        updateEmployeeAbout({
          employeeId: employeeData.emidsUniqueId,
          employeeWriteup: editedAbout,
        })
      );
      dispatch(fetchEmployeeProfile(employeeId));
      /**
       * Analytics API
       */
      await trackLoginAnalytics(employeeData, true);
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving about text:", error);
    }
  };

  const handleNominatePopup = () => {
    setUserDetail(employeeData);
    setNominatePopupOpen(true);
  };

  const closehandleNominatePopup = () => {
    setNominatePopupOpen(false);
  };

  const handleOpenNominateConfirmation = () => {
    closehandleNominatePopup();
    setLoading(false);
    setConfirmationPopup(true);
  };

  const closeConfirmationNominatePopup = () => {
    setConfirmationPopup(false);
    setSelectedRR(null);
    setUserDetail(null);
  };

  const handleCancelClick = () => {
    setModalOpen(false);
  };

  const handleProjectSelect = (resourceAssignId) => {
    const project = employeeData.employeeProjects.find(
      (proj) => proj.resourceAssignId === parseInt(resourceAssignId)
    );
    setSelectedProject(project);
  };

  const handlePrevProjectSelect = (id) => {
    const project = employeeData.previousOrgAssignments.find(
      (proj) => proj.id === parseInt(id)
    );
    setSelectedPrevProject(project);
  };

  const openKeyRolesPopup = () => {
    setIsEditingKeyRoles(true);
    setEditedKeyRoles(
      selectedProject ? selectedProject.projectKeyResponsibilities : ""
    );
    setEditedProjectRole(selectedProject ? selectedProject.projectRole : "");
    setEditedSkills(selectedProject ? selectedProject.projectSkills : "");
  };

  const openConfirmationPopup = () => {
    setConfirmDeleteOpen(true);
  };
  const closeConfirmationPopup = () => {
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    const requestData = {
      id: selectedPrevProject.id,
      emidsUniqueId: "",
      projectName: "",
      startDate: selectedPrevProject.startDate,
      endDate: selectedPrevProject.endDate,
      technologies: "",
      keyResponsibilities: "",
      projectId: null,
      projectRole: "",
    };
    try {
      await dispatch(upsertEmployeePreviousOrg(requestData));
      /**
       * Analytics API
       */
      await trackLoginAnalytics(employeeData, true);
      setConfirmDeleteOpen(false);
      setToasterMessage("Deleted successfully");
      setToasterType("success");
      setShowToaster(true);
      dispatch(fetchEmployeeProfile(employeeId));
    } catch (error) {
      setShowToaster(false);
      console.error("Error saving key roles:", error);
    }
  };

  const handleNomination = async () => {
    try {
      setLoading(true);
      const response = await applyForJob(
        userDetail?.employeeId || userDetail?.emidsUniqueId,
        selectedRR?.rrId,
        selectedRR?.rrNumber,
        employeeId
      );
      // dispatch(getAllAvailableResources());
      setToasterMessage(
        `You have successfully nominated ${
          userDetail?.employeeName
        } for ${`${selectedRR?.rrNumber} - ${selectedRR?.projectName}`}.`
      );
      setToasterType("success");
      setShowToaster(true);
      closeConfirmationNominatePopup();
    } catch (error) {
      setShowToaster(false);
    } finally {
      setLoading(false);
    }
  };

  const openPrevProject = (project) => {
    setIsEditingPrevProject(true);
    setEditedPrevProject({
      ...project,
    });
  };
  const handlePrevProjectFieldChange = (field, value) => {
    if (
      field === "keyResponsibilities" &&
      value.length > maxKeyRolesCharLimit
    ) {
      return;
    }
    setEditedPrevProject({
      ...editedPrevProject,
      [field]: value,
    });
  };
  const handleSaveKeyRoles = async () => {
    const requestData = {
      id: null,
      emidsUniqueId: employeeData.emidsUniqueId,
      projectName: selectedProject.projectName,
      startDate: selectedProject.assignDate,
      endDate: selectedProject.releaseDate,
      technologies: editedSkills,
      keyResponsibilities: editedKeyRoles,
      projectId: selectedProject.projectId,
      projectRole: editedProjectRole,
      ResourceAssignId: selectedProject.resourceAssignId,
    };
    try {
      await dispatch(updateEmployeeRoles(requestData));
      dispatch(fetchEmployeeProfile(employeeId));
      setIsEditingKeyRoles(false);
      setToasterMessage("Edited successfully");
      setToasterType("success");
      setShowToaster(true);
    } catch (error) {
      console.error("Error saving key roles:", error);
    }
  };

  const handleCancelNewAssignment = () => {
    setErrors({});
    setAddingAssignment(false);
  };

  const handleSaveNewAssignment = async () => {
    setErrors({});
    const newErrors = {};

    if (!newAssignment.projectName) {
      newErrors.projectName = "Project Name is required";
    }

    if (!newAssignment.startDate) {
      newErrors.startDate = "Start Date is required";
    }

    if (!newAssignment.endDate) {
      newErrors.endDate = "End Date is required";
    } else if (newAssignment.startDate > newAssignment.endDate) {
      newErrors.endDate = "End Date must be greater than Start Date";
    }

    if (!newAssignment.projectRole) {
      newErrors.projectRole = "Project Role is required";
    }

    if (!newAssignment.skills) {
      newErrors.skills = "Skills are required";
    }

    if (!newAssignment.keyResponsibilities) {
      newErrors.keyResponsibilities = "Key Responsibilities are required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const requestData = {
          id: 0,
          emidsUniqueId: employeeData.emidsUniqueId,
          projectName: newAssignment.projectName,
          startDate: newAssignment.startDate,
          endDate: newAssignment.endDate,
          technologies: newAssignment.skills,
          keyResponsibilities: newAssignment.keyResponsibilities,
          projectId: null,
          projectRole: newAssignment.projectRole,
        };

        await dispatch(upsertEmployeePreviousOrg(requestData));
        /**
         * Analytics API
         */
        await trackLoginAnalytics(employeeData, true);
        dispatch(fetchEmployeeProfile(employeeId));

        setNewAssignment({
          projectName: "",
          startDate: "",
          endDate: "",
          skills: "",
          keyResponsibilities: "",
          projectRole: "",
        });
        setAddingAssignment(false);
        setToasterMessage("Added new project");
        setToasterType("success");
        setShowToaster(true);
      } catch (error) {
        console.error("Error saving new assignment:", error);
      }
    }
  };

  const handleUpdatePrevProject = async () => {
    const requestData = {
      id: selectedPrevProject.id,
      emidsUniqueId: employeeData.emidsUniqueId,
      projectName: editedPrevProject.projectName,
      startDate: editedPrevProject.startDate,
      endDate: editedPrevProject.endDate,
      technologies: editedPrevProject.technologies,
      keyResponsibilities: editedPrevProject.keyResponsibilities,
      projectId: null,
      projectRole: editedPrevProject.projectRole,
    };
    const startDate = new Date(editedPrevProject.startDate);
    const endDate = new Date(editedPrevProject.endDate);
    if (endDate < startDate) {
      setToasterMessage("End date cannot be earlier than start date");
      setToasterType("error");
      setShowToaster(true);
      return;
    }
    try {
      await dispatch(upsertEmployeePreviousOrg(requestData));
      /**
       * Analytics API
       */
      await trackLoginAnalytics(employeeData, true);
      dispatch(fetchEmployeeProfile(employeeId));
      setIsEditingPrevProject(false);
      setToasterMessage("Updated successfully");
      setToasterType("success");
      setShowToaster(true);
    } catch (error) {
      console.error("Error saving key roles:", error);
    }
  };

  const closePrevProject = () => {
    setIsEditingPrevProject(false);
  };

  const closeKeyRolesPopup = () => {
    setIsEditingKeyRoles(false);
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (employeeData) {
      if (
        employeeData.employeeProjects &&
        employeeData.employeeProjects.length > 0
      ) {
        const selectedProjectExists = employeeData.employeeProjects.some(
          (proj) => proj.resourceAssignId === selectedProject?.resourceAssignId
        );

        if (selectedProjectExists) {
          setSelectedProject((prevSelectedProject) => {
            const updatedProject = employeeData.employeeProjects.find(
              (proj) =>
                proj.resourceAssignId === prevSelectedProject?.resourceAssignId
            );
            return updatedProject || employeeData.employeeProjects[0];
          });
        } else {
          setSelectedProject(employeeData.employeeProjects[0]);
        }
      }

      if (
        employeeData.previousOrgAssignments &&
        employeeData.previousOrgAssignments.length > 0
      ) {
        const selectedPrevProjectExists =
          employeeData.previousOrgAssignments.some(
            (proj) => proj.id === selectedPrevProject?.id
          );

        if (selectedPrevProjectExists) {
          setSelectedPrevProject((prevSelectedPrevProject) => {
            const updatedPrevProject = employeeData.previousOrgAssignments.find(
              (proj) => proj.id === prevSelectedPrevProject?.id
            );
            return updatedPrevProject || employeeData.previousOrgAssignments[0];
          });
        } else {
          setSelectedPrevProject(employeeData.previousOrgAssignments[0]);
        }
      }
    }
  }, [employeeData]);

  if (!employeeData) {
    return (
      <div>
        <img src={loader} alt="Loading" />
      </div>
    );
  }

  if (!employeeData && isLoading) {
    return (
      <div className="loader-container">
        <img src={loader} alt="Loading" className="loader" />
      </div>
    );
  }

  const generatePDF = () => {
    const element = document.querySelector(
      `#employee-resume-${employeeData?.emidsUniqueId}`
    );
    if (element) {
      setDrowDownMenu(false);
      const opt = {
        margin: 2,
        filename: `${employeeData?.employeeName}-${employeeData?.emidsUniqueId}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      html2pdf().from(element).set(opt).save();
    }
  };

  const handleActionDropdown = () => {
    setDrowDownMenu(!dropdownMenu);
  };

  return (
    <>
      <Popup
        open={isViewManagerFeedbackPopupVisible}
        onClose={() => setIsViewManagerFeedbackPopupVisible(false)}
        closeOnDocumentClick={false}
        closeOnEscape={false}
      >
        <ViewResourceFeedback
          header="MANAGER FEEDBACK"
          onClose={() => setIsViewManagerFeedbackPopupVisible(false)}
          empId={employeeData?.emidsUniqueId}
        />
      </Popup>
      <Popup
        open={isViewSelfFeedbackPopupVisible}
        onClose={() => setIsViewSelfFeedbackPopupVisible(false)}
        closeOnDocumentClick={false}
        closeOnEscape={false}
      >
        <ViewSelfSummaryForm
          header="Self Summary"
          onClose={() => setIsViewSelfFeedbackPopupVisible(false)}
          empId={employeeData?.emidsUniqueId}
        />
      </Popup>
      <div>
        <div
          className="action-items-profile"
          onMouseOver={() => setIcon(DownArrowWhite)}
          onMouseOut={() => setIcon(DownArrowBlue)}
        >
          <button
            className={`dropdown-btn ${dropdownMenu ? "dropdown-btn-hov" : ""}`}
            onClick={handleActionDropdown}
          >
            <div className="action-wrapper">
              <div>{CONST.ACTIONS}</div>
              <img
                src={dropdownMenu ? DownArrowWhite : icon}
                alt={"Down"}
                className={`dropdown-arrow ${
                  dropdownMenu ? "down-arrow-rotate" : ""
                }`}
              />
            </div>
          </button>
          {dropdownMenu && (
            <ClickAwayListener onClickAway={() => setDrowDownMenu(false)}>
              <div className={`option-menu-wrapper`}>
                <ul className="option-menu">
                  {!isProfileRoute && (
                    <li
                      className="option-menu-items"
                      onClick={() => {
                        setDrowDownMenu(false);
                        setIsViewManagerFeedbackPopupVisible(true);
                      }}
                    >
                      {CONST.MANAGER_FEEDBACK}
                    </li>
                  )}
                  {((!isManagerProfileRoute && isProfileRoute) ||
                    isAvailableResourceRoute ||
                    isReviewAppication ||
                    isSearchRoute) && (
                    <li
                      className="option-menu-items"
                      onClick={() => {
                        setDrowDownMenu(false);
                        setIsViewSelfFeedbackPopupVisible(true);
                      }}
                    >
                      {CONST.SELF_SUMMARY_FEEDBACK}
                    </li>
                  )}
                  {role === GLOBAL_CONST.WFMTeam &&
                    employeeData?.status !== "Earmarked" &&
                    employeeData?.status !== "Resigned" && (
                      <li
                        className="option-menu-items"
                        onClick={() => {
                          setDrowDownMenu(false);
                          handleNominatePopup();
                        }}
                      >
                        {NOMINATE}
                      </li>
                    )}
                  <li className="option-menu-items" onClick={generatePDF}>
                    {GLOBAL_CONST.DOWNLOAD_PROFILE}
                  </li>
                </ul>
              </div>
            </ClickAwayListener>
          )}
        </div>
        <div className="prof-wrapper">
          <div className="left-cont">
            <ProfileHeader employeeData={employeeData} />
            <div className="profile-details">
              <div className="cont">
                <h2>
                  About Me
                  {isProfileRoute && (
                    <button className="edit" onClick={handleEditClick}>
                      <img src={editIcon} alt="edit" />
                    </button>
                  )}
                </h2>
                <p>{employeeData.about}</p>
              </div>
              <div className={`cont`}>
              {role === GLOBAL_CONST.Manager &&  <h2>Available Allocation  {employeeData.availableAllocationPercentage==100
       ? <span className="AllocationHundreds">{employeeData.availableAllocationPercentage}</span> 
      :<span className="AllocationLessThanHundreds">{employeeData.availableAllocationPercentage}</span> 
              }%</h2>}          
      </div>
              <SkillsBlock employeeData={employeeData} />
            </div>
            {employeeData?.skillMatrix?.certifications && (
              <CertificationBlock employeeData={employeeData} />
            )}
          </div>
          <div className="right-cont">
            <h2>Project History</h2>
            <div className="tab-navigation">
              <button
                className={`tab-button left ${
                  activeTab === "projects" ? "active" : ""
                }`}
                onClick={() => switchTab("projects")}
              >
                Emids Projects ({employeeData.employeeProjects.length})
              </button>
              <button
                className={`tab-button right ${
                  activeTab === "assignments" ? "active" : ""
                }`}
                onClick={() => switchTab("assignments")}
              >
                Past Projects ({employeeData.previousOrgAssignments.length})
              </button>
            </div>
            {activeTab === "projects" && (
              <div className="proj-wrap">
                {employeeData.employeeProjects.length > 0 && (
                  <select
                    value={
                      selectedProject ? selectedProject.resourceAssignId : ""
                    }
                    onChange={(e) => handleProjectSelect(e.target.value)}
                  >
                    {employeeData.employeeProjects.map((proj) => (
                      <option
                        key={proj.resourceAssignId}
                        value={proj.resourceAssignId}
                      >
                        {proj.projectName}
                      </option>
                    ))}
                  </select>
                )}
                {employeeData.employeeProjects.length > 0 && selectedProject ? (
                  <div key={selectedProject.resourceAssignId}>
                    {selectedProject && (
                      <div key={selectedProject.resourceAssignId}>
                        <h2 className="proj-name">
                          <span className="proj-img">
                            {`${selectedProject.projectName.substring(0, 2)}`}
                          </span>
                        </h2>
                        {isProfileRoute && (
                          <div className="edit-wrap">
                            <button
                              className="edit"
                              onClick={() => openKeyRolesPopup(selectedProject)}
                            >
                              <img src={editIcon} alt="edit" />
                            </button>
                          </div>
                        )}
                        <div className="proj-details">
                          <div className="row">
                            <img src={calIcon} alt="" />
                            <b>Project Start Date : </b>
                            {formatDate(selectedProject.assignDate)}
                          </div>
                          <div className="row">
                            <img src={calIcon} alt="" />
                            <b>Project End Date : </b>
                            {formatDate(selectedProject.releaseDate)}
                          </div>
                          <div className="row">
                            <img src={avatar} alt="" />
                            <b>Role: {selectedProject.projectRole}</b>
                          </div>
                          <div className="row">
                            <img src={skillIcon} alt="" />
                            <span>
                              <b>Skills: </b>
                            </span>
                            <span className="skills">
                              {" "}
                              {selectedProject.projectSkills
                                .split(",")
                                .map((skill) => (
                                  <span key={skill.trim()}>{skill.trim()}</span>
                                ))}
                            </span>
                          </div>
                          <div className="responsibility-section">
                            <h2>Key responsibilities</h2>
                            <ul className="bullet-list">
                              {selectedProject.projectKeyResponsibilities
                                .split("\n")
                                .map((line, index) => {
                                  const trimmedLine = line.trim();
                                  if (
                                    trimmedLine === "-" ||
                                    trimmedLine === "•" ||
                                    trimmedLine === "*"
                                  ) {
                                    return <li key={index}>{trimmedLine}</li>;
                                  } else if (trimmedLine === "") {
                                    return null;
                                  } else {
                                    return (
                                      <li key={index}>
                                        {trimmedLine.startsWith("- ") ||
                                        trimmedLine.startsWith("* ")
                                          ? trimmedLine.substring(2)
                                          : trimmedLine}
                                      </li>
                                    );
                                  }
                                })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-project">
                    <img src={emptyProject} alt="Empty project" />
                    <div>
                      <h3>No projects.</h3>
                    </div>
                  </div>
                )}
                {isEditingKeyRoles && selectedProject && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h2>Edit Project</h2>
                        <p>Revise or modify written content for personal use</p>
                      </div>
                      <div className="modal-cont">
                        <span className="proj-img">
                          {`${selectedProject.projectName.substring(0, 2)}`}
                        </span>
                        <div>
                          <h2>{selectedProject.projectName}</h2>
                          <div className="column">
                            <div>
                              <b>Project Start Date:</b>
                              {formatDate(selectedProject.assignDate)}
                            </div>
                            <div>
                              <b>Project End Date:</b>
                              {formatDate(selectedProject.releaseDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="project-fields">
                        <div className="form-field">
                          <label>Project Role</label>
                          <input
                            className="modal-input"
                            value={editedProjectRole}
                            onChange={(e) =>
                              setEditedProjectRole(e.target.value)
                            }
                          />
                        </div>
                        <div className="form-field">
                          <label>Skills</label>
                          <input
                            className="modal-input"
                            value={editedSkills}
                            onChange={(e) => setEditedSkills(e.target.value)}
                          />
                        </div>
                        <div className="form-field">
                          <label>Roles and Responsibilities</label>
                          <textarea
                            className="modal-textarea"
                            value={editedKeyRoles}
                            onChange={(e) => {
                              const text = e.target.value;
                              if (text.length <= maxKeyRolesCharLimit) {
                                setEditedKeyRoles(text);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="modal-buttons">
                        <button
                          className="modal-button"
                          onClick={handleSaveKeyRoles}
                        >
                          Save
                        </button>
                        <button
                          className="cancel modal-button"
                          onClick={closeKeyRolesPopup}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="char-count">
                        Characters remaining:{" "}
                        {maxKeyRolesCharLimit - editedKeyRoles.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "assignments" && (
              <>
                {isProfileRoute && (
                  <div className="add-assignment-button">
                    <button
                      className=""
                      onClick={() => setAddingAssignment(true)}
                    >
                      <span>+</span> Add Project
                    </button>
                  </div>
                )}
                <div className="proj-wrap">
                  {employeeData.previousOrgAssignments.length > 0 && (
                    <select
                      value={selectedPrevProject ? selectedPrevProject.id : ""}
                      onChange={(e) => handlePrevProjectSelect(e.target.value)}
                    >
                      {employeeData.previousOrgAssignments.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.projectName}
                        </option>
                      ))}
                    </select>
                  )}

                  {isAddingAssignment ? (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h2>Add Assignment</h2>
                          <p>You can add projects as much as you want</p>
                        </div>
                        <div className="fields-wrap">
                          <div className="form-field">
                            <label htmlFor="projectName">Project Name:</label>
                            <input
                              type="text"
                              className="modal-input"
                              id="projectName"
                              value={newAssignment.projectName}
                              onChange={(e) =>
                                setNewAssignment({
                                  ...newAssignment,
                                  projectName: e.target.value,
                                })
                              }
                              required="required"
                            />
                            {errors.projectName && (
                              <div className="error-message">
                                {errors.projectName}
                              </div>
                            )}
                          </div>

                          <div className="column">
                            <div className="form-field w-50">
                              <label htmlFor="startDate">Start Date:</label>
                              <input
                                type="date"
                                className="modal-input"
                                id="startDate"
                                value={newAssignment.startDate}
                                onChange={(e) =>
                                  setNewAssignment({
                                    ...newAssignment,
                                    startDate: e.target.value,
                                  })
                                }
                                required="required"
                              />
                              {errors.startDate && (
                                <div className="error-message">
                                  {errors.startDate}
                                </div>
                              )}
                            </div>
                            <div className="form-field w-50">
                              <label htmlFor="endDate">End Date:</label>
                              <input
                                type="date"
                                className="modal-input"
                                id="endDate"
                                value={newAssignment.endDate}
                                onChange={(e) =>
                                  setNewAssignment({
                                    ...newAssignment,
                                    endDate: e.target.value,
                                  })
                                }
                                required="required"
                              />
                              {errors.endDate && (
                                <div className="error-message">
                                  {errors.endDate}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="form-field">
                            <label htmlFor="projectRole">Project Role:</label>
                            <input
                              type="text"
                              className="modal-input"
                              id="projectRole"
                              value={newAssignment.projectRole}
                              onChange={(e) =>
                                setNewAssignment({
                                  ...newAssignment,
                                  projectRole: e.target.value,
                                })
                              }
                              required="required"
                            />
                            {errors.projectRole && (
                              <div className="error-message">
                                {errors.projectRole}
                              </div>
                            )}
                          </div>
                          <div className="form-field">
                            <label htmlFor="skills">Skills:</label>
                            <input
                              type="text"
                              className="modal-input"
                              id="skills"
                              value={newAssignment.skills}
                              onChange={(e) =>
                                setNewAssignment({
                                  ...newAssignment,
                                  skills: e.target.value,
                                })
                              }
                              required="required"
                            />
                            {errors.skills && (
                              <div className="error-message">
                                {errors.skills}
                              </div>
                            )}
                          </div>
                          <div className="form-field">
                            <label htmlFor="keyResponsibilities">
                              Key Responsibilities:
                            </label>
                            <textarea
                              id="keyResponsibilities"
                              value={newAssignment.keyResponsibilities}
                              onChange={(e) => {
                                const text = e.target.value;
                                if (text.length <= maxKeyRolesCharLimit) {
                                  setNewAssignment({
                                    ...newAssignment,
                                    keyResponsibilities: text,
                                  });
                                }
                              }}
                              required="required"
                            />
                            {errors.keyResponsibilities && (
                              <div className="error-message">
                                {errors.keyResponsibilities}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="modal-buttons">
                          <button
                            className="modal-button"
                            onClick={handleSaveNewAssignment}
                          >
                            Save
                          </button>
                          <button
                            className="cancel modal-button"
                            onClick={handleCancelNewAssignment}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="char-count">
                          Characters remaining:{" "}
                          {maxKeyRolesCharLimit -
                            newAssignment.keyResponsibilities.length}
                        </div>
                      </div>
                    </div>
                  ) : selectedPrevProject &&
                    employeeData.previousOrgAssignments.length > 0 ? (
                    <div>
                      <h2 className="proj-name">
                        <span className="proj-img">
                          {`${selectedPrevProject.projectName.substring(0, 2)}`}
                        </span>
                      </h2>
                      {isProfileRoute && (
                        <div className="edit-wrap">
                          <button
                            className="edit"
                            onClick={() => openPrevProject(selectedPrevProject)}
                          >
                            <img src={editIcon} alt="edit" />
                          </button>
                          <button
                            className="delete"
                            onClick={() => openConfirmationPopup()}
                          >
                            <img src={deleteIcon} alt="delete" />
                          </button>
                        </div>
                      )}
                      <div className="proj-details">
                        <div className="row">
                          <img src={calIcon} alt="" />
                          <b>Project Start Date : </b>
                          {formatDate(selectedPrevProject.startDate)}
                        </div>
                        <div className="row">
                          <img src={calIcon} alt="" />
                          <b>Project End Date : </b>
                          {formatDate(selectedPrevProject.endDate)}
                        </div>
                        <div className="row">
                          <img src={avatar} alt="" />
                          <b>Role: {selectedPrevProject.projectRole}</b>
                        </div>
                        <div className="row">
                          <img src={skillIcon} alt="" />
                          <span className="skills">
                            {" "}
                            {selectedPrevProject.technologies
                              .split(",")
                              .map((skill) => (
                                <span key={skill.trim()}>{skill.trim()}</span>
                              ))}
                          </span>
                        </div>
                        <div className="responsibility-section">
                          <h2>Key responsibilities</h2>
                          <ul className="bullet-list">
                            {selectedPrevProject.keyResponsibilities
                              .split("\n")
                              .map((line, index) => {
                                const trimmedLine = line.trim();
                                if (
                                  trimmedLine === "-" ||
                                  trimmedLine === "•" ||
                                  trimmedLine === "*"
                                ) {
                                  return <li key={index}>{trimmedLine}</li>;
                                } else if (trimmedLine === "") {
                                  return null;
                                } else {
                                  return (
                                    <li key={index}>
                                      {trimmedLine.startsWith("- ") ||
                                      trimmedLine.startsWith("* ")
                                        ? trimmedLine.substring(2)
                                        : trimmedLine}
                                    </li>
                                  );
                                }
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : isProfileRoute ? (
                    <div className="empty-project">
                      <img src={emptyProject} alt="Empty project" />
                      <div>
                        <h3>
                          No additional projects added. To add projects other
                          than Emids, click above. Please use English.
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-project">
                      <img src={emptyProject} alt="Empty project" />
                      <div>
                        <h3>No additional projects added.</h3>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit About Me</h2>
                <p>Revise or modify written content for personal use</p>
              </div>
              <div className="modal-cont">
                <img
                  className="profile-img"
                  src={`${EMPLOYEE_IMG_URL_BASE}${employeeData.emidsUniqueId}.jpeg`}
                  alt=""
                  onError={(e) => {
                    e.target.src = avatar;
                  }}
                />
                <div>
                  <h2>{employeeData.employeeName}</h2>
                  <span>
                    <b>Overall Experience : </b>
                    {employeeData.employeeExperience}
                  </span>
                  <span className="skills">
                    <b>Skills : </b>
                    {employeeData.primarySkills ? (
                      <span>{employeeData.primarySkills}</span>
                    ) : null}
                    {employeeData.secondarySkills ? (
                      <span>{employeeData.secondarySkills}</span>
                    ) : null}
                  </span>
                </div>
              </div>
              <h2>About me</h2>
              <p>Write something about yourself</p>
              <textarea
                className="modal-textarea"
                value={editedAbout}
                onChange={handleAboutChange}
                placeholder="Edit about..."
              />
              <div className="modal-buttons">
                <button className="modal-button" onClick={handleSaveClick}>
                  Save
                </button>
                <button
                  className="cancel modal-button"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
              <div className="char-count">
                Characters remaining: {maxAboutCharLimit - editedAbout.length}
              </div>
            </div>
          </div>
        )}
        {isEditingPrevProject && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Previous Project</h2>
                <p>Edit the project details</p>
              </div>
              <div className="fields-wrap">
                <div className="form-field">
                  <label htmlFor="projectName">Project Name:</label>
                  <input
                    type="text"
                    className="modal-input"
                    id="projectName"
                    value={editedPrevProject.projectName}
                    onChange={(e) =>
                      handlePrevProjectFieldChange(
                        "projectName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="column">
                  <div className="form-field w-50">
                    <label htmlFor="startDate">Start Date: </label>
                    <input
                      type="date"
                      className="modal-input"
                      id="startDate"
                      value={formatDateForInput(editedPrevProject.startDate)}
                      onChange={(e) =>
                        handlePrevProjectFieldChange(
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="form-field w-50">
                    <label htmlFor="endDate">End Date: </label>
                    <input
                      type="date"
                      className="modal-input"
                      id="endDate"
                      value={formatDateForInput(editedPrevProject.endDate)}
                      onChange={(e) =>
                        handlePrevProjectFieldChange("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="projectRole">Project Role:</label>
                  <input
                    type="text"
                    className="modal-input"
                    id="projectRole"
                    value={editedPrevProject.projectRole}
                    onChange={(e) =>
                      handlePrevProjectFieldChange(
                        "projectRole",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="technologies">Technologies:</label>
                  <input
                    type="text"
                    className="modal-input"
                    id="technologies"
                    value={editedPrevProject.technologies}
                    onChange={(e) =>
                      handlePrevProjectFieldChange(
                        "technologies",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="keyResponsibilities">
                    Key Responsibilities:
                  </label>
                  <textarea
                    id="keyResponsibilities"
                    value={editedPrevProject.keyResponsibilities}
                    onChange={(e) =>
                      handlePrevProjectFieldChange(
                        "keyResponsibilities",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="modal-buttons">
                <button
                  className="modal-button"
                  onClick={handleUpdatePrevProject}
                >
                  Save
                </button>
                <button
                  className="cancel modal-button"
                  onClick={() => setIsEditingPrevProject(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="char-count">
                Characters remaining:{" "}
                {maxKeyRolesCharLimit -
                  editedPrevProject.keyResponsibilities.length}
              </div>
            </div>
          </div>
        )}
        {isConfirmDeleteOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Are you sure you want to delete this project?</h2>
              <div className="modal-buttons"></div>
              <button className="modal-button" onClick={handleConfirmDelete}>
                Yes
              </button>
              <button
                className="cancel modal-button"
                onClick={closeConfirmationPopup}
              >
                No
              </button>
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
      {employeeData && (
        <div style={{ display: "none" }}>
          <EmployeeResume employeeData={employeeData} />
        </div>
      )}
      <Popup
        open={isNominatePopupOpen}
        closeOnEscape={false}
        closeOnDocumentClick={false}
      >
        <NominatePopup
          userDetail={userDetail}
          handleClose={closehandleNominatePopup}
          selectedRR={selectedRR}
          setSelectedRR={setSelectedRR}
          handleSubmit={handleOpenNominateConfirmation}
        />
      </Popup>
      <Popup
        open={confirmationPopup}
        onClose={closeConfirmationNominatePopup}
        closeOnDocumentClick={false}
      >
        <div className="modal-overlay">
          <div className="modal-content auto-width max-width-400 pb-15">
            <div>
              Are you certain about nominating{" "}
              <span style={{ fontWeight: 600 }}>
                {userDetail?.employeeName}
              </span>{" "}
              for the{" "}
              <span
                style={{ fontWeight: 600 }}
              >{`RR-${selectedRR?.rrNumber}`}</span>
              ?
            </div>

            <div className="modal-buttons-wrapper">
              {isLoading && (
                <span className="loader">
                  <img src={loader} alt="Loading" />
                </span>
              )}
              <button
                className="modal-button cancel"
                onClick={closeConfirmationNominatePopup}
              >
                Cancel
              </button>
              <button className={`modal-button`} onClick={handleNomination}>
                Yes, Nominate
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default EmployeeProfileComponent;
