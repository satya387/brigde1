import React, { useState, useEffect } from "react";
import * as FileSaver from "file-saver";
import Select from "react-select";
import Header from "../../../components/header/header";
import LeftMenu from "../../../components/leftmenu";
import DateSelector from "./DateSelector";
import {
  fetchRRProgressReport,
  fetchUsageReport,
} from "../../../redux/actions/rrActions";
import loaderImage from "../../../resources/Loader.svg";
import EmptyComponent from "../../../components/empty/emptyComponent";
import {
  convertUTCtoIST,
  exportToCSV,
  getAuthToken,
  getUserName,
} from "../../../common/commonMethods";
import RRProgressReport from "./RRProgressReport";
import UsageReport from "./UsageReport";
import {
  USAGE_REPORT_NAME,
  RR_PROGRESS_REPORT_NAME,
  styles,
} from "../../../common/constants";
import * as CONST from "./constant";
import "./Report.scss";
import Pagination from "../../../components/pagination";
import { FETCH_DYNAMIC_REPORTS } from "../../../config";

const Report = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState(CONST.REPORT_OPTION[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages = Math.ceil(reportData?.length / itemsPerPage);

  // Get the items to display for the current page
  const itemsToShow = reportData?.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setEndDate(null);
    setStartDate(null);
    setReportData(null);
  }, [reportType]);

  const handleView = async () => {
    if (reportType === CONST.REPORT_OPTION[0]) {
      fetchUsageReportData();
    } else {
      fetchRRProgressData();
    }
  };

  const fetchUsageReportData = async () => {
    try {
      setLoading(true);
      const response = await fetchUsageReport({
        fromDate: convertUTCtoIST(startDate?.toISOString()),
        toDate: convertUTCtoIST(endDate?.toISOString()),
      });
      setReportData(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchRRProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetchRRProgressReport({
        fromDate: convertUTCtoIST(startDate?.toISOString()),
        toDate: convertUTCtoIST(endDate?.toISOString()),
      });
      setReportData(response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e) => {
    if (reportType === CONST.REPORT_OPTION[0]) {
      exportToCSV(reportData, USAGE_REPORT_NAME);
    } else {
      exportToCSV(reportData, RR_PROGRESS_REPORT_NAME);
    }
  };

  const handleOtherReportsDownload = async () => {
    try {
      setLoading(true);
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await fetch(FETCH_DYNAMIC_REPORTS, {
        method: "POST",
        headers: {
          // Adjust headers based on your API requirements
          "Content-Type": "application/json",
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
        // If your API requires any data in the request body, include it here
        body: JSON.stringify({
          reportName: reportType?.value,
          reportType: CONST.REPORT_TYPE,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a download link and trigger a click to download the file
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([blob]));
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      link.download = `${reportType?.value}_${day}/${month}/${year}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashcontainer">
      <Header />
      <div className="home-container">
        <div className="left-panel">
          <LeftMenu />
        </div>
        <div className="right-panel">
          <div className="report-select">
            <Select
              className="basic-single"
              classNamePrefix="select"
              name="reportName"
              options={CONST.REPORT_OPTION}
              onChange={setReportType}
              value={reportType}
              placeholder={CONST.REPORT_TYPE_PLACEHOLDER}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#533EED",
                },
              })}
              styles={styles}
            />
          </div>
          {(reportType === CONST.REPORT_OPTION[0] ||
            reportType === CONST.REPORT_OPTION[1]) && (
            <DateSelector
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleView={handleView}
              headerTitle={
                reportType === CONST.REPORT_OPTION[0]
                  ? CONST?.USAGE_REPORT_HEADER
                  : CONST?.RR_PROGRESS_REPORT_HEADER
              }
            />
          )}
          {reportType !== CONST.REPORT_OPTION[0] &&
            reportType !== CONST.REPORT_OPTION[1] && (
              <div className="download-button-wrapper">
                <button
                  className={`blue-btn show view`}
                  onClick={handleOtherReportsDownload}
                >
                  {loading ? CONST.DOWNLOADING : CONST.DOWNLOAD_BUTTON}
                </button>
              </div>
            )}
          {(reportType === CONST.REPORT_OPTION[0] ||
            reportType === CONST.REPORT_OPTION[1]) && (
            <div className="table-wrapper">
              {loading && (
                <span className="loader table-loader">
                  <img src={loaderImage} alt="Loading" className="loader-img" />
                </span>
              )}
              {!loading && reportData && reportData?.length === 0 && (
                <EmptyComponent />
              )}
              {!loading && reportData && reportData?.length && (
                <>
                  <div className="download-button-wrapper">
                    <button
                      className={`blue-btn btn show view`}
                      onClick={(e) => handleDownload(e)}
                    >
                      {CONST.DOWNLOAD_BUTTON}
                    </button>
                  </div>
                  <div className="scrollable-div">
                    <div className="scrollable-content">
                      {reportType === CONST.REPORT_OPTION[1] && (
                        <RRProgressReport data={itemsToShow} />
                      )}
                      {reportType === CONST.REPORT_OPTION[0] && (
                        <UsageReport data={itemsToShow} />
                      )}
                    </div>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
