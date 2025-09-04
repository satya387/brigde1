import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/login/login.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import Profile from "./pages/profile/index.jsx";
import MyRRs from "./pages/myRRs";
import MyAppliedJobs from "./pages/myAppliedJobs/index.jsx";
import AllOpportunity from "./pages/alloppurtunities/index.jsx";
import ManagerRRList from "./pages/manager/managerRRs/index.jsx";
import ManagerAppliedJob from "./pages/manager/managerAppliedjob.jsx";
import LanchpadEmployeeList from "./pages/manager/launchpadView/index.jsx";
import ReviewApplicationList from "./pages/manager/reviewApplications/index.jsx";
import ManagerHome from "./pages/manager/managerHome/index.jsx";
import ChildListPage from "./pages/manager/reviewApplications/selectedChildIndex.jsx";
import SearchResultDisplay from "./components/search/searchResultsDisplay.jsx";
import ManagerProfile from "./pages/manager/managerProfile.jsx";
import LaunchpadProfile from "./pages/manager/launchpadView/empProfile.jsx";
import Unauthorized from "./components/unauthorized/unauthorized";
import SSOLOGIN from "./pages/login/ssoLogin";
import * as GLOBAL_CONST from "./common/constants";
import Report from "./pages/WFM/Report/index.jsx";
import ResourceReleasePage from "./pages/resourceRelease/ResourceReleasePage";
import ResourcesDisplay from "./pages/WFM/index.jsx";
import ResourceReleaseRequest from "./pages/WFM/ResourceReleaseRequest/index.jsx";
import ApproveTalent from "./pages/WFM/ApproveTalent/index.jsx";
import SelfSummary from "./pages/SelfSummary/index.jsx";
import ViewApplicationStatus from "./pages/ViewApplicationStatus/index.jsx";
import MainDashboard from "./pages/WFM/Dashboard/index.jsx";
import ScheduledActiveRRs from "./pages/WFM/Dashboard/ScheduledActiveRRs.jsx";
import DroppedApplications from "./pages/WFM/Dashboard/DroppedApplications.jsx";
import ViewAnalysis from "./pages/ViewAnalysis/ViewAnalysisMain.jsx";
import UnconfirmedResource from "./pages/WFM/Dashboard/UnconfirmedResource.jsx";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const notallowedEmployeePaths = [
      "/m-rrs",
      "/m-appliedoppurtunities",
      "/m-myrrs",
      "/m-reviewapplications",
      "/m-available-resources",
      "/m-profile/",
      "/m-reviewapplications/selectedRR/",
      "/review-appication",
    ];

    if (user && user.role === GLOBAL_CONST.EMPLOYEE) {
      for (const path of notallowedEmployeePaths) {
        if (location.pathname.startsWith(path)) {
          navigate("/unauthorized");
          break;
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return (
    <div>
      <Provider store={store}>
        <SSOLOGIN />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/home/selectedRR/:jobId" element={<ChildListPage />} />
          <Route path="/profile/:employeeID" element={<Profile />} />
          <Route path="/rrs" element={<MyRRs className="rrs" />} />
          <Route
            path="/appliedrrs"
            element={<MyRRs className="applied-rrs" />}
          />
          <Route
            path="/managerrrs"
            element={<MyRRs className="manager-rrs" />}
          />
          <Route
            path="/managermyrrs"
            element={<MyRRs className="manager-my-rrs" />}
          />
          <Route path="/appliedoppurtunities" element={<MyAppliedJobs />} />
          <Route path="/alloppurtunities" element={<AllOpportunity />} />
          <Route path="/m-rrs" element={<ManagerHome />} />
          <Route
            path="/m-appliedoppurtunities"
            element={<ManagerAppliedJob />}
          />
          <Route path="/m-myrrs" element={<ManagerRRList />} />
          <Route
            path="/m-reviewapplications"
            element={<ReviewApplicationList />}
          />
          <Route
            path="/m-available-resources"
            element={<LanchpadEmployeeList />}
          />
          <Route
            path="/m-reviewapplications/selectedRR/:jobId"
            element={<ChildListPage />}
          />
          <Route path="/m-profile/:managerID" element={<ManagerProfile />} />
          <Route
            path="/m-available-resources/:empID"
            element={<LaunchpadProfile />}
          />
          <Route path="/review-appication/:empID" element={<Profile />} />
          <Route path="/search-results" element={<SearchResultDisplay />} />
          <Route path="/search/:empID" element={<Profile />} />
          <Route
            path="/resourcereleasepage"
            element={<ResourceReleasePage />}
          />
          <Route path="/reports" element={<Report />} />
          <Route path="/resourcesdisplay" element={<ResourcesDisplay />} />
          <Route path="/approve-release" element={<ResourceReleaseRequest />} />
          <Route path="/approve-talent" element={<ApproveTalent />} />
          <Route path="/self-summary" element={<SelfSummary />} />
          <Route
            path="/view-application-status/:empID"
            element={<ViewApplicationStatus />}
          />
          <Route path="/dashboard" element={<MainDashboard/>}/>
          <Route path="/scheduledRRs" element={<ScheduledActiveRRs/>}/>
          <Route path="/droppedApplications" element={<DroppedApplications/>}/>
          <Route path="/ViewAnalysis" element={<ViewAnalysis/>}/>
          <Route path="/unconfirmed-resources" element={<UnconfirmedResource/>}/>
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
