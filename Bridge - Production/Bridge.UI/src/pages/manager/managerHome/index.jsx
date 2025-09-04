import React, { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Home from "../../../components/home/home.jsx";
import LeftMenu from "../../../components/leftmenu";
import './../../dashboard/dashboard.scss';
import ManagerOpportunityList from "./managerOpportunityList";

function ManagerHome() {
  // Simulated role state (change this to your actual role state)
  const [isManager, setIsManager] = useState(false);

  // Simulate fetching the user's role from the server
  useEffect(() => {
    // Assuming you have some logic to determine the user's role
    // For demonstration purposes, I'm setting a timeout to mimic an asynchronous request
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
            {/* <LeftMenu isManager={isManager} /> */}
            <LeftMenu isManager={!isManager}/>
          </div>
          <div className="right-panel">
            <ManagerOpportunityList />
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerHome;
