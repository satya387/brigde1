import axios from "axios";
import * as ApiEndpoint from "../../config";
import { getAuthToken, getUserName } from "../../common/commonMethods";
import { DUMMY_DATA_RELEASE } from "../../pages/WFM/ResourceReleaseRequest/constant";

export const fetchAllocationDataByWFM = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        `${ApiEndpoint.GET_ALLOCATION_REQUEST}`,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_ALLOCATION_REQUEST",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_ALLOCATION_REQUEST_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const sortAllocationRequest = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_ALLOCATION_REQUEST",
    payload: {
      sortColumnAllocationRequest: columnName,
      sortOrderAllocationRequest: sortOrder,
    },
  };
};

export const fetchResourceReleaseDataByWFM = () => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(
        `${ApiEndpoint.GET_ALL_RELEASED_EMPLOYEE}`,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "FETCH_RELEASE_REQUEST",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_RELEASE_REQUEST_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const sortReleaseRequest = (columnName, sortOrder) => {
  return {
    type: "SORT_COLUMN_RELEASE_REQUEST",
    payload: {
      sortColumnReleaseRequest: columnName,
      sortOrderReleaseRequest: sortOrder,
    },
  };
};

export const approveCandidateAllocation = async (requestData) => {
  const accessToken = getAuthToken();
  const userName = getUserName();
  const response = await axios.post(
    `${ApiEndpoint.APPROVE_ALLOCATION}`,
    requestData,
    {
      headers: {
        Bearer_Token: `${accessToken}`,
        username: userName,
      },
    }
  );
  return response;
};

export const setApproveTalentAllocationPageCount = (count) => {
  return {
    type: "APPROVE_TALENT_ALLOCATION_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const setApproveTalentReleasePageCount = (count) => {
  return {
    type: "APPROVE_TALENT_RELEASE_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const ScheduledActiveRRsAction =  (status) => {
  return async (dispatch) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.get(
      `${ApiEndpoint.GET_ACTIVE_RRS}`,
      {
        headers: {
          Bearer_Token: `${accessToken}`,
          username: userName,
          status: status
        },
      }
    ); 
    if(status === "L2Discussion"){
      dispatch({
        type: "FETCH_L2_SCHEDULE_SUCCESS",
        payload: response.data,
      });
    }
    else if(status === "AllocationRequested"){
      dispatch({
        type: "FETCH_ALLOCATION_REQUESTED_SUCCESS",
        payload: response.data,
      });
    }
    else if(status === "Scheduled,L2Discussion"){
    dispatch({
      type: "FETCH_RR_STATUS_ACTION_SUCCESS",
      payload: response.data,
    });
  }
  else if(status === "Active"){
    dispatch({
      type: "FETCH_ACTIVE_SUCCESS",
      payload: response.data,
    });
  }
  else if(status === "Withdrawn"){
    dispatch({
      type: "FETCH_WITHDRAWN_SUCCESS",
      payload: response.data,
    });
  }
  else if(status === "Declined"){
    dispatch({
      type: "FETCH_DECLINED_SUCCESS",
      payload: response.data,
    });
  }
    else {
      dispatch({
        type: "FETCH_ALL_RR_STATUS_ACTION_SUCCESS",
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch({
      type: "FETCH_RR_STATUS_ACTION_FAILURE",
      payload: error.message,
    });
  }
};
};

export const sortScheduledApplication = (columnName, sortOrder, status) => {
  return {
    type: "SORT_COLUMN_SCHEDULED_APPLICATION",
    payload: {
      columnScheduledApplication: columnName,
      sortOrderScheduledApplication: sortOrder,
      status: status
    },
  };
};

export const setScheduledApplicationPageCount = (count) => {
  return {
    type: "SCHEDULED_APPLICATION_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterScheduledApplication = (searchTerm, columnName, status) => {
  return {
    type: "FILTER_SCHEDULED_APPLICATION",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
      status: status
    },
  };
};

export const clearScheduledApplicationFilters = () => {
  return {
    type: "CLEAR_FILTER_SCHEDULED_APPLICATION",
    payload: {},
  };
};

export const sortResourceAllocation = (columnName, sortOrder, title) => {
  return {
    type: "SORT_COLUMN_RESOURCE_ALLOCATION",
    payload: {
      columnResourceAllocation: columnName,
      sortOrderResourceAllocation: sortOrder,
      title: title
    },
  };
};

export const setResourceAllocationPageCount = (count) => {
  return {
    type: "RESOURCE_ALLOCATION_PAGE_COUNT",
    payload: {
      count: count,
    },
  };
};

export const filterResourceAllocation = (searchTerm, columnName, title) => {
  return {
    type: "FILTER_RESOURCE_ALLOCATION",
    payload: {
      searchTerm: searchTerm,
      columnName: columnName,
      title: title
    },
  };
};

export const clearResourceAllocationFilters = (title) => {
  return {
    type: "CLEAR_FILTER_RESOURCE_ALLOCATION",
    payload: {
      title: title
    },
  };
};
