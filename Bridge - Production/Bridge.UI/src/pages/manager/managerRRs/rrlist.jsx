import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../../components/home/home.scss";
import { fetchManagerJobById } from "../../../redux/actions/managerActions";
import ViewToggle from "../../../components/tilelistview";
import PaginatedListView from "../../../components/tilelistview/PaginatedListView";

const ManagerRRLIST = () => {
  const employeeId = useSelector((state) => state.user.employeeId);
  const [isListMode, setListMode] = useState(true);

  const handleViewChange = (mode) => {
    setListMode(mode);
  };
  return (
    <div className="manager-my-rrs">
      <div className="page-header">
        <h1>My RRs</h1>
        <div className="filters">
          <ViewToggle onChange={handleViewChange} />
        </div>
      </div>
      {isListMode ? (
        <PaginatedListView
          employeeId={employeeId}
          fetchAction={fetchManagerJobById}
          dataSelector={(state) => state.manager.managerJobByID}
          fromJob={false}
          viewType="list"
        />
      ) : (
        <PaginatedListView
          employeeId={employeeId}
          fetchAction={fetchManagerJobById}
          dataSelector={(state) => state.manager.managerJobByID}
          fromJob={false}
          viewType="tile"
        />
      )}
    </div>
  );
};
export default ManagerRRLIST;
