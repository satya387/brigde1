import {
  applyFilters,
  isEmpty,
  sortLaunchpadEmpData,
  sortReviewApplicationData,
} from "../../common/commonMethods";

const initialState = {
  managerJobByID: [],
  managerAppliedJobByID: [],
  lanchpadEmpList: [],
  search: [],
  disapproveReason: [],
  error: null,
  managerResources: [],
  futureAvailableResourcesData: [],
  getWFMTeamList: [],
  getAllAvailableResourcesData: [],
  sortedColumnLaunchpad: "employeeName",
  sortOrderLaunchpad: "asc",
  columnReviewApplication: "rrNumber",
  sortOrderReviewApplication: "asc",
  columnFutureResources: "employeeName",
  sortOrderFutureResources: "asc",
  columnAvailableResources: "employeeName",
  sortOrderAvailableResources: "asc",
  columnManagerRelease: "employeeName",
  sortManagerRelease: "asc",
  managerReviewCount: 1,
  talentAgingPageCount:1,
  launchpadPageCount: 1,
  availableResourcesCount: 1,
  futureAvailableResourceCount: 1,
  managerReleaseCount: 1,
  getRRMatchingEmployeesData: [],
  matchingResources: false,
  filtersReviewApplication: {},
  filterTalentAgeing: {},
  filtersLaunchpadEmp: {},
  filterFutureEmp: {},
  filterAvailableResource: {},
  filterManagerRelease: {},
  columnUnconfirmedResource:"employeeId",
  sortOrderUnconfirmedResource:"asc",
  unconfirmedResourceCount:1,
  filterUnconfirmedResource:{},
  technologywisePageCount:1,
  filterTechnologywise:{}
};
const managerReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case "FETCH_MANAGER_APPLIED_OPPORTUNITY_SUCCESS":
      let job = sortReviewApplicationData(
        action.payload,
        state.columnReviewApplication,
        state.sortOrderReviewApplication
      );
      if (!isEmpty(state?.filtersReviewApplication)) {
        for (let key in state?.filtersReviewApplication) {
          if (state?.filtersReviewApplication.hasOwnProperty(key)) {
            job = applyFilters(job, key, state?.filtersReviewApplication[key]);
          }
        }
      }
      return {
        ...state,
        managerAppliedJobByID: job,
        error: null,
      };
    case "FETCH_MANAGER_APPLIED_OPPORTUNITY_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_LAUNCHPAD_EMPLOYEE_SUCCESS":
      let launchpadEmployees = sortLaunchpadEmpData(
        action?.payload,
        state?.sortedColumnLaunchpad,
        state?.sortOrderLaunchpad
      );
      if (!isEmpty(state?.filtersLaunchpadEmp)) {
        for (let key in state?.filtersLaunchpadEmp) {
          if (state?.filtersLaunchpadEmp.hasOwnProperty(key)) {
            launchpadEmployees = applyFilters(
              launchpadEmployees,
              key,
              state?.filtersLaunchpadEmp[key]
            );
          }
        }
      }
      return {
        ...state,
        lanchpadEmpList: launchpadEmployees,
        error: null,
      };
    case "FETCH_LAUNCHPAD_EMPLOYEE_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "SEARCH_SUCCESS":
      return {
        ...state,
        search: action.payload,
        error: null,
      };
    case "SEARCH_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_DISAPPROVAL_REASON_SUCCESS":
      return {
        ...state,
        disapproveReason: action.payload,
        error: null,
      };
    case "FETCH_DISAPPROVAL_REASON_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_RESOURCE_RELEASE_SUCCESS":
      let managerReleaseEmployees = sortLaunchpadEmpData(
        action?.payload,
        state?.columnManagerRelease,
        state?.sortManagerRelease
      );
      if (!isEmpty(state?.filterManagerRelease)) {
        for (let key in state?.filterManagerRelease) {
          if (state?.filterManagerRelease.hasOwnProperty(key)) {
            managerReleaseEmployees = applyFilters(
              managerReleaseEmployees,
              key,
              state?.filterManagerRelease[key]
            );
          }
        }
      }
      return {
        ...state,
        managerResources: managerReleaseEmployees,
        error: null,
      };
    case "GET_RESOURCE_RELEASE_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_FUTUREAVAILABLERESOURCES_API_SUCCESS":
      let futureEmp = sortLaunchpadEmpData(
        action?.payload,
        state?.columnFutureResources,
        state?.sortOrderFutureResources
      );
      if (!isEmpty(state?.filterFutureEmp)) {
        for (let key in state?.filterFutureEmp) {
          if (state?.filterFutureEmp.hasOwnProperty(key)) {
            futureEmp = applyFilters(
              futureEmp,
              key,
              state?.filterFutureEmp[key]
            );
          }
        }
      }
      return {
        ...state,
        futureAvailableResourcesData: futureEmp,
        error: null,
      };
    case "GET_FUTUREAVAILABLERESOURCES_API_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_WFMTEAMLIST_SUCCESS":
      return {
        ...state,
        getWFMTeamList: action.payload,
        error: null,
      };
    case "GET_WFMTEAMLIST_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "GET_ALL_AVAILABLE_RESOURCES_API_SUCCESS":
      let availableResources = sortLaunchpadEmpData(
        action?.payload,
        state?.columnAvailableResources,
        state?.sortOrderAvailableResources
      );
      if (!isEmpty(state?.filterAvailableResource)) {
        for (let key in state?.filterAvailableResource) {
          if (state?.filterAvailableResource.hasOwnProperty(key)) {
            availableResources = applyFilters(
              availableResources,
              key,
              state?.filterAvailableResource[key]
            );
          }
        }
      }

      return {
        ...state,
        getAllAvailableResourcesData: availableResources,
        error: null,
      };
    case "GET_ALL_AVAILABLE_RESOURCES_API_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "SORT_COLUMN_LAUNCHPAD":
      const { columnLaunchpad, sortOrderLaunchpad } = action.payload;
      return {
        ...state,
        lanchpadEmpList: sortLaunchpadEmpData(
          state.lanchpadEmpList,
          columnLaunchpad,
          sortOrderLaunchpad
        ),
        sortedColumnLaunchpad: columnLaunchpad,
        sortOrderLaunchpad: sortOrderLaunchpad,
      };
    case "SORT_COLUMN_REVIEW_APPLICATION":
      const { columnReviewApplication, sortOrderReviewApplication } =
        action.payload;
      return {
        ...state,
        managerAppliedJobByID: sortReviewApplicationData(
          state?.managerAppliedJobByID,
          columnReviewApplication,
          sortOrderReviewApplication
        ),
        columnReviewApplication: columnReviewApplication,
        sortOrderReviewApplication: sortOrderReviewApplication,
      };
    case "SORT_COLUMN_FUTURE_RESOURCES":
      const { columnFutureResources, sortOrderFutureResources } =
        action.payload;
      return {
        ...state,
        futureAvailableResourcesData: sortLaunchpadEmpData(
          state.futureAvailableResourcesData,
          columnFutureResources,
          sortOrderFutureResources
        ),
        columnFutureResources: columnFutureResources,
        sortOrderFutureResources: sortOrderFutureResources,
      };
    case "SORT_COLUMN_AVAILABLE_RESOURCES":
      const { columnAvailableResources, sortOrderAvailableResources } =
        action.payload;
      return {
        ...state,
        getAllAvailableResourcesData: sortLaunchpadEmpData(
          state.getAllAvailableResourcesData,
          columnAvailableResources,
          sortOrderAvailableResources
        ),
        columnAvailableResources: columnAvailableResources,
        sortOrderAvailableResources: sortOrderAvailableResources,
      };
    case "SORT_MANAGER_RELEASE":
      const { columnManagerRelease, sortManagerRelease } = action.payload;
      return {
        ...state,
        managerResources: sortLaunchpadEmpData(
          state.managerResources,
          columnManagerRelease,
          sortManagerRelease
        ),
        columnManagerRelease: columnManagerRelease,
        sortManagerRelease: sortManagerRelease,
      };
    case "MANAGER_REVIEW_PAGE_COUNT":
      return {
        ...state,
        managerReviewCount: action?.payload?.count,
      };
    case "LAUNCHPAD_PAGE_COUNT":
      return {
        ...state,
        launchpadPageCount: action?.payload?.count,
      };
    case "AVAILABLE_RESOURCES_PAGE_COUNT":
      return {
        ...state,
        availableResourcesCount: action?.payload?.count,
      };
    case "FUTURE_AVAILABLE_RESOURCES_PAGE_COUNT":
      return {
        ...state,
        futureAvailableResourceCount: action?.payload?.count,
      };
    case "MANAGER_PAGE_COUNT":
      return {
        ...state,
        managerReleaseCount: action?.payload?.count,
      };
    case "GET_RRMATCHING_LAUNCHPAD_EMPLOYEES_SUCCESS":
      return {
        ...state,
        getRRMatchingEmployeesData: action.payload,
        error: null,
      };
    case "GET_RRMATCHING_LAUNCHPAD_EMPLOYEES_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "MATCHING_RESOURCE":
      return {
        ...state,
        matchingResources: action?.payload?.matchingResources,
      };
    case "FILTER_REVIEW_APPLICATION":
      return {
        ...state,
        filtersReviewApplication: {
          ...state.filtersReviewApplication,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        managerAppliedJobByID: applyFilters(
          state?.managerAppliedJobByID,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
    case "CLEAR_FILTER_REVIEW_APPLICATION":
      return {
        ...state,
        filtersReviewApplication: {},
      };
    case "FILTER_LAUNCHPAD_EMP":
      const value = applyFilters(
        state?.lanchpadEmpList,
        action.payload?.columnName,
        action.payload?.searchTerm
      );
      return {
        ...state,
        filtersLaunchpadEmp: {
          ...state.filtersLaunchpadEmp,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        lanchpadEmpList: value,
      };
    case "CLEAR_FILTER_LAUNCHPAD_EMP":
      return {
        ...state,
        filtersLaunchpadEmp: {},
      };
    case "FILTER_FUTURE_EMP":
      return {
        ...state,
        filterFutureEmp: {
          ...state.filterFutureEmp,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        futureAvailableResourcesData: applyFilters(
          state?.futureAvailableResourcesData,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
    case "CLEAR_FILTER_FUTURE_EMP":
      return {
        ...state,
        filterFutureEmp: {},
      };
    case "FILTER_AVAILABLE_RESOURCE":
      return {
        ...state,
        filterAvailableResource: {
          ...state.filterAvailableResource,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        getAllAvailableResourcesData: applyFilters(
          state?.getAllAvailableResourcesData,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
    case "CLEAR_FILTER_AVAILABLE_RESOURCE":
      return {
        ...state,
        filterAvailableResource: {},
      };
    case "FILTER_MANAGER_RELEASE":
      return {
        ...state,
        filterManagerRelease: {
          ...state.filterManagerRelease,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        managerResources: applyFilters(
          state?.managerResources,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
    case "CLEAR_FILTER_MANAGER_RELEASE":
      return {
        ...state,
        filterManagerRelease: {},
      };
      case "SORT_COLUMN_UNCONFIRMED_RESOURCE":
        const { columnUnconfirmedResource, sortOrderUnconfirmedResource, path } = action.payload;
        const data = path === "Confirmed" ? [...state.futureAvailableResourcesData].filter(item => item.releaseStatus === "Confirmed"):
        [...state.futureAvailableResourcesData].filter(item => item.releaseStatus !== "Confirmed");
          
      let sortedUnconfirmedData = data;// Copy the array to avoid mutating it
      sortedUnconfirmedData.sort((a, b) => {
        if (columnUnconfirmedResource) {
          if (columnUnconfirmedResource === "experience" || columnUnconfirmedResource === "emidsExperience" ) {
            const aValue = parseFloat(a[columnUnconfirmedResource]);
            const bValue = parseFloat(b[columnUnconfirmedResource]);
            if (!isNaN(aValue) && !isNaN(bValue)) {
              return sortOrderUnconfirmedResource === "asc" ? aValue - bValue : bValue - aValue;
            }
          }
           else {
          const aValue = String(a[columnUnconfirmedResource] || "");
          const bValue = String(b[columnUnconfirmedResource] || "");
          return sortOrderUnconfirmedResource === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
      }});
      return {
        ...state,
        futureAvailableResourcesData: sortedUnconfirmedData,
        columnUnconfirmedResource: columnUnconfirmedResource,
        sortOrderUnconfirmedResource: sortOrderUnconfirmedResource,
      };
      case "UNCONFIRMED_RESOURCE_PAGE_COUNT":
      return {
        ...state,
        unconfirmedResourceCount: action?.payload?.count,
      };
      case "FILTER_UNCONFIRMED_RESOURCE":
      return {
        ...state,
        filterUnconfirmedResource: {
          ...state.filterUnconfirmedResource,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        futureAvailableResourcesData: applyFilters(
          state?.futureAvailableResourcesData,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      }; 
      case "CLEAR_FILTER_UNCONFIRMED_RESOURCE":
      return {
        ...state,
        filterUnconfirmedResource: {},
      };
      case "TALENT_AGEING_PAGE_COUNT":
      return {
        ...state,
        talentAgingPageCount: action?.payload?.count,
      };
      case "FILTER_TALENT_AGEING":
      return {
        ...state,
        filterTalentAgeing: {
          ...state.filterTalentAgeing,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        lanchpadEmpList: applyFilters(
          state?.lanchpadEmpList,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
      case "CLEAR_FILTER_TALENT_AGEING":
      return {
        ...state,
        filterTalentAgeing: {},
      };
      case "TECHNOLOGYWISE_PAGE_COUNT":
        return {
          ...state,
          technologywisePageCount: action?.payload?.count,
        };
        case "FILTER_TECHNOLOGYWISE":
        return {
          ...state,
          filterTechnologywise: {
            ...state.filterTechnologywise,
            [action.payload.columnName]: action.payload.searchTerm,
          },
          getAllAvailableResourcesData: applyFilters(
            state?.getAllAvailableResourcesData,
            action.payload?.columnName,
            action.payload?.searchTerm
          ),
        };
        case "CLEAR_FILTER_TECHNOLOGYWISE":
        return {
          ...state,
          filterTechnologywise: {},
        };
    default:
      return state;
  }
};

export default managerReducer;
