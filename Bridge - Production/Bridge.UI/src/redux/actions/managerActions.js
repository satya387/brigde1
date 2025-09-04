import axios from "axios";
import * as API_ENDPOINTS from "../../config";
import { getAuthToken, getUserName } from "../../common/commonMethods";

export const fetchManagerJobById = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.MANAGER_RR_LIST_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_MANAGER_RRS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_MANAGER_RRS_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const fetchManagerAppliedJobById = (managerId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        `${API_ENDPOINTS.MANAGER_APPLIED_OPPORTUNITY_API}`,
        {
          headers: {
            managerEmployeeId: managerId,
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_MANAGER_APPLIED_OPPORTUNITY_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_MANAGER_APPLIED_OPPORTUNITY_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const fetchLaunchpadEmployees = (wlocation) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        `${API_ENDPOINTS.LAUNCHPAD_EMPLOYEE_API}`,
        {
          headers: {
            location: wlocation,
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_LAUNCHPAD_EMPLOYEE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_LAUNCHPAD_EMPLOYEE_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const disaproveOpportunity = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.DISAPROVE_OPPORTUNITY_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "DISAPROVE_OPPORTUNITY_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "DISAPROVE_OPPORTUNITY_FAILUREs",
        payload: error.message,
      });
    }
  };
};
export const withdrawOpportunity = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.WITHDRAW_OPPORTUNITY_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "DISAPROVE_OPPORTUNITY_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "DISAPROVE_OPPORTUNITY_FAILUREs",
        payload: error.message,
      });
    }
  };
};
export const scheduleDiscussion = (requestScheduleData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.INITIATE_DISCUSSION_API}`,
        requestScheduleData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "SCHEDULE_DISCUSSION_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "SCHEDULE_DISCUSSION_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const scheduleL2Discussion = (requestScheduleData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.INITIATE_L2_DISCUSSION_API}`,
        requestScheduleData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "SCHEDULE_L2_DISCUSSION_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "SCHEDULE_L2_DISCUSSION_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const globalSearch = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.SEARCH_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "SEARCH_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "SEARCH_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const disapprovalReason = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(API_ENDPOINTS.DISAPPROVAL_REASON_API, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_DISAPPROVAL_REASON_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_DISAPPROVAL_REASON_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const rejectCandidate = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.DISAPROVE_OPPORTUNITY_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "REJECTION_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "REJECTION_FAILURES",
        payload: error.message,
      });
    }
  };
};

export const allocateCandidate = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.APPROVE_OPPORTUNITY_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "ALLOCATE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "ALLOCATE_FAILURES",
        payload: error.message,
      });
    }
  };
};

export const getManagerResource = (employeeId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(API_ENDPOINTS.GETMANAGERRESOURCES, {
        headers: {
          employeeId: employeeId,
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "GET_RESOURCE_RELEASE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_RESOURCE_RELEASE_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const getWFMTeamList = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(API_ENDPOINTS.GET_WFMTEAMLIST, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "GET_WFMTEAMLIST_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_WFMTEAMLIST_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const getFutureAvailableResources = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        API_ENDPOINTS.GET_FUTUREAVAILABLERESOURCES_API,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_FUTUREAVAILABLERESOURCES_API_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_FUTUREAVAILABLERESOURCES_API_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const getAllAvailableResources = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        API_ENDPOINTS.GET_ALL_AVAILABLE_RESOURCES,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_ALL_AVAILABLE_RESOURCES_API_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_ALL_AVAILABLE_RESOURCES_API_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const saveResourceAvailability = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.SAVE_RESOURCE_AVAILABILITY}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
    } catch {
      // no need to handle catch
    }
  };
};

export const releaseResource = async (requestData) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.post(
      `${API_ENDPOINTS.SAVE_RESOURCE_AVAILABILITY}`,
      requestData,
      {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      }
    );
    return response;
  } catch {
    // no need to handle catch
  }
};

export const sortLaunchpadPagination = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_LAUNCHPAD",
    payload: {
      columnLaunchpad: columnName,
      sortOrderLaunchpad: sortOrder,
    },
  };
};

export const sortReviewApplication = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_REVIEW_APPLICATION",
    payload: {
      columnReviewApplication: columnName,
      sortOrderReviewApplication: sortOrder,
    },
  };
};

export const sortFutureResources = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_FUTURE_RESOURCES",
    payload: {
      columnFutureResources: columnName,
      sortOrderFutureResources: sortOrder,
    },
  };
};

export const sortAvailableResources = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_AVAILABLE_RESOURCES",
    payload: {
      columnAvailableResources: columnName,
      sortOrderAvailableResources: sortOrder,
    },
  };
};

export const sortManagerRelease = (columnName, sortOrder) => {
  return {
    type: "SORT_MANAGER_RELEASE",
    payload: {
      columnManagerRelease: columnName,
      sortManagerRelease: sortOrder,
    },
  };
};

export const postSelfSummary = async (requestData) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.post(
      `${API_ENDPOINTS.SELF_SUMMARY}`,
      requestData,
      {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      }
    );

    return response; // Return the response object directly
  } catch (error) {
    return error.response; // Return the error response if there's an error
  }
};

export const setManagerReviewPageCount = (count) => {
  return {
    type: "MANAGER_REVIEW_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const setLaunchpadPageCount = (count) => {
  return {
    type: "LAUNCHPAD_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const setAvailableResourcesPageCount = (count) => {
  return {
    type: "AVAILABLE_RESOURCES_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const setFutureAvailableResourcesPageCount = (count) => {
  return {
    type: "FUTURE_AVAILABLE_RESOURCES_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const setManagerReleasePageCount = (count) => {
  return {
    type: "MANAGER_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const getRRMatchingLaunchPadEmployees = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINTS.GET_RRMATCHING_LAUNCHPAD_EMPLOYEES}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "GET_RRMATCHING_LAUNCHPAD_EMPLOYEES_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "GET_RRMATCHING_LAUNCHPAD_EMPLOYEES_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchEmployeeSummary = (empId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        `${API_ENDPOINTS.EMPLOYEE_SUMMARY}/${empId}`,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_EMPLOYEE_SUMMARY_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_EMPLOYEE_SUMMARY_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const setMatchingResource = (value) => {
  return {
    type: "MATCHING_RESOURCE",
    payload: {
      matchingResources: value,
    },
  };
};

export const filterReviewApplication = (searchTerm, columnName) => {
  return {
    type: "FILTER_REVIEW_APPLICATION",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearReviewApplicationFilters = () => {
  return {
    type: "CLEAR_FILTER_REVIEW_APPLICATION",
    payload: {},
  };
};

export const filterLaunchpadEmp = (searchTerm, columnName) => {
  return {
    type: "FILTER_LAUNCHPAD_EMP",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearLaunchpadEmpFilters = () => {
  return {
    type: "CLEAR_FILTER_LAUNCHPAD_EMP",
    payload: {},
  };
};

export const filterFutureEmp = (searchTerm, columnName) => {
  return {
    type: "FILTER_FUTURE_EMP",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearFutureEmpFilters = () => {
  return {
    type: "CLEAR_FILTER_FUTURE_EMP",
    payload: {},
  };
};

export const filterAvailableResource = (searchTerm, columnName) => {
  return {
    type: "FILTER_AVAILABLE_RESOURCE",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearAvailableResourceFilters = () => {
  return {
    type: "CLEAR_FILTER_AVAILABLE_RESOURCE",
    payload: {},
  };
};

export const filterManagerRelease = (searchTerm, columnName) => {
  return {
    type: "FILTER_MANAGER_RELEASE",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearManagerReleaseFilters = () => {
  return {
    type: "CLEAR_FILTER_MANAGER_RELEASE",
    payload: {},
  };
};

export const sortUnconfirmedResource = (columnName, sortOrder, path) => {
  return {
    type: "SORT_COLUMN_UNCONFIRMED_RESOURCE",
    payload: {
      columnUnconfirmedResource: columnName,
      sortOrderUnconfirmedResource: sortOrder,
      path: path
    },
  };
};
export const setUnconfirmedResourcePageCount = (count) => {
  return {
    type: "UNCONFIRMED_RESOURCE_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterUnconfirmedResource = (searchTerm, columnName) => {
  return {
    type: "FILTER_UNCONFIRMED_RESOURCE",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearUnconfirmedResourceFilters = () => {
  return {
    type: "CLEAR_FILTER_UNCONFIRMED_RESOURCE",
    payload: {},
  };
};

export const setTalentAgingPageCount = (count) => {
  return {
    type: "TALENT_AGEING_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterTalentAgeingPage = (searchTerm, columnName) => {
  return {
    type: "FILTER_TALENT_AGEING",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};
export const clearTalentAgeingPageFilters = () => {
  return {
    type: "CLEAR_FILTER_TALENT_AGEING",
    payload: {},
  };
};

export const setTechnologywisePageCount = (count) => {
  return {
    type: "TECHNOLOGYWISE_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterTechnologywise = (searchTerm, columnName) => {
  return {
    type: "FILTER_TECHNOLOGYWISE",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};
export const clearTechnologywiseFilters = () => {
  return {
    type: "CLEAR_FILTER_TECHNOLOGYWISE",
    payload: {},
  };
};