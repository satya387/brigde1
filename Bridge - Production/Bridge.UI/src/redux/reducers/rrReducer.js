import { applyFilters, sortReviewApplicationData } from "../../common/commonMethods";
const initialState = {
  allRRs: [],
  rrs: [],
  managerJobByID: [],
  error: null,
  droppedApplications: [],
  rrAging: [],
  talentRejectionAnalysis:[],
  rrProgressReports:[],
  columnDroppedApplication: "rrNumber",
  sortOrderDroppedApplication: "asc",
  droppedApplicationsPageCount:1,
  filterDroppedApplications:{},
  columnRRAging:"rrNumber",
  sortOrderRRAging:"asc",
  filterRRAging:{},
  rrAgingPageCount:1,
  projectwiseTableData:[],
  filterProjectwise:{},
};

const rrReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ALL_RRS_SUCCESS":
      return {
        ...state,
        allRRs: action.payload,
        error: null,
      };
    case "FETCH_ALL_RRS_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_RRS_SUCCESS":
      return {
        ...state,
        rrs: action.payload,
        error: null,
      };
    case "FETCH_RRS_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_MANAGER_RRS_SUCCESS":
      return {
        ...state,
        managerJobByID: action.payload,
        error: null,
      };
    case "FETCH_MANAGER_RRS_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_DROPPED_APPLICATION_API_SUCCESS":
      return {
        ...state,
        droppedApplications: action.payload,
        error: null,
      };
    case "GET_DROPPED_APPLICATION_API_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_RR_AGING_API_SUCCESS":
      return {
        ...state,
        rrAging: action.payload,
        projectwiseTableData: action.payload,
        error: null
      };
    case "GET_RR_AGING_API_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_TALENT_REJECTION_ANALYSIS_SUCCESS":
      return {
        ...state,
        talentRejectionAnalysis: action.payload,
        error: null
      };
      case "GET_TALENT_REJECTION_ANALYSIS_FAILURE":
      return {
        ...state,
        error: action.payload
      };
      case "GET_RR_PROGRESS_REPORTS_SUCCESS":
        return{
          ...state,
          rrProgressReports: action.payload,
          error: null
        };
        case "GET_RR_PROGRESS_REPORTS_FAILURE":
        return{
          ...state,
          error: action.payload
        };
        case "SORT_COLUMN_DROPPED_APPLICATION":
      const { columnDroppedApplication, sortOrderDroppedApplication } =
        action.payload;
      return {
        ...state,
        droppedApplications: sortReviewApplicationData(
          state?.droppedApplications,
          columnDroppedApplication,
          sortOrderDroppedApplication
        ),
        columnDroppedApplication: columnDroppedApplication,
        sortOrderDroppedApplication: sortOrderDroppedApplication,
      };
      case "DROPPED_APPLICATIONS_PAGE_COUNT":
      return {
        ...state,
        droppedApplicationsPageCount: action?.payload?.count,
      };
      case "FILTER_DROPPED_APPLICATIONS":
      return {
        ...state,
        filterDroppedApplications: {
          ...state.filterDroppedApplications,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        droppedApplications: applyFilters(
          state?.droppedApplications,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      }; 
      case "CLEAR_FILTER_DROPPED_APPLICATIONS":
      return {
        ...state,
        filterDroppedApplications: {},
      };
      case "SORT_COLUMN_RR_AGING":
      const { columnRRAging, sortOrderRRAging } = action.payload;
      let sortedData = [...state.rrAging]; // Copy the array to avoid mutating it

      sortedData.sort((a, b) => {
        if (columnRRAging) {
          if (columnRRAging === "experience" || columnRRAging === "rrAging"
            || columnRRAging === "employeeAgeing") {
            const aValue = parseFloat(a[columnRRAging]);
            const bValue = parseFloat(b[columnRRAging]);
            if (!isNaN(aValue) && !isNaN(bValue)) {
              return sortOrderRRAging === "asc" ? aValue - bValue : bValue - aValue;
            }
          } else {
            const aValue = String(a[columnRRAging] || "");
            const bValue = String(b[columnRRAging] || "");
            return sortOrderRRAging === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          }
        }
      });

      return {
        ...state,
        rrAging: sortedData,
        columnRRAging: columnRRAging,
        sortOrderRRAging: sortOrderRRAging,
      };
      case "RR_AGING_PAGE_COUNT":
      return {
        ...state,
        rrAgingPageCount: action?.payload?.count,
      };
      case "FILTER_RR_AGING":
        if(action.payload.tableName === "rrageing"){
          return {
            ...state,
            filterRRAging: {
              ...state.filterRRAging,
              [action.payload.columnName]: action.payload.searchTerm,
            },
            rrAging: applyFilters(
              state?.rrAging,
              action.payload?.columnName,
              action.payload?.searchTerm
            ),
          };
        }
        else if(action.payload.tableName === "projectwise"){
          return {
            ...state,
            filterProjectwise: {
              ...state.filterProjectwise,
              [action.payload.columnName]: action.payload.searchTerm,
            },
            projectwiseTableData: applyFilters(
              state?.projectwiseTableData,
              action.payload?.columnName,
              action.payload?.searchTerm
            ),
          };
        };     
      case "CLEAR_FILTER_RR_AGING":
      return {
        ...state,
        filterRRAging: {},
        filterProjectwise:{}
      };
    default:
      return state;
  }
};

export default rrReducer;
