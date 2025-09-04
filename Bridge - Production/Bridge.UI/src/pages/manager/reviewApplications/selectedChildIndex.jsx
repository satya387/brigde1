import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../../components/header/header";
import Home from "../../../components/home/home.jsx";
import LeftMenu from "../../../components/leftmenu";
import './../../dashboard/dashboard.scss';
import '../../../components/home/home.scss';
import { fetchManagerAppliedJobById } from "../../../redux/actions/managerActions";
import { fetchApplicatantByRRId } from "../../../redux/actions/jobActions.js";
import ViewToggle from "../../../components/tilelistview";
import PaginatedReviewApplicationChildPage from "./childListPage";
import * as GLOBAL_CONST from "../../../common/constants.js";

const ReviewApplicationSelectedList = () => {
    const [isManager, setIsManager] = useState(false);
    const managerId = useSelector((state) => state.user.employeeId);
    const role = useSelector((state) => state.user.role);
    const [isListMode, setListMode] = useState(true);

    const handleViewChange = (mode) => {
        setListMode(mode);
    };

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
                        {isListMode ? <PaginatedReviewApplicationChildPage
                            mangerId={role === GLOBAL_CONST.WFMTeam ? null : managerId}
                            fetchAction={role === GLOBAL_CONST.WFMTeam ? fetchApplicatantByRRId : fetchManagerAppliedJobById}
                            dataSelector={role === GLOBAL_CONST.WFMTeam ? (state) => state.job.applicantByRRId : (state) => state.manager.managerAppliedJobByID}
                            viewType="list"
                        /> : <PaginatedReviewApplicationChildPage
                            mangerId={role === GLOBAL_CONST.WFMTeam ? null : managerId}
                            fetchAction={role === GLOBAL_CONST.WFMTeam ? fetchApplicatantByRRId : fetchManagerAppliedJobById}
                            dataSelector={role === GLOBAL_CONST.WFMTeam ? (state) => state.job.applicantByRRId : (state) => state.manager.managerAppliedJobByID}
                            viewType="tile"
                        />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReviewApplicationSelectedList;
