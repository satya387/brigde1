import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../../components/header/header";
import Home from "../../../components/home/home.jsx";
import LeftMenu from "../../../components/leftmenu";
import "./../../dashboard/dashboard.scss";
import "../../../components/home/home.scss";
import {
  clearReviewApplicationFilters,
  fetchManagerAppliedJobById,
} from "../../../redux/actions/managerActions";
import ViewToggle from "../../../components/tilelistview";
import PaginatedReviewApplication from "./reviewApplicationslist";
import { isEmpty } from "../../../common/commonMethods.js";
import ClearFilters from "../../../components/ClearFilters/index.jsx";

const ReviewApplicationList = () => {
  const [isManager, setIsManager] = useState(false);
  const managerId = useSelector((state) => state.user.employeeId);
  const filtersReviewApplication = useSelector(
    (state) => state?.manager?.filtersReviewApplication
  );
  const [isListMode, setListMode] = useState(true);

  const handleViewChange = (mode) => {
    setListMode(mode);
  };
  const reviewApplicationListData =
    useSelector((state) => state.manager.managerAppliedJobByID) || [];

  useEffect(() => {
    const fetchUserRole = () => {
      setTimeout(() => {
        const userRole = "employee";
        setIsManager(userRole === "manager");
      }, 1000);
    };

    fetchUserRole();
  }, []);

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu isManager={!isManager} />
          </div>
          <div className="right-panel">
            <div className="page-header">
              <h1>Review Applications ({reviewApplicationListData?.length})</h1>
              <div className="filters">
                {!isEmpty(filtersReviewApplication) && (
                  <ClearFilters
                    clearAction={clearReviewApplicationFilters}
                    fetchAction={fetchManagerAppliedJobById}
                    params={managerId}
                  />
                )}
                <ViewToggle onChange={handleViewChange} />
              </div>
            </div>
            {isListMode ? (
              <PaginatedReviewApplication
                managerId={managerId}
                fetchAction={fetchManagerAppliedJobById}
                dataSelector={(state) => state.manager.managerAppliedJobByID}
                viewType="list"
              />
            ) : (
              <PaginatedReviewApplication
                managerId={managerId}
                fetchAction={fetchManagerAppliedJobById}
                dataSelector={(state) => state.manager.managerAppliedJobByID}
                viewType="tile"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewApplicationList;
