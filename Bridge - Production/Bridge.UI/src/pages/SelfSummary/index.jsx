import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu/index";
import { fetchEmployeeProfile } from "../../redux/actions/employeeActions";
import ProfileHeader from "../profile/ProfileHeader";
import CertificationBlock from "../profile/CertificationBlock";
import SkillsBlock from "../profile/SkillsBlock";
import SelfSummaryForm from "./SelfSummaryForm";
import loaderImage from "../../resources/Loader.svg";
import PreReleaseTask from "./PreReleaseTask";
import * as CONST from "./constant";
import { Manager } from "../../common/constants";
import {
  DEFAULT_ERROR_MESSAGE,
  TOASTER_SUCCESS,
  TOASTER_ERROR,
} from "../../common/constants";
import "../../components/home/home.scss";
import "../dashboard/dashboard.scss";
import "./index.scss";
import Toast from "../../components/Toast";
import { postSelfSummary } from "../../redux/actions/managerActions";

const SelfSummary = () => {
  const employeeData = useSelector((state) => state.employee.employeeProfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);
  const [activeSubmit, setActiveSubmit] = useState(false);
  const [toasterInfo, setToasterInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [selfSummaryDetails, setSelfSummaryDetails] = useState({
    keyProfessionalAchievements: "",
    contributionCurrentProject: "",
    threeSkillsIdentified: "",
    areasForImprovement: "",
    nextRoleAspiration: "",
    techStackPreference: "",
    geographyPreference: "",
    workInShift: null,
    skillMatrixUpdate: null,
    updatedProfile: null,
    longLeave: null,
  });
  const [clearForm, setClearForm] = useState(false);

  useEffect(() => {
    if (user?.employeeId) {
      dispatch(fetchEmployeeProfile(user?.employeeId));
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (
      selfSummaryDetails?.keyProfessionalAchievements &&
      selfSummaryDetails?.contributionCurrentProject &&
      selfSummaryDetails?.threeSkillsIdentified &&
      selfSummaryDetails?.areasForImprovement &&
      selfSummaryDetails?.nextRoleAspiration &&
      selfSummaryDetails?.techStackPreference &&
      selfSummaryDetails?.geographyPreference &&
      selfSummaryDetails?.workInShift !== null &&
      selfSummaryDetails?.updatedProfile !== null &&
      selfSummaryDetails?.longLeave !== null
    ) {
      setActiveSubmit(true);
    } else {
      setActiveSubmit(false);
    }
  }, [selfSummaryDetails]);

  useEffect(() => {
    if (toasterInfo.show) {
      if (toasterInfo?.type === TOASTER_SUCCESS) {
        setTimeout(() => {
          if (user?.role === Manager) {
            navigate("/m-rrs");
          } else {
            navigate("/home");
          }
        }, 3000);
      }
      setTimeout(() => {
        handleCloseToast();
      }, [3000]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasterInfo?.show]);

  const handleSubmitSelfSummary = async () => {
    try {
      const requestData = {
        employeeId: employeeData?.emidsUniqueId,
        employeeSummary: JSON.stringify(selfSummaryDetails),
        managerSummary: null,
        managerID: null,
      };
      const response = await postSelfSummary(requestData);
      if (response) {
        setToasterInfo({
          show: true,
          type: TOASTER_SUCCESS,
          message: CONST.SELF_SUMMARY_CONFIRMATION_TOAST_MESSAGE,
        });
      }
    } catch (error) {
      setToasterInfo({
        show: true,
        type: TOASTER_ERROR,
        message: DEFAULT_ERROR_MESSAGE,
      });
    }
  };

  const handleCloseToast = () => {
    setToasterInfo({
      show: false,
      type: "",
      message: "",
    });
  };

  const handleClearForm = () => {
    setClearForm(true);
    setSelfSummaryDetails({
      keyProfessionalAchievements: "",
      contributionCurrentProject: "",
      threeSkillsIdentified: "",
      areasForImprovement: "",
      nextRoleAspiration: "",
      techStackPreference: "",
      geographyPreference: "",
      workInShift: null,
      skillMatrixUpdate: null,
      updatedProfile: null,
      longLeave: null,
    });
    setTimeout(() => {
      setClearForm(false);
    }, 500);
  };

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu />
          </div>
          <div className="right-panel">
            <h1>{CONST.HEADER_PAGE}</h1>
            {employeeData && !loading && (
              <div className="self-summary-container">
                <ProfileHeader
                  employeeData={employeeData}
                  className="header-pro"
                />
                <SkillsBlock
                  employeeData={employeeData}
                  className="skills-wrapper-summary"
                />
                {employeeData?.skillMatrix?.certifications && (
                  <CertificationBlock employeeData={employeeData} />
                )}
                <SelfSummaryForm
                  selfSummaryDetails={selfSummaryDetails}
                  clearForm={clearForm}
                  setSelfSummaryDetails={setSelfSummaryDetails}
                />
                <PreReleaseTask
                  selfSummaryDetails={selfSummaryDetails}
                  clearForm={clearForm}
                  setSelfSummaryDetails={setSelfSummaryDetails}
                />
                <div className="button-wrapper">
                  <button
                    className="cancel modal-button"
                    onClick={handleClearForm}
                  >
                    Clear Form
                  </button>
                  <button
                    className={`modal-button ${activeSubmit ? "" : "disabled"}`}
                    onClick={handleSubmitSelfSummary}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <span className="loader table-loader">
                <img src={loaderImage} alt="Loading" className="loader-img" />
              </span>
            )}
          </div>
        </div>
      </div>
      {toasterInfo?.show && (
        <Toast
          message={toasterInfo?.message}
          type={toasterInfo?.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default SelfSummary;
