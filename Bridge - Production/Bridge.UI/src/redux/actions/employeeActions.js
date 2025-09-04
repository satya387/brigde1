import axios from "axios";
import * as API_ENDPOINT from "../../config";
import {
  getAuthToken,
  getUserName,
  getBrowserType,
  getPublicIP,
  getLocation,
} from "../../common/commonMethods";
import { DEV_EMAIL, DEV_EMAIL_FROM } from "../../common/emailConstants";

export const fetchEmployee = () => async (dispatch) => {
  try {
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.get(API_ENDPOINT.EMPLOYEE_API, {
      headers: {
        Bearer_Token: `${accessToken}`,
        username: userName,
      },
    });
    dispatch({
      type: "FETCH_EMPLOYEE_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: "FETCH_EMPLOYEE_FAILURE",
      payload: error.message,
    });
  }
};

export const fetchEmployeeProfile = (employeeId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.get(`${API_ENDPOINT.EMP_PROFILE_API}`, {
        headers: {
          employeeId: employeeId, // Pass the id in the headers
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      dispatch({
        type: "FETCH_EMPLOYEE_PROFILE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_EMPLOYEE_PROFILE_FAILURE",
        payload: error.message,
      });
    }
  };
};
// In your actions/employeeActions.js file

export const authenticateUser = (userName, isSSOLogin, userMailId) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const response = await axios.get(`${API_ENDPOINT.AUTHENTICATION_API}`, {
        headers: {
          userMailId: userMailId,
          Bearer_Token: `${accessToken}`,
          username: userName,
        },
      });
      // Update local storage with user data
      localStorage.setItem("user", JSON.stringify(response.data));
      // Update local storage with username
      if (isSSOLogin && response?.status === 200) {
        localStorage?.setItem("userName", userMailId);
        try {
          await trackLoginAnalytics(response.data, false);
        } catch (e) {
          console.error(e);
        }
      }
      if (response?.status === 200) {
        // Dispatch the employeeId along with the success action
        dispatch({
          type: "AUTHENTICATE_SUCCESS",
          payload: {
            ...response.data,
          },
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      dispatch({
        type: "AUTHENTICATE_FAILURE",
        payload: error.message,
      });
      return false;
    }
  };
};

export const updateEmployeeAbout = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINT.UPDATEEMPLOYEEABOUT_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "UPDATE_EMPLOYEE_ABOUT_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_EMPLOYEE_ABOUT_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const updateEmployeeRoles = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINT.UPDATEEMPLOYEE_ROLE_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "UPDATE_EMPLOYEE_ROLE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_EMPLOYEE_ROLE_FAILURE",
        payload: error.message,
      });
    }
  };
};
export const upsertEmployeePreviousOrg = (requestData) => {
  return async (dispatch) => {
    try {
      const accessToken = getAuthToken();
      const userName = getUserName();
      const response = await axios.post(
        `${API_ENDPOINT.UPSERTEMPLOYEE_PREVIOUS_ORG_API}`,
        requestData,
        {
          headers: {
            Bearer_Token: `${accessToken}`,
            username: userName,
          },
        }
      );
      dispatch({
        type: "UPDATE_EMPLOYEE_ROLE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_EMPLOYEE_ROLE_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const SendInvite = (emailData) => {
  return async (dispatch) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const optionalAttendees = emailData.optionalAttendees
        .split(";")
        .map((email) => email.trim());
      const sendInviteBody = `Dear ${emailData.employeeName}, <br><br> Inviting you for a discussion on ${emailData.rrNumber} for the role ${emailData.jobTitle} in ${emailData.project}.`;
      const sendInviteSubject = `${
        emailData?.isL2Discussion ? "BRIDGE: L2 " : "BRIDGE:"
      }Discussion with ${emailData.employeeName} on ${emailData.rrNumber}`;
      const attendees = [
        {
          emailAddress: {
            address:
              process.env.REACT_APP_ENV !== "production"
                ? DEV_EMAIL_FROM
                : emailData.employeeMailId,
          },
          type: "required",
        },
        {
          emailAddress: {
            address:
              process.env.REACT_APP_ENV !== "production"
                ? DEV_EMAIL
                : emailData.managerMailId,
          },
          type: "required",
        },
        ...optionalAttendees.map((email) => ({
          emailAddress: {
            address: email,
          },
          type: "optional",
        })),
      ];
      const response = await axios.post(
        `${API_ENDPOINT.INVITE_GRAPHAPI}`,
        (emailData = {
          subject: sendInviteSubject,
          body: {
            contentType: "HTML",
            content: sendInviteBody,
          },
          start: {
            dateTime: emailData.startDate,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: emailData.endDate,
            timeZone: "Asia/Kolkata",
          },
          location: {
            displayName: "Teams meeting",
          },
          attendees: attendees,
          isOnlineMeeting: true,
          onlineMeetingProvider: "teamsForBusiness",
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "SENDING_INVITE_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      // Handle any errors

      dispatch({
        type: "SENDING_INVITE_FAILURE",
        payload: error.message,
      });
    }
  };
};

export const trackLoginAnalytics = async (userData, profileUpdated) => {
  let location = "";
  try {
    location = await getLocation();
  } catch (error) {}
  const browserType = await getBrowserType();
  const publicIp = await getPublicIP();
  if (userData) {
    const requestData = {
      employeeId: profileUpdated
        ? userData?.emidsUniqueId
        : userData?.employeeId,
      employeeName: profileUpdated
        ? userData?.emailId
        : userData?.employeeEmailId,
      isProfileUpdated: profileUpdated ? true : false,
      machineIP: publicIp,
      machineName: "",
      browserType: browserType,
      city: location?.city || "",
      country: location?.countryName || "",
      latitude: `${location?.latitude}` || "",
      longitude: `${location?.longitude}` || "",
    };
    const accessToken = getAuthToken();
    const userName = getUserName();
    const response = await axios.post(
      `${API_ENDPOINT.TRACK_ANALYTICS}`,
      requestData,
      {
        headers: {
          Bearer_Token: `${accessToken}`,
          username:
            userName ||
            (profileUpdated ? userData?.emailId : userData?.employeeEmailId),
        },
      }
    );
    return true;
  }
};
