import React from "react";
import Header from "../../components/header/header";
import Home from "../../components/home/home.jsx";
import LeftMenu from "../../components/leftmenu";
import '../dashboard/dashboard.scss';
import RRS from "./myRRs";

const myRRs = ({className }) => { 

  return <>
    <div className="dashcontainer">
      <Header />         
      <div className="home-container">
        <div className="left-panel">
            <LeftMenu />
        </div>
        <div className={`right-panel ${className}`}> 
            <RRS />
        </div>
      </div>
    </div>
  </>
}

export default myRRs;
