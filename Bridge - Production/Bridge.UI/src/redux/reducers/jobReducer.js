/* eslint-disable array-callback-return */

import {
  applyFilters,
  getAging,
  isEmpty,
  sortHomeData,
} from "../../common/commonMethods";

const initialState = {
  allJobs: [],
  jobById: null,
  empSearchById: null,
  empSaveSearchById: null,
  applyjob: null,
  appliedJobById: null,
  error: null,
  skills: [],
  roles: [],
  geoLocations: [],
  applicantByRRId: [],
  projectNames: [],
  sortedColumn: "rrNumber", //null,
  sortOrder: "asc", // 'asc' or 'desc'
  sortedColumnAppliedJob: "rrNumber",
  sortOrderAppliedJob: "asc",
  homePageCount: 1,
  selfAppliedPageCount: 1,
  appliedFiltersHome: {},
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ALL_JOBS_SUCCESS":
      return {
        ...state,
        allJobs: action.payload,
        error: null,
      };
    case "FETCH_ALL_JOBS_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_JOB_BY_ID_SUCCESS":
      let job = [];
      action.payload?.map((item) => {
        let value = item?.resourceRequest;
        value = {
          ...value,
          employeeAppliedCount: item?.employeeAppliedCount || 0,
          aging: getAging(item?.resourceRequest),
        };
        job.push(value);
      });
      job = sortHomeData(job, state?.sortedColumn, state?.sortOrder);
      if (!isEmpty(state?.appliedFiltersHome)) {
        for (let key in state?.appliedFiltersHome) {
          if (state?.appliedFiltersHome.hasOwnProperty(key)) {
            job = applyFilters(job, key, state?.appliedFiltersHome[key]);
          }
        }
      }
      return {
        ...state,
        jobById: job,
        error: null,
      };
    case "FETCH_JOB_BY_ID_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_EMP_SEARCH_SUCCESS":
      return {
        ...state,
        empSearchById: action.payload,
        error: null,
      };
    case "FETCH_EMP_SEARCH_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_SAVE_EMP_SEARCH_SUCCESS":
      return {
        ...state,
        empSaveSearchById: action.payload,
        error: null,
      };
    case "FETCH_SAVE_EMP_SEARCH_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_EMP_JOBS_SUCCESS":
      return {
        ...state,
        empJobs: action.payload,
        error: null,
      };
    case "FETCH_EMP_JOBS_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_APPLY_JOB_SUCCESS":
      return {
        ...state,
        applyjob: action.payload,
        error: null,
      };
    case "FETCH_APPLY_JOB_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_APPLIED_JOB_BY_ID_SUCCESS":
      return {
        ...state,
        appliedJobById: action?.payload?.sort((a, b) => {
          // Extract the numeric part of rrNumber and convert it to number for comparison
          let aNum = parseInt(a.rrNumber.split("/")[1]);
          let bNum = parseInt(b.rrNumber.split("/")[1]);
          return aNum - bNum;
        }),
        error: null,
      };
    case "FETCH_APPLIED_JOB_BY_ID_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_SKILLS_SUCCESS":
      let newSkills = [];
      action.payload?.map((item) => {
        const val = { value: item?.skillName, label: item?.skillName };
        newSkills?.push(val);
      });
      return {
        ...state,
        skills: newSkills,
        error: null,
      };
    case "FETCH_SKILLS_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_ROLES_SUCCESS":
      let newRoles = [];
      action.payload?.map((item) => {
        const val = { value: item?.roleName, label: item?.roleName };
        newRoles?.push(val);
      });
      return {
        ...state,
        roles: newRoles,
        error: null,
      };
    case "FETCH_ROLES_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_COUNTRIES_SUCCESS":
      return {
        ...state,
        geoLocations: action.payload,
        error: null,
      };
    case "FETCH_COUNTRIES_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_PROJECT_NAME_SUCCESS":
      return {
        ...state,
        projectNames: action.payload,
        error: null,
      };
    case "FETCH_PROJECT_NAME_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "FETCH_APPLICANT_BY_RRID_SUCCESS":
      let employeeApp = [];
      action.payload?.data.map((item) => {
        let employeeData = {
          jobAppliedOn: item?.jobAppliedOn,
          employeeName: item?.employeeName,
          employeeUniqueId: item?.employeeUniqueId,
          employeeEmailId: item?.employeeEmailId,
          status: item?.status,
          primarySkill: item?.employeePrimarySkill,
          secondarySkill: item?.employeeSecondarySkill,
          employeeExperience: item?.employeeExperience,
          employeeRole: item?.employeeRole,
          employeeCurrentProject: item?.employeeCurrentProject,
          scheduledDate: item?.scheduledDate,
          matchPercentage: item?.matchPercentage,
          matchCriteria: item.matchCriteria,
          rrCountry: item?.rrCountry,
          employeeDesignation: item?.employeeDesignation,
          employeePreviousProject: item?.employeePreviousProject,
          additionalComments: item?.additionalComments,
          comments: item?.comments,
        };
        employeeApp.push(employeeData);
      });
      const rrData = state?.jobById?.find(
        (data) => data?.rrId === Number(`${action?.payload?.rrId}`)
      );
      const data = [
        {
          rrNumber: rrData?.rrNumber || null,
          project: rrData?.projectName || null,
          jobTitle: rrData?.jobTitle || null,
          primarySkill: rrData?.primarySkill || null,
          secondarySkill: rrData?.secondarySkill || null,
          requiredExperience: rrData?.experience || null,
          location: rrData?.location || null,
          workLocation: null,
          projectStartDate: rrData?.startDate || null,
          rrId: rrData?.rrId,
          employeeApplications: employeeApp,
          applicantsCount: action?.payload?.data?.length,
        },
      ];
      return {
        ...state,
        applicantByRRId: data,
        error: null,
      };
    case "FETCH_APPLICANT_BY_RRID_FAILURE":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_JOB_SORT_DATA":
      return {
        ...state,
        jobIdSort: action.payload,
      };
    case "SORT_BY_COLUMN_JOB_ID":
      const { columnName, sortOrder } = action.payload;
      // Implement sorting logic for the specified column
      // Update state with sorted data and column information
      return {
        ...state,
        jobById: sortHomeData(state?.jobById, columnName, sortOrder),
        sortedColumn: columnName,
        sortOrder,
      };
    case "SORT_BY_COLUMN_APPLIED_OPPORTUNITY":
      const { columnNameAppliedJob, sortOrderApplied } = action.payload;
      // Implement sorting logic for the specified column
      // Update state with sorted data and column information
      return {
        ...state,
        appliedJobById: [
          ...state.appliedJobById?.sort((a, b) => {
            if (columnNameAppliedJob) {
              const aValue = String(
                a[columnNameAppliedJob] ||
                  a["project"] ||
                  a["projectStartDate"] ||
                  ""
              );
              const bValue = String(
                b[columnNameAppliedJob] ||
                  b["project"] ||
                  b["projectStartDate"] ||
                  ""
              );
              if (sortOrderApplied === "asc") {
                return aValue.localeCompare(bValue);
              } else {
                return bValue.localeCompare(aValue);
              }
            }
            return 0;
          }),
        ],
        sortedColumnAppliedJob: columnNameAppliedJob,
        sortOrderAppliedJob: sortOrderApplied,
      };
    case "HOME_PAGE_COUNT":
      return {
        ...state,
        homePageCount: action?.payload?.count,
      };
    case "SELF_APPLIED_PAGE_COUNT":
      return {
        ...state,
        selfAppliedPageCount: action?.payload?.count,
      };
    case "FILTER_HOME_TABLE_JOB":
      return {
        ...state,
        appliedFiltersHome: {
          ...state.appliedFiltersHome,
          [action.payload.columnName]: action.payload.searchTerm,
        },
        jobById: applyFilters(
          state?.jobById,
          action.payload?.columnName,
          action.payload?.searchTerm
        ),
      };
    case "CLEAR_HOME_FILTERS":
      return {
        ...state,
        appliedFiltersHome: {},
      };
    default:
      return state;
  }
};

export default jobReducer;
