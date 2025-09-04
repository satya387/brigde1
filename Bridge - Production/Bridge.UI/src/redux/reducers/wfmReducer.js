import { getAging } from "../../common/commonMethods";
import { applyFilters } from "../../common/commonMethods";
const initialState = {
  allocationRequest: [],
  releaseRequest: [],
  sortColumnAllocationRequest: "rrNumber",
  sortOrderAllocationRequest: "asc",
  sortColumnReleaseRequest: "employeeName",
  sortOrderReleaseRequest: "asc",
  approveTalentAllocationCount: 1,
  approveTalentReleaseCount: 1,
  error: null,
  rrstatusactions: [],
  columnScheduledApplication: "rrNumber",
  sortOrderScheduledApplication: "asc",
  scheduledApplicationCount: 1,
  filterScheduledApplication: {},
  wfmAppliedJobByID: [],
  l2Scheduled: [],
  allocationRequest: [],
  columnResourceAllocation: "rrNumber",
  sortOrderResourceAllocation: "asc",
  resourceAllocationCount: 1,
  filterResourceAllocation: {},
  allStatus: [],
  active:[],
  withdrawn:[],
  declined:[]
};

const wfmReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ALLOCATION_REQUEST":
      return {
        ...state,
        allocationRequest: action.payload,
        error: null,
      };
    case "FETCH_ALLOCATION_REQUEST_FAILURE":
      return {
        ...state,
        error: action?.payload,
      };
    case "FETCH_RELEASE_REQUEST":
      return {
        ...state,
        releaseRequest: action.payload,
        error: null,
      };
    case "FETCH_RELEASE_REQUEST_FAILURE":
      return {
        ...state,
        error: action?.payload,
      };
    case "SORT_COLUMN_ALLOCATION_REQUEST":
      const { sortColumnAllocationRequest, sortOrderAllocationRequest } =
        action.payload;
      return {
        ...state,
        allocationRequest: [
          ...state.allocationRequest?.sort((a, b) => {
            if (sortColumnAllocationRequest === "aging") {
              const daysDifferenceA = getAging(a);
              const daysDifferenceB = getAging(b);
              if (sortOrderAllocationRequest === "asc") {
                return daysDifferenceA - daysDifferenceB;
              } else {
                return daysDifferenceB - daysDifferenceA;
              }
            } else if (sortColumnAllocationRequest) {
              const aValue = String(
                a[sortColumnAllocationRequest] ||
                a["requesterName"] ||
                a["allocationRequestDate"] ||
                a["allocationPercentage"] ||
                ""
              );
              const bValue = String(
                b[sortColumnAllocationRequest] ||
                b["requesterName"] ||
                b["allocationRequestDate"] ||
                b["allocationPercentage"] ||
                ""
              );
              if (sortOrderAllocationRequest === "asc") {
                return aValue.localeCompare(bValue);
              } else {
                return bValue.localeCompare(aValue);
              }
            }
            return 0;
          }),
        ],
        sortColumnAllocationRequest: sortColumnAllocationRequest,
        sortOrderAllocationRequest: sortOrderAllocationRequest,
      };
    case "SORT_COLUMN_RELEASE_REQUEST":
      const { sortColumnReleaseRequest, sortOrderReleaseRequest } =
        action.payload;
      return {
        ...state,
        releaseRequest: [
          ...state.releaseRequest?.sort((a, b) => {
            if (sortColumnReleaseRequest) {
              if (sortColumnReleaseRequest === "experience") {
                const aValue = parseFloat(a[sortColumnReleaseRequest]);
                const bValue = parseFloat(b[sortColumnReleaseRequest]);
                if (!isNaN(aValue) && !isNaN(bValue)) {
                  return sortOrderReleaseRequest === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
                }
              } else {
                const aValue = String(
                  a[sortColumnReleaseRequest] ||
                  "projectName" ||
                  "reportingManagerName" ||
                  "releaseRequestOn" ||
                  "plannedReleaseDate" ||
                  "status" ||
                  ""
                ); // Ensure aValue is a string
                const bValue = String(
                  b[sortColumnReleaseRequest] ||
                  "projectName" ||
                  "reportingManagerName" ||
                  "releaseRequestOn" ||
                  "plannedReleaseDate" ||
                  "status" ||
                  ""
                ); // Ensure bValue is a string
                if (sortOrderReleaseRequest === "asc") {
                  return aValue.localeCompare(bValue);
                } else {
                  return bValue.localeCompare(aValue);
                }
              }
            }
            return 0;
          }),
        ],
        sortColumnReleaseRequest: sortColumnReleaseRequest,
        sortOrderReleaseRequest: sortOrderReleaseRequest,
      };
    case "APPROVE_TALENT_ALLOCATION_PAGE_COUNT":
      return {
        ...state,
        approveTalentAllocationCount: action?.payload?.count,
      };
    case "APPROVE_TALENT_RELEASE_PAGE_COUNT":
      return {
        ...state,
        approveTalentReleaseCount: action?.payload?.count,
      };
    case "FETCH_RR_STATUS_ACTION_SUCCESS":
      return {
        ...state,
        rrstatusactions: action.payload,
        error: null,
      }
    case "FETCH_RR_STATUS_ACTION_FAILURE":
      return {
        ...state,
        error: action.payload,
      }
    case "SORT_COLUMN_SCHEDULED_APPLICATION":
      const { columnScheduledApplication, sortOrderScheduledApplication, status } = action.payload;
      let sortedData = status === "Active" ? [...state.active] : status === "Withdrawn"? [...state.withdrawn]: status === "Declined"? [...state.declined] : [...state.rrstatusactions];

      sortedData.sort((a, b) => {
        if (columnScheduledApplication) {
          if (columnScheduledApplication === "experience" || columnScheduledApplication === "rrAging"
            || columnScheduledApplication === "employeeAgeing") {
            const aValue = parseFloat(a[columnScheduledApplication]);
            const bValue = parseFloat(b[columnScheduledApplication]);
            if (!isNaN(aValue) && !isNaN(bValue)) {
              return sortOrderScheduledApplication === "asc" ? aValue - bValue : bValue - aValue;
            }
          } else {
            const aValue = String(a[columnScheduledApplication] || "");
            const bValue = String(b[columnScheduledApplication] || "");
            return sortOrderScheduledApplication === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          }
        }
      });
      if(status=== "Active")
      {
        return {
          ...state,
          active: sortedData,
          columnScheduledApplication: columnScheduledApplication,
          sortOrderScheduledApplication: sortOrderScheduledApplication,
        };
      }
      else if(status=== "Withdrawn")
      {
        return {
          ...state,
          withdrawn: sortedData,
          columnScheduledApplication: columnScheduledApplication,
          sortOrderScheduledApplication: sortOrderScheduledApplication,
        };
      }
      else if(status=== "Declined")
      {
        return {
          ...state,
          declined: sortedData,
          columnScheduledApplication: columnScheduledApplication,
          sortOrderScheduledApplication: sortOrderScheduledApplication,
        };
      }
      else{
      return {
        ...state,
        rrstatusactions: sortedData,
        columnScheduledApplication: columnScheduledApplication,
        sortOrderScheduledApplication: sortOrderScheduledApplication,
      };
    }
    case "SCHEDULED_APPLICATION_PAGE_COUNT":
      return {
        ...state,
        scheduledApplicationCount: action?.payload?.count,
      };
    case "FILTER_SCHEDULED_APPLICATION":
      if(action.payload.status === "Active"){
        return {
          ...state,
          filterScheduledApplication: {
            ...state.filterScheduledApplication,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          active: applyFilters(
            state?.active,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      }
      else if(action.payload.status === "Withdrawn"){
        return {
          ...state,
          filterScheduledApplication: {
            ...state.filterScheduledApplication,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          withdrawn: applyFilters(
            state?.withdrawn,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      }
      else if(action.payload.status === "Declined"){
        return {
          ...state,
          filterScheduledApplication: {
            ...state.filterScheduledApplication,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          declined: applyFilters(
            state?.declined,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      }
      else{
      return {
        ...state,
        filterScheduledApplication: {
          ...state.filterScheduledApplication,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        rrstatusactions: applyFilters(
          state?.rrstatusactions,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
    };
    case "CLEAR_FILTER_SCHEDULED_APPLICATION":
      return {
        ...state,
        filterScheduledApplication: {},
      };
    case "FETCH_L2_SCHEDULE_SUCCESS":
      return {
        ...state,
        l2Scheduled: action.payload,
        error: null,
      };
    case "FETCH_ALLOCATION_REQUESTED_SUCCESS":
      return {
        ...state,
        allocationRequest: action.payload,
        error: null,
      };
    case "SORT_COLUMN_RESOURCE_ALLOCATION":
      const { columnResourceAllocation, sortOrderResourceAllocation, title } = action.payload;
      let sortedResourceAllocationData = title === "Resources aligned to L2 Interviews " ? [...state.l2Scheduled] :
        (title === "Resources aligned to Interview " ? [...state.rrstatusactions] : (title == null ? [...state.allStatus] : [...state.allocationRequest]));
      sortedResourceAllocationData.sort((a, b) => {
        if (columnResourceAllocation) {
          if (columnResourceAllocation === "experience") {
            const aValue = parseFloat(a[columnResourceAllocation]);
            const bValue = parseFloat(b[columnResourceAllocation]);
            if (!isNaN(aValue) && !isNaN(bValue)) {
              return sortOrderResourceAllocation === "asc" ? aValue - bValue : bValue - aValue;
            }
          }
          else if (columnResourceAllocation === "appliedon") {
            const columnA = new Date(a[columnResourceAllocation]);
            const columnB = new Date(b[columnResourceAllocation]);
            return sortOrderResourceAllocation === 'asc' ? columnA - columnB : columnB - columnA;
          }
          else {
            const aValue = String(a[columnResourceAllocation] || "");
            const bValue = String(b[columnResourceAllocation] || "");
            return sortOrderResourceAllocation === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          }
        }
      });
      if (title === "Resources aligned to L2 Interviews ") {
        return {
          ...state,
          l2Scheduled: sortedResourceAllocationData,
          columnResourceAllocation: columnResourceAllocation,
          sortOrderResourceAllocation: sortOrderResourceAllocation,
        }
      }
      else if (title === "Resources aligned to Interview ") {
        return {
          ...state,
          rrstatusactions: sortedResourceAllocationData,
          columnResourceAllocation: columnResourceAllocation,
          sortOrderResourceAllocation: sortOrderResourceAllocation,
        }
      }
      else if (title === null) {
        return {
          ...state,
          allStatus: sortedResourceAllocationData,
          columnResourceAllocation: columnResourceAllocation,
          sortOrderResourceAllocation: sortOrderResourceAllocation,
        }
      }
      else {
        return {
          ...state,
          allocationRequest: sortedResourceAllocationData,
          columnResourceAllocation: columnResourceAllocation,
          sortOrderResourceAllocation: sortOrderResourceAllocation,
        }
      };
    case "RESOURCE_ALLOCATION_PAGE_COUNT":
      return {
        ...state,
        resourceAllocationCount: action?.payload?.count,
      };
    case "FILTER_RESOURCE_ALLOCATION":
      if (action.payload.title === "Resources aligned to Interview ") {
        return {
          ...state,
          filterResourceAllocation: {
            ...state.filterResourceAllocation,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          rrstatusactions: applyFilters(
            state?.rrstatusactions,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      }
      else if (action.payload.title === "Resources aligned to L2 Interviews ") {
        return {
          ...state,
          filterResourceAllocation: {
            ...state.filterResourceAllocation,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          l2Scheduled: applyFilters(
            state?.l2Scheduled,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      }
      else if (action.payload.title === "Allocated Resources ") {
        return {
          ...state,
          filterResourceAllocation: {
            ...state.filterResourceAllocation,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          allocationRequest: applyFilters(
            state?.allocationRequest,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      }
      else {
        return {
          ...state,
          filterResourceAllocation: {
            ...state.filterResourceAllocation,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          allStatus: applyFilters(
            state?.allStatus,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
      };
    case "CLEAR_FILTER_RESOURCE_ALLOCATION":
      return {
        ...state,
        filterResourceAllocation: {},
      };
    case "FETCH_ALL_RR_STATUS_ACTION_SUCCESS":
      return {
        ...state,
        allStatus: action.payload,
        error: null,
      };
      case "FETCH_ACTIVE_SUCCESS":
      return {
        ...state,
        active: action.payload,
        error: null,
      };
      case "FETCH_WITHDRAWN_SUCCESS":
      return {
        ...state,
        withdrawn: action.payload,
        error: null,
      };
      case "FETCH_DECLINED_SUCCESS":
      return {
        ...state,
        declined: action.payload,
        error: null,
      };
    default:
      return state;
  }
};


export default wfmReducer;
