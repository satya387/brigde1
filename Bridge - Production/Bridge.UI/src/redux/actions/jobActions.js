import axios from "axios";
import * as ApiEndpoint from "../../config";
import { getAuthToken, getUserName } from "../../common/commonMethods";

export const fetchAllJobs = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(ApiEndpoint.JOBS_API, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_ALL_JOBS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ALL_JOBS_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchJobById = (employeeId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.JOBS_API}`, {
        headers: {
          employeeId: employeeId,
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_JOB_BY_ID_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_JOB_BY_ID_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchEmpSearchData = (employeeId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        `${ApiEndpoint.GETEMP_SEARCH_FILTER_API}`,
        {
          headers: {
            employeeId: employeeId,
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_EMP_SEARCH_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_EMP_SEARCH_FAILURE",
        payload: error.message,
      });
    }
  };
};

// API Call to fetch all the skills from BE.
export const fetchSkills = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.GETSKILL}`, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_SKILLS_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_SKILLS_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchRoles = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.GETROLE}`, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_ROLES_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ROLES_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchCountriesAndCities = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.GETCOUNTRIESANDCITIES}`, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_COUNTRIES_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_COUNTRIES_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchProjectName = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.GET_PROJECT_NAME}`, {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_PROJECT_NAME_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_PROJECT_NAME_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchSaveEmpSearchData = (updatedData) => {
  return (dispatch) => {
    const accessToken = getAuthToken();
    const userName = getUserName();
    return new Promise((resolve, reject) => {
      axios
        .post(`${ApiEndpoint.SAVEEMP_SEARCH_FILTER_API}`, updatedData, {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        })
        .then((response) => {
          dispatch(saveEmpSearchDataSuccess(response.data));
          resolve(); // Resolve the promise after successful dispatch
        })
        .catch((error) => {
          dispatch(saveEmpSearchDataFailure(error));
          reject(error); // Reject the promise in case of an error
        });
    });
  };
};

// Other action creators go here...

export const saveEmpSearchDataSuccess = (data) => {
  return {
    type: "SAVE_EMP_SEARCH_DATA_SUCCESS",
    payload: data,
  };
};

export const saveEmpSearchDataFailure = (error) => {
  return {
    type: "SAVE_EMP_SEARCH_DATA_FAILURE",
    payload: error,
  };
};

export const applyForJob = async (
  employeeId,
  resourceRequestId,
  resourceRequestNumber,
  nominatedBy
) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.post(
      `${ApiEndpoint.APPLYJOB_API}`,
      {
        employeeId: employeeId,
        resourceRequestId: resourceRequestId,
        resourceRequestNumber: resourceRequestNumber,
        ...(nominatedBy && nominatedBy?.length && { createdBy: nominatedBy }),
      },
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

export const fetchSelfApplyJob = (employeeId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.SELFAPPLYJOB_API}`, {
        headers: {
          employeeId: employeeId,
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_APPLIED_JOB_BY_ID_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_APPLIED_JOB_BY_ID_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const fetchApplicatantByRRId = (rrId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${ApiEndpoint.GET_APPLICANT_BY_RRID}`, {
        headers: {
          rrId: rrId,
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_APPLICANT_BY_RRID_SUCCESS",
        payload: {
          data: response?.data,
          rrId: rrId,
        },
      });
    } catch (error) {
      dispatch({
        type: "FETCH_APPLICANT_BY_RRID_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const sortByColumn = (columnName, sortOrder) => {
  return {
    type: "SORT_BY_COLUMN_JOB_ID",
    payload: {
      columnName: columnName,
      sortOrder: sortOrder,
    },
  };
};

export const sortByColumnAppliedJob = (columnName, sortOrder) => {
  return {
    type: "SORT_BY_COLUMN_APPLIED_OPPORTUNITY",
    payload: {
      columnNameAppliedJob: columnName,
      sortOrderApplied: sortOrder,
    },
  };
};

export const setHomePageCount = (count) => {
  return {
    type: "HOME_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const setSelfAppliedPageCount = (count) => {
  return {
    type: "SELF_APPLIED_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterHomeTable = (searchTerm, columnName) => {
  return {
    type: "FILTER_HOME_TABLE_JOB",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
    },
  };
};

export const clearHomeFilters = () => {
  return {
    type: "CLEAR_HOME_FILTERS",
    payload: {},
  };
};

export const postCommonMethod = async (apiEndpoint, optionData) => {
  const accessToken = getAuthToken();
  const userName = getUserName();
  const response = await axios.post(`${apiEndpoint}`, optionData, {
    headers: {
      Bearer_Token: `${accessToken}`,
      username: userName,
    },
  });

  return response;
};

export const getCommonMethod = async (apiEndpoint, obj) => {
  const accessToken = getAuthToken();
  const userName = getUserName();
  let header = { Bearer_Token: `${accessToken}`, username: userName };
  header = { ...header, ...obj };
  const response = await axios.get(apiEndpoint, {
    headers: header,
  });
  return response;
};

export const getSelfAppliedOpportunity = async (employeeId) => {
  const accessToken = getAuthToken();
  const userName = getUserName();
  const response = await axios.get(`${ApiEndpoint.SELFAPPLYJOB_API}`, {
    headers: {
      employeeId: employeeId,
      Bearer_Token: `${accessToken}`,
      username: userName,
    },
  });
  return response;
};
