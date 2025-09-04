import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/header/header";
import Home from "../../components/home/home.jsx";
import LeftMenu from "../../components/leftmenu"
import '../dashboard/dashboard.scss';
import ViewToggle from '../../components/tilelistview';
import { fetchSelfApplyJob } from "../../redux/actions/jobActions";
import PaginatedSelfAppliedList from "./PaginatedSelfAppliedList";

const MyAppliedJobs = () => {
  const [isListMode, setListMode] = useState(true);

  const handleViewChange = (mode) => {
    setListMode(mode);
  };
  const employeeId = useSelector((state) => state.user.employeeId);
  const appliedJobById = useSelector((state) => state.job.appliedJobById) || [];  

  return <>
    <div className="dashcontainer">
      <Header />         
      <div className="home-container">
        <div className="left-panel">  
            <LeftMenu />
        </div>
        <div className="right-panel">
        <>
    <div className="page-header">
        <h1>My Applied Opportunities ({appliedJobById?.length})</h1>
        <div className="filters">
          <ViewToggle onChange={handleViewChange} />         
        </div>
      </div>   
      {isListMode ? <PaginatedSelfAppliedList
        employeeId={employeeId}
        fetchAction={fetchSelfApplyJob}
        dataSelector={(state) => state.job.appliedJobById}
        viewType="list"
      /> : <PaginatedSelfAppliedList
      employeeId={employeeId}
      fetchAction={fetchSelfApplyJob}
      dataSelector={(state) => state.job.appliedJobById}
      viewType="tile"
    />}
    </>
        </div>
      </div>
    </div>
  </>
}
export default MyAppliedJobs;