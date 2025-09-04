export const EMPLOYEE = "Employee";
export const Manager = "Manager";
export const WFMTeam = "WFM";
export const SAVE_TEXT = "Save";
export const RESET_FILTER = "Reset";

export const USAGE_REPORT_NAME = "Bridge_Usage_Report";
export const RR_PROGRESS_REPORT_NAME = "RR_Progress_Report";

export const DOWNLOAD_PROFILE = "Download Profile";
export const APPROVE_TALENT_HEADER = "Approve Talent Allocation";
export const CLEAR_FILTER = "Clear Table Filters";
export const QUARTER_MIN = 15;
export const MILLISECONDS_IN_MINUTES = 60000;

export const EmployeeWithdrawnMsg =
  "Are you certain you wish to Withdraw your application for this RR?";
export const ApplyOpportunityOnWithdrawStatus =
  "You have previously withdrawn your application for this opportunity. Are you certain you want to re-apply for this opportunity?";
export const ApplyOpportunityOnDeclinedStatus =
  "Your application has already been declined. Are you certain you want to re-apply for this opportunity?";
export const ApplyOpportunityOnDroppedStatus =
  "Your application has already been dropped after discussion. Are you certain you want to re-apply for this opportunity?";
export const ScheduledForWithDrawnStatus =
  "The applicant has already withdrawn from this opportunity. Are you certain you want to schedule a meeting with the applicant?";
export const ScheduledForDeclinedStatus =
  "You have already declined the applicant. Are you sure you want to schedule a meeting with the applicant?";
export const scheduleForDroppedStatus =
  "You have previously dropped the applicant following an earlier discussion. Are you certain you want to schedule a meeting with the applicant?";
export const scheduleForL2Discussion =
  "Are you certain you want to schedule L2-Discussion with the applicant?";
export const revertConfirmation =
  "Are you certain you want to revert the allocation request for the candidate?";
export const styles = {
  option: (styles, state) => ({
    ...styles,
    "&:hover": {
      ...styles,
      color: "white",
      backgroundColor: "#533EED",
    },
  }),
};

export const OPPORTUNITY_STATUS_ENUM = {
  Active: "Active",
  Declined: "Declined",
  Scheduled: "Scheduled",
  AllocationRequested: "AllocationRequested",
  Dropped: "Dropped",
  Earmarked: "Earmarked",
  Accepted: "Accepted",
  Released: "Released",
  ReleaseRequested: "Release Requested",
  Withdrawn: "Withdrawn",
  WithdrawRequested: "Withdraw Requested",
  L2Discussion: "L2Discussion",
  Available: "Available",
  Furlough: "Furlough",
  UndergoingTraining: "Undergoing Training",
  PartialAllocation: "Partial allocation",
  ReleaseRejected: "Release Rejected",
  Closed: "Closed"
};

export const DEFAULT_ERROR_MESSAGE =
  "Oops! Something went wrong. Please try again later.";
export const TOASTER_SUCCESS = "success";
export const TOASTER_ERROR = "error";

export const DOWNLOAD = "Download";
export const LAUNCHPADEMPLOYEE = "Launchpad Employee";
export const FUTUREAVAILABLETALENTS = "Future Available Talent";
export const ALL_ACTIVE_RRS = "All Active RRs";
export const APPLY_OPPORTUNITY_RESIGNED_ERROR_MSG =
  "Currently you don't have permission to apply for this RR. Kindly contact WFM team for more details.";
export const EXCEED_MAX_LIMIT_ERROR_MSG = "You have exceeded the maximum limit of applications (3 applications). Please review your active applications before applying for a new opportunity.";
