import React from "react";
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import '../dashboard/dashboard.scss';

const AllOppurtunity = () => { 

  return <>
    <div className="dashcontainer">
      <Header />         
      <div className="home-container">
        <div className="left-panel">
            <LeftMenu />
        </div>
        <div className="right-panel"> 
        <h1>All Opportunities goes here</h1>
        </div>
      </div>
    </div>
  </>
}

export default AllOppurtunity;
