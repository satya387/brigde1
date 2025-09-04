import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useDispatch } from "react-redux";
import Header from "../../../components/header/header";
import LeftMenu from "../../../components/leftmenu";
import TalentReleaseTable from "./TalentReleaseTable";
import ResourceApprovalPopup from "./ReleaseApprovalPopup";
import { fetchResourceReleaseDataByWFM } from "../../../redux/actions/wfmActions";
import loaderImage from "../../../resources/Loader.svg";
import {
  convertUTCtoIST,
  sendEmail,
  sendChat,
} from "../../../common/commonMethods";
import * as GLOBAL_CONST from "../../../common/constants";
import "./index.scss";
import { releaseResource } from "../../../redux/actions/managerActions";
import Toast from "../../../components/Toast";
import {
  WFM_RESOURCE_RELEASE_APPROVAL_EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
  WFM_RESOURCE_RELEASE_WITHDRAWN_EMAIL_DATA,
  GLOBAL_RMG_EMAIL_ADDRESS,
  RELEASE_REJECTION_EMAIL_DATA,
} from "../../../common/emailConstants";
import { useSelector } from "react-redux";
import { fetchEmployeeProfile } from "../../../redux/actions/employeeActions";

const ResourceReleaseRequest = () => {
  const dispatch = useDispatch();
  const [approvePopup, setApprovePopup] = useState(false);
  const [empData, setEmpData] = useState(null);
  const [approvalData, setapprovalData] = useState(null);
  const employeeProfile =
    useSelector((state) => state.employee.employeeProfile) || [];
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [toasterInfo, setToasterInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [releaseApprovalData, setReleaseApprovalData] = useState({
    releaseApprovalDate: null,
    wfmSPOC: null,
  });
  const resourceReleaseRequestData =
    useSelector((state) => state.wfm.releaseRequest) || [];

  useEffect(() => {
    if (toasterInfo.show) {
      setTimeout(() => {
        handleCloseToast();
      }, [7500]);
    }
  }, [toasterInfo?.show]);

  useEffect(() => {
    if (approvalData?.rrRequesterId) {
      dispatch(fetchEmployeeProfile(approvalData?.rrRequesterId));
    }
  }, [dispatch, approvalData?.rrRequesterId]);

  const handleApproveClick = (empData) => {
    setEmpData(empData);
    setApprovePopup(true);
  };

  const closeApprovalPopup = () => {
    setApprovePopup(false);
    // setEmpData(null);
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(false);
    setReleaseApprovalData({
      releaseApprovalDate: null,
      wfmSPOC: null,
    });
  };

  const handleRelease = (wfmApprovalDate, wfmSPOC, approvalData) => {
    setapprovalData(approvalData);
    setReleaseApprovalData({
      releaseApprovalDate: wfmApprovalDate,
      wfmSPOC: wfmSPOC,
    });
    closeApprovalPopup();
    setConfirmationPopup(true);
  };

  const handleRejectionRelease = async (
    wfmApprovalDate,
    wfmSPOC,
    approvalData,
    releaseComment
  ) => {
    try {
      setIsLoading(true);
      const requestData = {
        employeeId: empData?.employeeId,
        availableStatus: GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRejected,
        effectiveTill: null,
        wfmSpoc: wfmSPOC?.employeeName,
        createdBy: null,
        modifiedBy: user?.employeeId,
        wfmEmployeeId: wfmSPOC?.employeeID,
        managerApproveOrWithdrawDate: empData?.plannedReleaseDate,
        releaseReason: empData?.releaseReason,
        informedEmployee:
          empData?.talentInformed === "True" || empData?.talentInformed === true
            ? true
            : false,
        wfmSuggestedDate: null,
        WfmRejectComment: releaseComment,
      };
      const response = await releaseResource(requestData);
      closeConfirmationPopup();
      dispatch(fetchResourceReleaseDataByWFM());
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_SUCCESS,
        message: `You have successfully rejected release request of ${empData?.employeeName} from ${empData?.projectName}`,
      });

      const emailBody =
        RELEASE_REJECTION_EMAIL_DATA?.EMPLOYEE_MAIL_BODY_TO_MANAGER?.emailBody
          ?.replace("<MANAGER_NAME>", empData?.reportingManagerName)
          ?.replace("<EMP_NAME>", empData?.employeeName)
          ?.replace("<REJECTION_COMMENTS>", releaseComment);

      const emailSubject =
        RELEASE_REJECTION_EMAIL_DATA?.EMPLOYEE_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
          "<EMP_NAME>",
          empData?.employeeName
        );
      const toRecipients = [employeeProfile.emailId];
      const ccRecipients = [""];
      await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
    } catch (error) {
    } finally {
      closeApprovalPopup();
    }
  };

  const handleCloseToast = () => {
    setToasterInfo({
      show: false,
      type: "",
      message: "",
    });
  };

  const confirmReleaseApproval = async () => {
    try {
      setIsLoading(true);
      let ISTApprovalDate = new Date(releaseApprovalData?.releaseApprovalDate);
      ISTApprovalDate = convertUTCtoIST(ISTApprovalDate?.toISOString());
      const requestData = {
        employeeId: empData?.employeeId,
        availableStatus:
          empData?.status ===
          GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested
            ? GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.Released
            : GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.Withdrawn,
        effectiveTill: null,
        wfmSpoc: GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested
          ? releaseApprovalData?.wfmSPOC?.employeeName
          : null,
        createdBy: null,
        modifiedBy: user?.employeeId,
        wfmEmployeeId: releaseApprovalData?.wfmSPOC?.employeeID,
        managerApproveOrWithdrawDate: empData?.plannedReleaseDate,
        releaseReason: empData?.releaseReason,
        informedEmployee:
          empData?.talentInformed === "True" || empData?.talentInformed === true
            ? true
            : false,
        wfmSuggestedDate: GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM
          ?.ReleaseRequested
          ? ISTApprovalDate
          : null,
        WfmRejectComment: null,
      };
      const response = await releaseResource(requestData);
      closeConfirmationPopup();
      dispatch(fetchResourceReleaseDataByWFM());
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_SUCCESS,
        message: `You have successfully approved release request of ${empData?.employeeName} from ${empData?.projectName}`,
      });
      if (
        empData?.status ===
        GLOBAL_CONST?.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested
      ) {
        const emailBody =
          WFM_RESOURCE_RELEASE_APPROVAL_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailBody
            ?.replace("<MANAGER_NAME>", employeeProfile.employeeName)
            ?.replace("<CANDIDATE_NAME>", empData?.employeeName)
            ?.replace("<RELEASE_DATE>", ISTApprovalDate?.split("T")[0]);
        const emailSubject =
          WFM_RESOURCE_RELEASE_APPROVAL_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
            "<PROJECT_NAME>",
            empData?.projectName
          );
        const toRecipients = [employeeProfile.emailId];
        const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
        await sendChat(
          emailBody?.replaceAll("<br>", ""),
          employeeProfile?.emailId
        );
        const rmgEmailBody = `
        <html>
          <head>
            <style>
              table {
                font-family: Arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <p>Dear Global RMG,</p>
            <p>Please de-allocate ${empData?.employeeName} from ${
          empData?.projectName
        } effective ${
          ISTApprovalDate?.split("T")[0]
        }. Details are given in below format <P>
            <table>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Project Name</th>
                <th>EffectiveDate</th>
              </tr>
              <tr>
                <td>${empData?.employeeId}</td>
                <td>${empData?.employeeName}</td>
                <td>${empData?.projectName}</td>
                <td>${ISTApprovalDate?.split("T")[0]}</td>
              </tr>
            </table>
            <p>Thanking You,</p>
            <p>WFM Team</p>
          </body>
        </html>
      `;

        const rmgEmailSubject =
          WFM_RESOURCE_RELEASE_APPROVAL_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
            "<PROJECT_NAME>",
            empData?.projectName
          );

        const toRMG = [GLOBAL_RMG_EMAIL_ADDRESS];
        const rmgCCRecipients = [WFM_TEAM_EMAIL_ADDRESS];

        await sendEmail(rmgEmailBody, rmgEmailSubject, toRMG, rmgCCRecipients);
      } else {
        const emailBody =
          WFM_RESOURCE_RELEASE_WITHDRAWN_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailBody
            ?.replace("<MANAGER_NAME>", employeeProfile.employeeName)
            ?.replace("<CANDIDATE_NAME>", empData?.employeeName);
        const emailSubject =
          WFM_RESOURCE_RELEASE_WITHDRAWN_EMAIL_DATA?.WFM_MAIL_BODY_TO_MANAGER?.emailSubject?.replace(
            "<PROJECT_NAME>",
            empData?.projectName
          );
        const toRecipients = [employeeProfile.emailId];
        const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
        await sendChat(
          emailBody?.replaceAll("<br>", ""),
          employeeProfile?.emailId
        );
      }
    } catch (error) {
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_ERROR,
        message: GLOBAL_CONST.DEFAULT_ERROR_MESSAGE,
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1>
              Approve Talent Release ({resourceReleaseRequestData?.length})
            </h1>
            <TalentReleaseTable
              handleApproveClick={handleApproveClick}
              fetchAction={fetchResourceReleaseDataByWFM}
              dataSelector={(state) => state.wfm.releaseRequest}
            />
          </div>
        </div>
      </div>
      <Popup
        open={approvePopup}
        onClose={closeApprovalPopup}
        closeOnDocumentClick={false}
      >
        <ResourceApprovalPopup
          employeeDetails={empData}
          onClose={closeApprovalPopup}
          handleRelease={handleRelease}
          handleRejectionRelease={handleRejectionRelease}
        />
      </Popup>
      <Popup
        open={confirmationPopup}
        onClose={closeApprovalPopup}
        closeOnDocumentClick={false}
      >
        <div className="modal-overlay">
          <div className="modal-content auto-width max-width-400 pb-15">
            {empData?.status ===
              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.WithdrawRequested && (
              <div>
                Are you certain about approving the release withdrawl request of{" "}
                <span style={{ fontWeight: 600 }}>{empData?.employeeName}</span>{" "}
                from{" "}
                <span style={{ fontWeight: 600 }}>{empData?.projectName}</span>?
              </div>
            )}
            {empData?.status ===
              GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM?.ReleaseRequested && (
              <div>
                Are you certain about proposing a new release date for{" "}
                <span style={{ fontWeight: 600 }}>{empData?.employeeName}</span>{" "}
                from{" "}
                <span style={{ fontWeight: 600 }}>{empData?.projectName}</span>{" "}
                on{" "}
                <span style={{ fontWeight: 600 }}>
                  {`${new Date(
                    releaseApprovalData?.releaseApprovalDate
                  )?.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}, ${new Date(
                    releaseApprovalData?.releaseApprovalDate
                  )?.getFullYear()}`}
                </span>{" "}
                and approving this release request?
              </div>
            )}
            <div className="modal-buttons-wrapper">
              {isLoading && (
                <span className="loader">
                  <img src={loaderImage} alt="Loading" />
                </span>
              )}
              <button
                className="modal-button cancel"
                onClick={closeConfirmationPopup}
              >
                Cancel
              </button>
              <button
                className={`modal-button`}
                onClick={confirmReleaseApproval}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </Popup>
      {toasterInfo?.show && (
        <Toast
          message={`${toasterInfo?.message}`}
          type={toasterInfo?.type}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default ResourceReleaseRequest;
