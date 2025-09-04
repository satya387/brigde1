import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./home.scss";
import { clearHomeFilters, fetchJobById } from "../../redux/actions/jobActions";
import ViewToggle from "../tilelistview";
import MyJobs from "../../pages/myJobs";
import PaginatedListView from "../tilelistview/PaginatedListView";
import ClearFilters from "../ClearFilters";
import { isEmpty } from "../../common/commonMethods";
import { exportToCSV } from "../../common/commonMethods";
import * as GLOBAL_CONST from "../../common/constants";
import Model from "../tilelistview/model";
import { useLocation } from "react-router";
import RRAgeingTable from "../../pages/WFM/Dashboard/RRAgeingTable";

const Home = () => {
  const employeeId = useSelector((state) => state.user.employeeId);
  const appliedFiltersHome = useSelector(
    (state) => state.job.appliedFiltersHome
  );
  const [isListMode, setListMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const userRole = useSelector((state) => state.user.role);
  const opportunityData = useSelector((state) => state.job.jobById) || [];
  const location = useLocation();
  const [previousLocation, setPreviousLocation] = useState(null);
  const [rrAgeingData, setRRAgeingData] = useState([]);

  useEffect(() => {
    let from = location.state?.from;
    setPreviousLocation(from);
    if (from !== undefined) {
      const data = location.state?.data;
      setRRAgeingData(data)
    }
  }, [location]);

  const handleDownload = async (e) => {

    let resp_arr = [];
    opportunityData?.map((item) => {
      const jobModel = new Model(item);

      const formattedDate = jobModel.getFormattedDate();
      let resp_data = {
        "RR Number": item?.rrNumber,
        Project: item?.projectName,
        Role: item?.designation,
        Skills: item?.primarySkill + " " + item?.secondarySkill,
        "Required Exp.": `${item?.experience || item?.requiredExperience
          }  Years`,
        "Project Assignment": `${item.allocation || "N/A"} %`,
        Location: item?.location,
        "Posted On": formattedDate,
        "RRComments" : item?.rrComments
      };
      resp_arr?.push(resp_data);
    });
    exportToCSV(resp_arr, GLOBAL_CONST.ALL_ACTIVE_RRS);
  };
  const handleViewChange = (mode) => {
    setListMode(mode);
  };

  return (
    <>
      {previousLocation === undefined ?
        (
          <>
            <div className="page-header">
              <h1>Opportunity Posts ({opportunityData?.length})</h1>

              <div className="filters">
                {userRole === GLOBAL_CONST.WFMTeam && (
                  <button className="text-blue" onClick={(e) => handleDownload(e)}>
                    {GLOBAL_CONST.DOWNLOAD}
                  </button>
                )}
                {!isEmpty(appliedFiltersHome) && (
                  <ClearFilters
                    clearAction={clearHomeFilters}
                    fetchAction={fetchJobById}
                    params={employeeId}
                  />
                )}
                <MyJobs setCurrentPage={setCurrentPage} />
                <ViewToggle onChange={handleViewChange} />
              </div>
            </div>
            {isListMode ? (
              <PaginatedListView
                employeeId={employeeId}
                fetchAction={fetchJobById}
                dataSelector={(state) => state.job.jobById}
                viewType="list"
                currentPage={currentPage}
                fromJob={true}
                setCurrentPage={setCurrentPage}
              />
            ) : (
              <PaginatedListView
                employeeId={employeeId}
                fetchAction={fetchJobById}
                dataSelector={(state) => state.job.jobById}
                viewType="tile"
                currentPage={currentPage}
                fromJob={true}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        ) :
        <RRAgeingTable />
      }
    </>
  );
};
export default Home;
