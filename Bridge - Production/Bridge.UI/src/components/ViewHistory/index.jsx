import React, { useEffect, useState } from "react";
import { NO_HISTORY_MSSG, VIEW_HISTORY } from "./const";
import loaderImage from "../../resources/Loader.svg";
import { getFormattedDate, getAging } from "../../common/commonMethods";
import { getCommonMethod } from "../../redux/actions/jobActions";
import { EMPLOYEE_HISTORY, RR_HISTORY } from "../../config";
import "../../components/home/home.scss";
import "./index.scss";
import EmptyComponent from "../empty/emptyComponent";
import ProfileHeader from "../../pages/profile/ProfileHeader";
import PopupUserProfile from "../PopupUserProfile";

const ViewHistory = ({ closePopup, details, rrHistory = true }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (details?.rrId && rrHistory) {
      fetchRRHistory();
    } else if (details?.employeeId && !rrHistory) {
      fetchEmployeeHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, rrHistory]);

  useEffect(() => {}, []);

  const fetchRRHistory = async () => {
    try {
      setLoading(true);
      const response = await getCommonMethod(`${RR_HISTORY}`, {
        rrId: details?.rrId,
        historyType: 1,
      });
      setData(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeHistory = async () => {
    try {
      setLoading(true);
      const response = await getCommonMethod(`${EMPLOYEE_HISTORY}`, {
        employeeId: details?.employeeId,
      });
      setData(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay modal-interview-view-history">
      <div
        className="modal-content modal-content-view-history"
        id={"view-history-container"}
      >
        <div className="history-rr-details">
          <div className="modal-header modal-header-view-history">
            <h2>{VIEW_HISTORY}</h2>
          </div>

          {rrHistory && (
            <div className="modal-cont-view-history">
              <div className="rr-heading">{details?.rrNumber}</div>
              <div className="rr-container">
                <div className="auto-width rr-detail-wrap">
                  <span className="rr-detail">{details?.projectName}</span>
                  <span className="seprator"></span>
                  <span className="rr-detail">{`${
                    details?.designation || "N/A"
                  }`}</span>
                  <span className="seprator"></span>
                  <span className="rr-detail">{`Skills: ${
                    details?.primarySkill || "N/A"
                  }`}</span>
                </div>
                <div className="auto-width rr-detail-wrap">
                  <span className="rr-detail">{`Posted On: ${
                    getFormattedDate(details) || "N/A"
                  }`}</span>
                  <span className="seprator"></span>
                  <span className="rr-detail">{`Aging: ${
                    `${getAging(details)} Days` || "N/A"
                  }`}</span>
                </div>
              </div>
            </div>
          )}

          {!rrHistory && (
            <PopupUserProfile
              employeeDetails={details}
              className={"modal-cont-history-pro"}
              showRRDetails={false}
            />
          )}
        </div>

        <div
          className="modal-cont-content-wrapper"
          id={"content-wrapper-history"}
        >
          {isLoading && data?.length === 0 && (
            <div className="loader-cont">
              <img src={loaderImage} alt="Loading" />
            </div>
          )}
          {!isLoading && data?.length === 0 && (
            <EmptyComponent message={NO_HISTORY_MSSG} />
          )}
          {!isLoading && data?.length > 0 && (
            <div className="view-history-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Action</th>
                    <th>Done By</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => {
                    return (
                      <tr key={item?.rrNumber}>
                        {/* <td>{item?.actionPerformedDate}</td> */}
                        <td>
                          {item?.actionPerformedDate?.replace(" ", " at ")}
                        </td>
                        <td>{item?.actualMessage}</td>
                        <td>{item?.employeeName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="history-modal-button" id={"history-modal-button"}>
          {
            <button className={`cancel modal-button mr-5`} onClick={closePopup}>
              Close
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;
