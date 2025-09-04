import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../../components/header/header";
import LeftMenu from "../../../components/leftmenu";
import "../../dashboard/dashboard.scss";
import ViewToggle from "../../../components/tilelistview";
import {
  clearFutureEmpFilters,
  clearLaunchpadEmpFilters,
  fetchLaunchpadEmployees,
  getFutureAvailableResources,
} from "../../../redux/actions/managerActions";
import LaunchpadPaginatedListView from "./lanchpadView";
import FutureAvailableResources from "../../WFM/futureavailableresources";
import ClearFilters from "../../../components/ClearFilters/index.jsx";
import { isEmpty } from "../../../common/commonMethods.js";

const MyAppliedJobs = () => {
  const [isListMode, setListMode] = useState(true);
  const [futureAvailableResources, setFutureAvailableResources] =
    useState(false);
  const [isManager, setIsManager] = useState(false);
  const filtersLaunchpadEmp = useSelector(
    (state) => state.manager.filtersLaunchpadEmp
  );
  const filtersFutureEmp = useSelector(
    (state) => state.manager.filterFutureEmp
  );
  const lanchpadEmpListData =
    useSelector((state) => state.manager.lanchpadEmpList) || [];
  const futureResourcesData =
    useSelector((state) => state.manager.futureAvailableResourcesData) || [];

  const handleFutureCheckboxChange = () => {
    setFutureAvailableResources(!futureAvailableResources);
  };

  const handleViewChange = (mode) => {
    setListMode(mode);
  };

  useEffect(() => {
    const fetchUserRole = () => {
      setTimeout(() => {
        const userRole = "employee";
        setIsManager(userRole === "manager");
      }, 1000);
    };

    fetchUserRole();
  }, []);

  const wlocation = useSelector((state) => state.user.wlocation);

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu isManager={!isManager} />
          </div>
          <div className="right-panel">
            <>
              <div className="page-header">
                <h1>
                  Available Resources (
                  {futureAvailableResources
                    ? futureResourcesData?.length
                    : lanchpadEmpListData?.length}
                  )
                </h1>
                <div className="filters">
                  <label className="future-available-checkbox-label">
                    <input
                      type="checkbox"
                      checked={futureAvailableResources}
                      onChange={handleFutureCheckboxChange}
                    />
                    Show Future Available Talents
                  </label>
                  {!isEmpty(
                    futureAvailableResources
                      ? filtersFutureEmp
                      : filtersLaunchpadEmp
                  ) && (
                    <ClearFilters
                      clearAction={
                        futureAvailableResources
                          ? clearFutureEmpFilters
                          : clearLaunchpadEmpFilters
                      }
                      fetchAction={
                        futureAvailableResources
                          ? getFutureAvailableResources
                          : fetchLaunchpadEmployees
                      }
                      params={wlocation}
                    />
                  )}
                  <ViewToggle onChange={handleViewChange} />
                </div>
              </div>
              {futureAvailableResources ? (
                <>
                  {isListMode ? (
                    <FutureAvailableResources
                      wlocation={wlocation}
                      fetchAction={getFutureAvailableResources}
                      dataSelector={(state) =>
                        state.manager.futureAvailableResourcesData
                      }
                      viewType="list"
                    />
                  ) : (
                    <FutureAvailableResources
                      wlocation={wlocation}
                      fetchAction={getFutureAvailableResources}
                      dataSelector={(state) =>
                        state.manager.futureAvailableResourcesData
                      }
                      viewType="tile"
                    />
                  )}
                </>
              ) : (
                <>
                  {isListMode ? (
                    <LaunchpadPaginatedListView
                      wlocation={wlocation}
                      fetchAction={fetchLaunchpadEmployees}
                      dataSelector={(state) => state.manager.lanchpadEmpList}
                      viewType="list"
                    />
                  ) : (
                    <LaunchpadPaginatedListView
                      wlocation={wlocation}
                      fetchAction={fetchLaunchpadEmployees}
                      dataSelector={(state) => state.manager.lanchpadEmpList}
                      viewType="tile"
                    />
                  )}
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyAppliedJobs;
