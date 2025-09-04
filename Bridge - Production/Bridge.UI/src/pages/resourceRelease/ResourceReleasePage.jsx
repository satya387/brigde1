import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  clearManagerReleaseFilters,
  getManagerResource,
  releaseResource,
} from "../../redux/actions/managerActions";
import "./index.scss";
import loaderImage from "../../resources/Loader.svg";
import Popup from "reactjs-popup";
import ResourceRelease from "../../components/ResourceRelease";
import ResourceFeedback from "../../components/ResourceFeedback";
import Toaster from "../../components/toaster";
import * as CONST from "./constant";
import { OPPORTUNITY_STATUS_ENUM } from "../../common/constants";
import { convertUTCtoIST, isEmpty } from "../../common/commonMethods";
import ManagerReleaseTable from "./ManagerReleaseTable";
import ClearFilters from "../../components/ClearFilters";
import ViewRejectCommentPopup from "../../components/ViewRejectComments/ViewRejectCommentPopup";

const ResourceReleasePage = () => {
  const employeeId = useSelector((state) => state.user.employeeId);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [openReleasePopup, setOpenReleasePopup] = useState(false);
  const [empDetails, setEmpDetails] = useState(null);
  const managerResources =
    useSelector((state) => state.manager.managerResources) || [];
  const filterManagerRelease = useSelector(
    (state) => state.manager.filterManagerRelease
  );
  const [isManager, setIsManager] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [isEditRelease, setIsEditRelease] = useState(false);
  const [withdrawRelease, setWithdrawRelease] = useState(false);
  const [isReleasePopupVisible, setIsReleasePopupVisible] = useState(false);
  const [releaseNoteManager, setReleaseNoteManager] = useState(false);
  const [viewRejectComments, setViewRejectComments] = useState(false);

  useEffect(() => {
    const fetchUserRole = () => {
      setTimeout(() => {
        const userRole = "employee";
        setIsManager(userRole === "manager");
      }, 1000);
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    dispatch(getManagerResource(employeeId));
    setIsLoading(false);
  }, [dispatch, employeeId]);

  const handleOpenReleasePopup = (empData, isEdit) => {
    setIsEditRelease(isEdit);
    setEmpDetails(empData);
    setOpenReleasePopup(true);
  };

  const handleCloseReleasePopup = () => {
    setWithdrawRelease(false);
    setOpenReleasePopup(false);
    setIsEditRelease(false);
    setEmpDetails(null);
  };

  const handleWithdraw = (empData) => {
    setWithdrawRelease(true);
    setEmpDetails(empData);
    setOpenReleasePopup(true);
  };

  const handleNotesClick = (empData) => {
    setEmpDetails(empData);
    setIsReleasePopupVisible(true);
  };

  const handleCloseMangerReleaseNotes = () => {
    setIsReleasePopupVisible(false);
    setReleaseNoteManager(false);
  };

  const handleRejectCommentsClick = (empData) => {
    debugger
    console.log({ empData })
    setEmpDetails(empData);
    setViewRejectComments(true);
  };

  const handleCloseRejectComments = () => {
    setViewRejectComments(false);
  };

  const handleRelease = async (
    empId,
    releaseDate,
    releaseReason,
    additionalComments,
    informedEmployee,
    status
  ) => {
    try {
      setIsLoading(true);

      const requestBody = {
        employeeId: empId,
        availableStatus: status,
        // remove this
        effectiveTill: convertUTCtoIST(releaseDate?.toISOString()),
        wfmSpoc: null,
        createdBy: null,
        modifiedBy: null,
        wfmEmployeeId: null,
        managerApproveOrWithdrawDate: convertUTCtoIST(
          releaseDate?.toISOString()
        ),
        releaseReason: releaseReason,
        informedEmployee: informedEmployee,
        wfmSuggestedDate: null,
        managerId: employeeId,
        comments: additionalComments,
      };
      const res = await releaseResource(requestBody);
      if (res) {
        handleCloseReleasePopup();
        setToasterMessage(
          status === OPPORTUNITY_STATUS_ENUM?.ReleasedRequested
            ? CONST.RELEASE_MESSAGE
            : CONST.WITHDRAWAL_MESSAGE
        );
        setToasterType("success");
        setShowToaster(true);
        setTimeout(() => {
          setShowToaster(false);
          dispatch(getManagerResource(employeeId));
        }, 100);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleActions = (label, employeeDetails) => {
    switch (label) {
      case "Release Notes":
        setReleaseNoteManager(true);
        handleNotesClick(employeeDetails);
        return;
      case "View Reject Comments":
        handleRejectCommentsClick(employeeDetails);
        return;
      case "Resource Notes":
        handleNotesClick(employeeDetails);
        return;
      case "Withdraw":
        handleWithdraw(employeeDetails);
        return;
      case "Edit":
        handleOpenReleasePopup(employeeDetails, true);
        return;
      case "Resource Release":
        handleOpenReleasePopup(employeeDetails, false);
        return;
      default:
        return;
    }
  };

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu isManager={!isManager} />
          </div>
          <div className="right-panel">
            <div className="page-header">
              <h1>Resource Release ({managerResources?.length})</h1>
              <div className="filters">
                {!isEmpty(filterManagerRelease) && (
                  <ClearFilters
                    clearAction={clearManagerReleaseFilters}
                    fetchAction={getManagerResource}
                    params={employeeId}
                  />
                )}
              </div>
            </div>
            {managerResources && isLoading ? (
              <div>
                <img src={loaderImage} alt="Loading" />
              </div>
            ) : (
              <ManagerReleaseTable
                handleActions={handleActions}
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
      <Popup
        open={openReleasePopup}
        onClose={handleCloseReleasePopup}
        closeOnDocumentClick={false}
      >
        <ResourceRelease
          isLoading={isLoading}
          employeeDetails={empDetails}
          onClose={handleCloseReleasePopup}
          isWithdraw={withdrawRelease}
          isEditRelease={isEditRelease}
          handleSubmitOperations={handleRelease}
        />
      </Popup>
      <Popup
        open={isReleasePopupVisible}
        onClose={handleCloseMangerReleaseNotes}
        closeOnDocumentClick={false}
        closeOnEscape={false}
      >
        <ResourceFeedback
          releaseNoteManager={releaseNoteManager}
          employeeDetails={empDetails}
          onClose={handleCloseMangerReleaseNotes}
        />
      </Popup>
      <ViewRejectCommentPopup
        confirmationPopup={viewRejectComments}
        handleConfirmationAction={handleCloseRejectComments}
        confirmationMessage={empDetails?.wfmRejectComment ? empDetails?.wfmRejectComment : "No comments added"}
      />
      {toasterMessage && showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
    </>
  );
};

export default ResourceReleasePage;
