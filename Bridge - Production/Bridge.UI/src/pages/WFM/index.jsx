import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import "../dashboard/dashboard.scss";
import ViewToggle from "../../components/tilelistview";
import {
  clearAvailableResourceFilters,
  clearFutureEmpFilters,
  getAllAvailableResources,
  getFutureAvailableResources,
} from "../../redux/actions/managerActions";
import AllAvailableResources from "./allAvailableResources";
import FutureAvailableResources from "./futureavailableresources";
import "./index.scss";
import {
  convertUTCtoIST,
  exportToCSV,
  isEmpty,
} from "../../common/commonMethods";
import * as GLOBAL_CONST from "../../common/constants";
import ClearFilters from "../../components/ClearFilters";
import { useLocation } from 'react-router-dom';
import TalentsAgeingTable from "./Dashboard/TalentsAgeingTable";
import TechnologywiseTable from "./Dashboard/TechnologywiseTable";
import ResourceAllocationTable from "./Dashboard/ResourceAllocationTable";
import ResourceAllocation from "./Dashboard/ResourceAllocation";

const ResourcesDisplay = () => {
  const [isListMode, setListMode] = useState(true);
  const userRole = useSelector((state) => state.user.role);
  const dispatch = useDispatch();
  const jobData =
    useSelector((state) => state.manager.getAllAvailableResourcesData) || [];
  const [futureAvailableResources, setFutureAvailableResources] =
    useState(false);
  const futureResourcesData =
    useSelector((state) => state.manager.futureAvailableResourcesData) || [];

  const filterAvailableResource = useSelector(
    (state) => state.manager.filterAvailableResource
  );
  const filtersFutureEmp = useSelector(
    (state) => state.manager.filterFutureEmp
  );

  const handleDownload = async (e) => {
    if (futureAvailableResources === true) {
      let resp_arr = [];
      futureResourcesData?.map((item) => {
        let resp_data = {
          Name: item?.employeeName,
          "Current Project": item?.projectName,
          "Available From": item?.availableOn,
          Skills: item.primarySkills + " ," + item.secondarySkills,
          Role: item?.designation,
          Experience: `${item?.experience || "N/A"} Years`,
          Location: item?.workingLocation,
          "WFM SPOC": item?.wfmSpoc,
        };
        resp_arr?.push(resp_data);
      });
      exportToCSV(resp_arr, GLOBAL_CONST.FUTUREAVAILABLETALENTS);
    } else {
      let resp_arr1 = [];
      jobData?.map((item) => {
        let resp_data1 = {
          Name: item?.employeeName,
          Role: item?.designation,
          Skills: item.primarySkills + " ," + item.secondarySkills,
          "Overall Experience": `${item?.experience || "N/A"} Years`,
          Location: item?.workingLocation,
          Availability: item?.availability,
          "On LaunchPad From": item?.onLaunchPadFrom,
          Aging: item?.aging + " Days",
          "WFM SPOC": item?.wfmSpoc,
          "RRNumber": item?.rrNumber,
          "ProjectName": item?.projectName,
          "Profile Completeness": item?.profileCompleteness
        };
        resp_arr1?.push(resp_data1);
      });
      exportToCSV(resp_arr1, GLOBAL_CONST.LAUNCHPADEMPLOYEE);
    }
  };
  const handleCheckboxChange = () => {
    setFutureAvailableResources(!futureAvailableResources);
  };

  const handleViewChange = (mode) => {
    setListMode(mode);
  };
  const wlocation = useSelector((state) => state.user.wlocation);

  const location = useLocation();
  const [previousLocation, setPreviousLocation] = useState(null);
  const [lanchpadEmpListData, setLanchpadEmpListData] = useState([]);
  const [technologywiseData, setTechnologywiseData] = useState([]);
  const [resourceAllocationTitle, setResourceAllocationTitle] = useState("");
  const [resourceAllocationData, setResourceAllocationData] = useState([]);
  const rrDataBasedOnStatus = useSelector((state) => state.wfm.rrstatusactions) || [];
  const l2Scheduled = useSelector((state) => state.wfm.l2Scheduled) || [];
  const allocationRequest = useSelector((state) => state.wfm.allocationRequest) || [];

  useEffect(() => {
    if (location.state?.from?.pathname === "/dashboard") {
      // Set the previous location when the component mounts
      let from = location.state?.from?.pathname;
      setPreviousLocation(from);
      const data = location.state?.data.sort((a, b) => a.aging - b.aging).reverse()
      setLanchpadEmpListData(data)
    }
    else if (location?.state?.from === "technologywise") {
      const data = location.state.data
      let talentsDetails = data.map(x => x.items)
      const singleArray = [].concat(...talentsDetails);
      setTechnologywiseData(singleArray)
    }
    else if (location?.state?.label === `Allocated Resources (${allocationRequest?.length})`) {
      setResourceAllocationData(allocationRequest);
      setPreviousLocation("AllocatedResources");
    }
    else if (location?.state?.label === `Resources aligned to Interview (${rrDataBasedOnStatus?.length})`) {
      setResourceAllocationData(rrDataBasedOnStatus);
      setPreviousLocation("ResourcesAligned");
    }
    else if (location?.state?.label === `Resources aligned to L2 Interviews (${l2Scheduled?.length})`) {
      setResourceAllocationData(l2Scheduled);
      setPreviousLocation("L2Interviews");
    }
    else {
      let from = location.state?.from;
      setPreviousLocation(from);
      setResourceAllocationData(location.state?.data)
    }
  }, [location]);

  useEffect(() => {
    if (previousLocation === "L2Interviews")
      setResourceAllocationTitle("Resources aligned to L2 Interviews ")
    else if (previousLocation === "ResourcesAligned")
      setResourceAllocationTitle("Resources aligned to Interview ")
    else if (previousLocation === "AllocatedResources")
      setResourceAllocationTitle("Allocated Resources ")
  }, [previousLocation]);

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu />
          </div>
          <div className="right-panel">
            {previousLocation !== "/dashboard" || technologywiseData.length > 0 ?
              <>
                {previousLocation === "L2Interviews" || previousLocation === "ResourcesAligned" || previousLocation === "AllocatedResources" ? <ResourceAllocation data={resourceAllocationData} title={resourceAllocationTitle} /> :
                  <>
                    {previousLocation === "ResourceAllocationDetails" ? <ResourceAllocationTable /> :
                      <>
                        {technologywiseData.length > 0 ? <TechnologywiseTable data={technologywiseData} /> : <>
                          <div className="page-header">
                            <h1>
                              Available Resources (
                              {futureAvailableResources
                                ? futureResourcesData?.length
                                : jobData?.length}
                              )
                            </h1>

                            <div className="filters">
                              <label className="future-available-checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={futureAvailableResources}
                                  onChange={handleCheckboxChange}
                                />
                                Show Future Available Talents
                              </label>
                              <div className="download-button-wrapper">
                                {userRole === GLOBAL_CONST.WFMTeam && (
                                  <button
                                    className="text-blue"
                                    onClick={(e) => handleDownload(e)}
                                  >
                                    {GLOBAL_CONST.DOWNLOAD}
                                  </button>
                                )}
                              </div>
                              {!isEmpty(
                                futureAvailableResources
                                  ? filtersFutureEmp
                                  : filterAvailableResource
                              ) && (
                                  <ClearFilters
                                    clearAction={
                                      futureAvailableResources
                                        ? clearFutureEmpFilters
                                        : clearAvailableResourceFilters
                                    }
                                    fetchAction={
                                      futureAvailableResources
                                        ? getFutureAvailableResources
                                        : getAllAvailableResources
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
                                <AllAvailableResources
                                  wlocation={wlocation}
                                  fetchAction={getAllAvailableResources}
                                  dataSelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                  }
                                  viewType="list"
                                />
                              ) : (
                                <AllAvailableResources
                                  wlocation={wlocation}
                                  fetchAction={getAllAvailableResources}
                                  dataSelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                  }
                                  viewType="tile"
                                />
                              )}
                            </>
                          )}
                        </>}
                      </>
                    }
                  </>
                }
              </> : <TalentsAgeingTable data={lanchpadEmpListData} />
            }
          </div>
        </div>
      </div>
    </>
  );
};
export default ResourcesDisplay;
