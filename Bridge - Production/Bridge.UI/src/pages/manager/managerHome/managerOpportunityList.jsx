import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../../components/home/home.scss";
import {
  clearHomeFilters,
  fetchJobById,
} from "../../../redux/actions/jobActions";
import ViewToggle from "../../../components/tilelistview";
import MyJobs from "../../../pages/myJobs";
import PaginatedListView from "../../../components/tilelistview/PaginatedListView";
import { isEmpty } from "../../../common/commonMethods";
import ClearFilters from "../../../components/ClearFilters";
import "../../../components/home/home.scss";

const ManagerOpportunityList = () => {
  const employeeId = useSelector((state) => state.user.employeeId);
  const [isListMode, setListMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const managerOpportunityListData =
    useSelector((state) => state.job.jobById) || [];
  const appliedFiltersHome = useSelector(
    (state) => state.job.appliedFiltersHome
  );
  const handleViewChange = (mode) => {
    setListMode(mode);
  };
  return (
    <>
      <div className="page-header">
        <h1>Manager Opportunities ({managerOpportunityListData?.length})</h1>
        <div className="filters">
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
  );
};
export default ManagerOpportunityList;
