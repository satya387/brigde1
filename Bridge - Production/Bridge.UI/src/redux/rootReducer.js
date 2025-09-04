import { combineReducers } from "redux";
import { employeeReducer } from "./reducers/employeeReducer";
import jobReducer from "./reducers/jobReducer";
import rrReducer from "./reducers/rrReducer";
import managerReducer from "./reducers/managerReducer";
import wfmReducer from "./reducers/wfmReducer";
import analysisReducer from "./reducers/analysisReducer"

const initialState = JSON.parse(localStorage.getItem("user")) || {
  employeeId: null,
  username: null,
  role: null,
  employeeEmailId: null,
  employeeName: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTHENTICATE_SUCCESS":
      return {
        ...state,
        employeeId: action.payload.employeeId,
        role: action.payload.role,
        username: action.payload.username,
        employeeEmailId: action.payload.employeeEmailId,
        employeeName: action.payload.employeeName
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  employee: employeeReducer,
  job: jobReducer,
  rr: rrReducer,
  manager: managerReducer,
  user: userReducer,
  wfm: wfmReducer,
  analysis:analysisReducer,
   
});

export default rootReducer;
