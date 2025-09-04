/* eslint-disable array-callback-return */
import axios from "axios";
import * as ApiEndpoint from "../../config";
import { getAuthToken, getUserName } from "../../common/commonMethods";

export const fetchAllRRs = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(ApiEndpoint.RRS_API, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_ALL_RRS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ALL_RRS_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const fetchRRs = (id, Employeeid) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.GETRRS_API}`, {
        headers: {
          id: id, // Pass the id in the headers
          Bearer_Token: `${accessToken}`,
          username: userName,
          Employeeid: Employeeid
        },
      });
      dispatch({
        type: "FETCH_RRS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_RRS_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchRRProgressReport = async (requestData) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.post(
      `${ApiEndpoint.GET_RR_PROGRESS_REPORT}`,
      requestData,
      {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      }
    );
    let resp_arr = [];
    response?.data?.map((item) => {
      let resp_data = {
        "RR Number": item?.rrNumber,
        "Project Name": item?.projectName,
        "Role Requested": item?.roleRequested,
        "Primary Skills": item?.primarySkills,
        "Work Location": item?.workLocation,
        Experience: item?.experience,
        "Posted On": item?.postedOn,
        "#RRs Application Received": item?.rRsApplication?.total,
        "#RRs Withdrawn": item?.rRsApplication?.withdrawn,
        "#RRs Declined": item?.rRsApplication?.declined,
        "#RRs Active": item?.rRsApplication?.active,
        "#RRs Allocation Requested": item?.rRsApplication?.allocationRequested,
        "#RRs Meeting Scheduled": item?.rRsApplication?.scheduled,
        "#RR Meeting Reject": item?.rRsApplication?.dropped,
        "Reasons for Reject": item?.rRsApplication?.reasonForReject,
      };
      resp_arr?.push(resp_data);
    });

    return resp_arr;
  } catch (error) { }
};

export const fetchUsageReport = async (requestData) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.post(
      `${ApiEndpoint.GET_RR_USAGE_REPORT}`,
      requestData,
      {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      }
    );

    let resp_arr = [];
    response?.data?.map((item) => {
      let resp_data = {
        "Employee ID": item?.employeeId,
        "Employee Name": item?.employeeName,
        "Work Location": item?.workLocation,
        "Role (Mgr/Emp)": item?.role,
        "# Times Logged in": item?.noOfTimesLoggedIn,
        "Last Login": item?.lastLogin,
        "Profile Updated?": item?.profileUpdatedOn,
        "#RRs Owned": item?.noOfRRsOwned,
        "#RRs Application Received (Manager)":
          item?.managerRRsApplication?.total,
        "#RRs Application Active (Manager)":
          item?.managerRRsApplication?.active,
        "#RRs Application Allocation Requested (Manager)":
          item?.managerRRsApplication?.allocationRequested,
        "#RRs Application Withdrawn (Manager)":
          item?.managerRRsApplication?.withdrawn,
        "#RRs Application Declined (Manager)":
          item?.managerRRsApplication?.declined,
        "#RRs Application Meeting Scheduled (Manager)":
          item?.managerRRsApplication?.scheduled,
        "#RRs Application Dropped (Manager)":
          item?.managerRRsApplication?.dropped,
        "#RRs Applied (Employee)": item?.employeeRRsApplication?.total,
        "#RR Active (Employee)": item?.employeeRRsApplication?.active,
        "#RR Allocation Requested (Employee)":
          item?.employeeRRsApplication?.allocationRequested,
        "#RR Withdrawn (Employee)": item?.employeeRRsApplication?.withdrawn,
        "#RRs Declined (Employee)": item?.employeeRRsApplication?.declined,
        "#RRs Meeting Scheduled (Employee)":
          item?.employeeRRsApplication?.scheduled,
        "#RRs Dropped (Employee)": item?.employeeRRsApplication?.dropped,
      };
      resp_arr?.push(resp_data);
    });
    return resp_arr;
  } catch (error) { }
};

export const fetchRRProgressReports = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${ApiEndpoint.GET_RR_PROGRESS_REPORT}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_RR_PROGRESS_REPORTS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_RR_PROGRESS_REPORTS_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchRRAgeing = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        ApiEndpoint.GET_RR_AGEING_REPORT,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_RR_AGING_API_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_RR_AGING_API_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchTalentRejectionAnalysis = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        ApiEndpoint.GET_TALENT_REJECTION_ANALYSIS,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_TALENT_REJECTION_ANALYSIS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_TALENT_REJECTION_ANALYSIS_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const getDroppedApplication = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        ApiEndpoint.GET_DROPPED_APPLICATIONS,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_DROPPED_APPLICATION_API_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_DROPPED_APPLICATION_API_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const sortDroppedApplication = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_DROPPED_APPLICATION",
    payload: {
      columnDroppedApplication: columnName,
      sortOrderDroppedApplication: sortOrder,
    },
  };
};

export const setDroppedApplicationPageCount = (count) => {
  return {
    type: "DROPPED_APPLICATIONS_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterDroppedApplications = (searchTerm, columnName) => {
  return {
    type: "FILTER_DROPPED_APPLICATIONS",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearDroppedApplicationFilters = () => {
  return {
    type: "CLEAR_FILTER_DROPPED_APPLICATIONS",
    payload: {},
  };
};

export const setRRAgingPageCount = (count) => {
  return {
    type: "RR_AGING_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterRRAging = (searchTerm, columnName, tableName) => {
  return {
    type: "FILTER_RR_AGING",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
      tableName: tableName
    },
  };
};

export const clearRRAgingFilters = () => {
  return {
    type: "CLEAR_FILTER_RR_AGING",
    payload: {},
  };
};

export const filterTechnologywiseData = (searchTerm, columnName) => {
  return {
    type: "FILTER_TECHNOLOGYWISE_DATA",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};