import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Popup from "reactjs-popup";
import { APPROVE_TALENT_HEADER } from "../../../common/constants";
import Header from "../../../components/header/header";
import LeftMenu from "../../../components/leftmenu";
import ApproveTalentTable from "./ApproveTalentTable";
import ApproveTalentPopup from "./ApproveTalentPopup";
import {
  approveCandidateAllocation,
  fetchAllocationDataByWFM,
} from "../../../redux/actions/wfmActions";
import * as GLOBAL_CONST from "../../../common/constants";
import {
  EMAIL_DATA,
  WFM_TEAM_EMAIL_ADDRESS,
  GLOBAL_RMG_EMAIL_ADDRESS,
} from "../../../common/emailConstants";
import {
  convertUTCtoIST,
  sendEmail,
  sendChat,
} from "../../../common/commonMethods";
import loaderImage from "../../../resources/Loader.svg";
import "./index.scss";
import Toast from "../../../components/Toast";
import { useSelector } from "react-redux";
import { fetchRRs } from "../../../redux/actions/rrActions";

const ApproveTalent = () => {
  const dispatch = useDispatch();
  const [approvePopup, setApprovePopup] = useState(false);
  const [empData, setEmpData] = useState(null);
  const rrs = useSelector((state) => state.rr.rrs) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [toasterInfo, setToasterInfo] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approvalDate: null,
    approvalPercentage: 0,
    isRampupProject: false,
  });
  const approveTalentsData =
    useSelector((state) => state.wfm.allocationRequest) || [];

  useEffect(() => {
    if (toasterInfo.show) {
      setTimeout(() => {
        handleCloseToast();
      }, [7500]);
    }
  }, [toasterInfo?.show]);

  const handleApproveClick = (empData) => {
    dispatch(fetchRRs(empData?.rrId, empData?.employeeId));
    setEmpData(empData);
    setApprovePopup(true);
  };

  const closeApprovalPopup = () => {
    setApprovePopup(false);
    // setEmpData(null);
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(false);
    setApprovalData({
      approvalDate: null,
      approvalPercentage: 0,
      isRampupProject: false,
    });
  };

  const handleWFMApproval = (
    wfmApprovalDate,
    wfmApprovalPercentage,
    approvalData,
    isRampupProject
  ) => {
    setApprovalData({
      approvalDate: wfmApprovalDate,
      approvalPercentage: wfmApprovalPercentage?.value,
      isRampupProject: isRampupProject,
    });
    closeApprovalPopup();
    setConfirmationPopup(true);
  };

  const handleCloseToast = () => {
    setToasterInfo({
      show: false,
      type: "",
      message: "",
    });
  };

  const confirmWFMApproval = async () => {
    try {
      setIsLoading(true);
      let ISTApprovalDate = new Date(approvalData?.approvalDate);
      ISTApprovalDate = convertUTCtoIST(ISTApprovalDate?.toISOString());
      const requestData = {
        employeeId: empData?.employeeId,
        rrId: empData?.rrId,
        allocationStartDate: empData?.allocationStartDate,
        additionalComments: empData?.additionalComments,
        allocationPercentage: empData?.allocationPercentage,
        wfmAllocationPercentage: approvalData?.approvalPercentage,
        wfmAllocationStartDate: ISTApprovalDate,
        requesterID: empData?.requesterID,
        status: GLOBAL_CONST.OPPORTUNITY_STATUS_ENUM.Earmarked,
        isRampUpProject: approvalData?.isRampupProject || false,
      };
      const response = await approveCandidateAllocation(requestData);
      if (response) {
        var dateObject = new Date(approvalData?.approvalDate);
        const emailBody = EMAIL_DATA?.WFM_ALLOCATION_MANAGER?.emailBody
          ?.replace("<MANAGER_NAME>", empData?.requesterName)
          ?.replace("<EMPLOYEE_NAME>", empData?.employeeName)
          ?.replace("<RR_NUMBER>", empData?.rrNumber)
          ?.replace(
            "<ALLOCATION_DATE>",
            `${dateObject?.getDate()} ${dateObject.toLocaleString("en-US", {
              month: "short",
            })}, ${dateObject?.getFullYear()}`
          )
          ?.replace(
            "<ALLOCATION_PERCENTAGE>",
            approvalData?.approvalPercentage
          );
        const emailSubject =
          EMAIL_DATA?.WFM_ALLOCATION_MANAGER?.emailSubject?.replace(
            "<RR_NUMBER>",
            empData?.rrNumber
          );
        const toRecipients = [];
        if (
          rrs?.resourceRequestDetails?.requesterMailId !==
          rrs?.resourceRequestDetails?.projectManagerMailID
        ) {
          toRecipients.push(
            rrs?.resourceRequestDetails?.requesterMailId,
            rrs?.resourceRequestDetails?.projectManagerMailID
          );
        } else {
          toRecipients.push(rrs?.resourceRequestDetails?.requesterMailId);
        }
        const ccRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        await sendEmail(emailBody, emailSubject, toRecipients, ccRecipients);
        await sendChat(
          emailBody?.replaceAll("<br>", ""),
          rrs?.resourceRequestDetails?.requesterMailId
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
            <p>Please allocate ${empData?.employeeName} against ${
          empData?.rrNumber
        } effective ${ISTApprovalDate.split("T")[0]} with ${
          approvalData?.approvalPercentage
        }% allocation. Details Given below Format:</p>
            <table>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Project Name</th>
                <th>Resource Type</th>
                <th>Allocation %</th>
                <th>Assign Date</th>
                <th>RR Number</th>
              </tr>
              <tr>
                <td>${empData?.employeeId}</td>
                <td>${empData?.employeeName}</td>
                <td>${`${empData?.projectName}${
                  approvalData?.isRampupProject ? " (Ramp-up)" : ""
                }`}</td>
                <td>${
                  approvalData?.isRampupProject
                    ? "<<RESOURCE_TYPE>>"
                    : "Billable"
                }</td>
                <td>${approvalData?.approvalPercentage}</td>
                <td><<ASSIGN_DATE>></td>
                <td>${empData?.rrNumber}</td>
              </tr>
            </table>
            <p>Thanking You,</p>
            <p>WFM Team</p>
          </body>
        </html>
      `;
        const rmgEmailSubject =
          EMAIL_DATA?.WFM_ALLOCATION_GLOBAL_RMG?.emailSubject?.replace(
            "<RR_NUMBER>",
            empData?.rrNumber
          );

        const toRMG = [GLOBAL_RMG_EMAIL_ADDRESS];
        const rmgCCRecipients = [WFM_TEAM_EMAIL_ADDRESS];
        if (approvalData?.isRampupProject) {
          let rmgNonBillableEmail = rmgEmailBody
            ?.replace(
              "<<ASSIGN_DATE>>",
              new Date()?.toISOString().split("T")[0]
            )
            ?.replace("<<RESOURCE_TYPE>>", "Non-Billable");
          await sendEmail(
            rmgNonBillableEmail,
            rmgEmailSubject,
            toRMG,
            rmgCCRecipients
          );
          const newAssignDate = new Date(approvalData?.approvalDate);
          let rmgBillableEmail = rmgEmailBody
            ?.replace(
              "<<ASSIGN_DATE>>",
              new Date(newAssignDate.getTime() - 24 * 60 * 60 * 1000)
                ?.toISOString()
                .split("T")[0]
            )
            ?.replace("<<RESOURCE_TYPE>>", "Billable");
          await sendEmail(
            rmgBillableEmail,
            rmgEmailSubject,
            toRMG,
            rmgCCRecipients
          );
        } else {
          let rmgEmailNewBody = rmgEmailBody?.replace(
            "<<ASSIGN_DATE>>",
            ISTApprovalDate?.split("T")[0]
          );

          await sendEmail(
            rmgEmailNewBody,
            rmgEmailSubject,
            toRMG,
            rmgCCRecipients
          );
        }
      }

      setTimeout(() => {
        closeConfirmationPopup();
      }, 300);
      dispatch(fetchAllocationDataByWFM());
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_SUCCESS,
        message: `You have successfully approved ${empData?.rrNumber} of ${empData?.requesterName}'s request for ${empData?.projectName}`,
      });
    } catch (error) {
      closeConfirmationPopup();
      setToasterInfo({
        show: true,
        type: GLOBAL_CONST.TOASTER_ERROR,
        message: `${error?.response?.data[0]?.errorMessage}`
          ?.replace("<q>", `"`)
          ?.replace("</q>", `"`),
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
              {APPROVE_TALENT_HEADER} ({approveTalentsData?.length})
            </h1>
            <ApproveTalentTable
              handleApproveClick={handleApproveClick}
              fetchAction={fetchAllocationDataByWFM}
              dataSelector={(state) => state.wfm.allocationRequest}
            />
          </div>
        </div>
      </div>
      <Popup
        open={approvePopup}
        onClose={closeApprovalPopup}
        closeOnDocumentClick={false}
      >
        <ApproveTalentPopup
          employeeDetails={empData}
          onClose={closeApprovalPopup}
          handleWFMApproval={handleWFMApproval}
          isLoading={isLoading}
        />
      </Popup>
      <Popup
        open={confirmationPopup}
        onClose={closeApprovalPopup}
        closeOnDocumentClick={false}
      >
        <div className="modal-overlay">
          <div className="modal-content auto-width max-width-400 pb-15">
            <div>
              Are you certain about approving{" "}
              <span style={{ fontWeight: 600 }}>{empData?.employeeName}'s</span>{" "}
              allocation to{" "}
              <span style={{ fontWeight: 600 }}>{empData?.projectName}</span>?
            </div>
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
              <button className={`modal-button`} onClick={confirmWFMApproval}>
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

export default ApproveTalent;
