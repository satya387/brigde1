const initialState = {
    employees: [],
    employeeProfile: null,
    employeeHistory: null,
    authenticateData: null,
    error: null,
    sendEmailResponse: null,
    userManualLogin: false,
    employeeSummary: null
  };
  
  export const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
      case "MANUAL_LOGIN_SUCCESS":
        return {
          ...state,
          userManualLogin: action.payload,
          error: null,
        };
      case "FETCH_EMPLOYEE_SUCCESS":
        return {
          ...state,
          employees: action.payload,
          error: null,
        };
      case "FETCH_EMPLOYEE_FAILURE":
        return {
          ...state,
          error: action.payload,
        };
      case "FETCH_EMPLOYEE_PROFILE_SUCCESS":
        return {
          ...state,
          employeeProfile: action.payload,
          error: null,
        };
      case "FETCH_EMPLOYEE_PROFILE_FAILURE":
        return {
          ...state,
          error: action.payload,
        };
      case "FETCH_EMPLOYEE_HISTORY_SUCCESS":
        return {
          ...state,
          employeeHistory: action.payload,
          error: null,
        };
      case "FETCH_EMPLOYEE_HISTORY_FAILURE":
        return {
          ...state,
          error: action.payload,
        };
        case "AUTHENTICATE_SUCCESS":
          return {
            ...state,
            authenticateData: action.payload,
            error: null,
          };
        case "AUTHENTICATE_FAILURE":
          return {
            ...state,
            error: action.payload,
          };
          case "SENDING_INVITE_SUCCESS":
          return {
            ...state,
            sendEmailResponse: action.payload,
            error: null,
          };
        case "SENDING_INVITE_FAILURE":
          return {
            ...state,
            error: action.payload,
          };
        case "FETCH_EMPLOYEE_SUMMARY_SUCCESS":
          return {
            ...state,
            employeeSummary: action.payload,
            error: null,
          };
        case "FETCH_EMPLOYEE_SUMMARY_FAILURE":
          return {
            ...state,
            error: action.payload,
          };
      default:
        return state;
    }
  };
  
  