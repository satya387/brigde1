import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import Header from "../../../components/header/header";
import LeftMenu from "../../../components/leftmenu";
import '../../dashboard/dashboard.scss';
import ProfileComp from "../../profile/myProfile";
import backIcon from "../../../resources/back-arrow.svg";
import ScheduleBasedonRR from '../../../components/scheduleBasedonRR';
import * as GLOBAL_CONST from '../../../common/constants';
import './index.scss';

const LaunchpadProfile = () => { 
    const [isManager, setIsManager] = useState(false);
    const [shouldRenderSchedule, setShouldRenderSchedule] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = useSelector((state) => state.user.role); 

    useEffect(() => {
        const fetchUserRole = () => {
            setTimeout(() => {
                const userRole = "employee";
                setIsManager(userRole === "manager");
            }, 1000);
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        if (location.pathname.startsWith('/m-available-resources')) {
            setShouldRenderSchedule(true);
        } else {
            setShouldRenderSchedule(false);
        }
    }, [location.pathname]);

    return (
        <div className="dashcontainer">
            <Header />         
            <div className="home-container">
                <div className="left-panel">
                    <LeftMenu isManager={!isManager} />
                </div>
                <div className="right-panel">
                    <div className="schedule-wrap profile-schedule">
                        <span className="back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                            {shouldRenderSchedule && userRole !== GLOBAL_CONST.WFMTeam && <div className='button-wrap'><ScheduleBasedonRR /></div>}
                    </div>
                    <ProfileComp />
                </div>
            </div>
        </div>
    );
}

export default LaunchpadProfile;
