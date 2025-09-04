import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import ProfileComp from "./myProfile";
import ScheduleBasedonRR from "../../components/scheduleBasedonRR";
import backIcon from "../../resources/back-arrow.svg";
import '../dashboard/dashboard.scss';

const EmpProfile = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [shouldRenderSchedule, setShouldRenderSchedule] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
        setShouldRenderSchedule(true);
    } else {
        setShouldRenderSchedule(false);
    }
  }, [location.pathname]);

  return <>
    <div className="dashcontainer">
      <Header />         
      <div className="home-container">
        <div className="left-panel">
            <LeftMenu />
        </div>
        <div className="right-panel">
          <div className="schedule-wrap profile-schedule">
              <span className="back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
              {shouldRenderSchedule && <div className='button-wrap'><ScheduleBasedonRR /></div>}
          </div>
          <ProfileComp />
        </div>
      </div>
    </div>
  </>
}

export default EmpProfile;
