import React, { useState, useEffect } from 'react';
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import '../dashboard/dashboard.scss';
import ProfileComp from "../profile/myProfile"

const ManagerProfile = () => { 
    const [isManager, setIsManager] = useState(false);
      useEffect(() => {
          const fetchUserRole = () => {
              setTimeout(() => {
                  const userRole = "employee";
                  setIsManager(userRole === "manager");
              }, 1000);
          };
  
          fetchUserRole();
      }, []);
  return <>
    <div className="dashcontainer">
      <Header />         
      <div className="home-container">
        <div className="left-panel">
        <LeftMenu isManager={!isManager} />
        </div>
        <div className="right-panel"> 
        <ProfileComp />
        </div>
      </div>
    </div>
  </>
}

export default ManagerProfile;
