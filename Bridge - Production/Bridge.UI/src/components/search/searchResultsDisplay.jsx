import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import ViewToggle from "../../components/tilelistview";
import EmployeeTab from "./employeeTab";
import ResourceTab from "./resourceTab";
import "./index.scss";
import loaderImage from "../../resources/Loader.svg";
import EmptyComponent from "../empty/emptyComponent";
import * as GLOBAL_CONST from "../../common/constants";

const SearchResultDisplay = () => {
  const searchResults = useSelector((state) => state.manager.search) || [];
  const [isManager, setIsManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("employee");
  const user = useSelector((state) => state.user) || [];
  const searchInputData = localStorage.getItem("searchInputText");
  useEffect(() => {
    const fetchUserRole = () => {
      setTimeout(() => {
        const userRole = "employee";
        setIsManager(userRole === "manager");
        setIsLoading(false);
      }, 1000);
    };

    fetchUserRole();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const hasEmployeeResults =
    searchResults.employeeSearchResult &&
    searchResults.employeeSearchResult.length > 0;

  useEffect(() => {
    if (!hasEmployeeResults) {
      setActiveTab("resource");
    }
  }, [hasEmployeeResults]);

  return (
    <div className="dashcontainer">
      <Header />
      <div className="home-container">
        <div className="left-panel">
          <LeftMenu isManager={isManager} />
        </div>
        <div className="right-panel">
          {isLoading ? (
            <div className="loader-container">
              <img src={loaderImage} alt="Loading..." />
            </div>
          ) : (
            <div className="search-result-tabs">
              <span>
                Your search results for <b>{searchInputData}</b>
              </span>
              <div className="tab-buttons">
                {user.role === GLOBAL_CONST.Manager ||
                user.role === GLOBAL_CONST.WFMTeam ? (
                  <>
                    <button
                      className={activeTab === "employee" ? "active" : ""}
                      onClick={() => handleTabChange("employee")}
                    >
                      Employee Search Results (
                      {searchResults.employeeSearchResult.length})
                    </button>
                    <button
                      className={activeTab === "resource" ? "active" : ""}
                      onClick={() => handleTabChange("resource")}
                    >
                      RRs Search Results (
                      {searchResults?.resourceRequestSearchResult?.length})
                    </button>
                    <button
                      className={activeTab === "future" ? "active" : ""}
                      onClick={() => handleTabChange("future")}
                    >
                      Future Talents (
                      {searchResults?.futureAvailableEmployees?.length})
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="tab-content">
                {activeTab === "employee" ? (
                  hasEmployeeResults ? (
                    <EmployeeTab
                      employeeResults={searchResults.employeeSearchResult}
                      showFuture={false}
                    />
                  ) : (
                    <p>No employee search results available.</p>
                  )
                ) : activeTab === "resource" ? (
                  <ResourceTab
                    resourceResults={searchResults.resourceRequestSearchResult}
                  />
                ) : searchResults.futureAvailableEmployees.length > 0 ? (
                  <EmployeeTab
                    employeeResults={searchResults.futureAvailableEmployees}
                    showFuture={true}
                  />
                ) : (
                  <p>No future talent results available.</p>
                )}
              </div>
              {searchResults.employeeSearchResult.length === 0 &&
              searchResults.resourceRequestSearchResult.length === 0 &&
              searchResults.futureAvailableEmployees.length === 0 ? (
                <EmptyComponent />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultDisplay;
