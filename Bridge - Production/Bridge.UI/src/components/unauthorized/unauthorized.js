import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import '../../pages/dashboard/dashboard.scss';
import backIcon from "../../resources/back-arrow.svg";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu />
          </div>
          <div className="right-panel">
            <div className="unauthorized">
            <span className="back-arrow" onClick={() => navigate("/home")}><img src={backIcon} alt="" title="Go back to Home" /> Go back to home</span>
              <h3>Unauthorized Access</h3>
              <p>You do not have permission to access this page.</p>              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Unauthorized;
