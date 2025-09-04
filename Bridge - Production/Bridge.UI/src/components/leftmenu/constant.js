/* eslint-disable no-template-curly-in-string */
import homeIcon from "../../resources/home.svg";
import profileIcon from "../../resources/profile-white.svg";
import reviewApplicationIcon from "../../resources/reviewApplication.svg";
import availableResourceIcon from "../../resources/availableResource.svg";
import appliedIcon from "../../resources/appliedjob.svg";
import releaseIcon from "../../resources/Resource-Release-Inactive.svg";
import approveTalentIcon from "../../resources/ApproveTalent.svg";
import reportsIcon from "../../resources/Reports.svg";
import updateTalentIcon from "../../resources/UpdateTalent.svg";
import DashboardIcon from "../../resources/Dashboard.svg";

export const employeeMenuItems = [
  {
    id: 1,
    title: "Home",
    icon: homeIcon,
    path: "/home",
  },
  {
    id: 2,
    title: "My Applied Opportunities",
    icon: appliedIcon,
    path: "/appliedoppurtunities",
  },
  {
    id: 3,
    title: "My Profile",
    icon: profileIcon,
    path: "/profile/${id}",
  }
];

export const managerMenuItems = [
  {
    id: 1,
    title: "Home",
    icon: homeIcon,
    path: "/m-rrs",
  },
  {
    id: 2,
    title: "Applied opportunities",
    icon: appliedIcon,
    path: "/m-appliedoppurtunities",
  },
  {
    id: 3,
    title: "Review Application",
    icon: reviewApplicationIcon,
    path: "/m-reviewapplications",
  },
  {
    id: 4,
    title: "Resource Release",
    icon: releaseIcon,
    path: "/resourcereleasepage",
  },
  {
    id: 5,
    title: "Available Resources",
    icon: availableResourceIcon,
    path: "/m-available-resources",
  },
  {
    id: 6,
    title: "My Profile",
    icon: profileIcon,
    path: "/m-profile/${id}",
  },
  // {
  //   id: 7,
  //   title: "View Analysis",
  //   icon: reportsIcon,
  //   path: "/ViewAnalysis",
  // },
];

export const WFMTeamMenuItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: DashboardIcon,
    path: "/dashboard",
  },
  {
    id: 2,
    title: "RR Listing",
    icon: homeIcon,
    path: "/home",
  },
  {
    id: 3,
    title: "Update Talent Status",
    icon: updateTalentIcon,
    path: "/resourcesdisplay",
  },
  {
    id: 4,
    title: "Approve Talent Allocation",
    icon: approveTalentIcon,
    path: "/approve-talent",
  },
  {
    id: 5,
    title: "Approve Talent Release",
    icon: releaseIcon,
    path: "/approve-release",
  },
  {
    id: 6,
    title: "Reports",
    icon: reportsIcon,
    path: "/reports",
  },
  // {
  //   id: 7,
  //   title: "View Analysis",
  //   icon: reportsIcon,
  //   path: "/ViewAnalysis",
  // },
];

export const launchPadAdditionalItem = {
  id: 4,
  title: "Self Summary",
  icon: appliedIcon,
  path: "/self-summary",
};
