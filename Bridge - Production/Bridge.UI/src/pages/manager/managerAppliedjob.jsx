import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/header/header";
import Home from "../../components/home/home.jsx";
import LeftMenu from "../../components/leftmenu";
import './../dashboard/dashboard.scss';
import '../../components/home/home.scss';
import ViewToggle from "../../components/tilelistview";
import { fetchSelfApplyJob } from "../../redux/actions/jobActions";
import PaginatedSelfAppliedList from "../../pages/myAppliedJobs/PaginatedSelfAppliedList";

const ManagerAppliedJob = () => {
    const [isManager, setIsManager] = useState(false);
    const employeeId = useSelector((state) => state.user.employeeId);
    const [isListMode, setListMode] = useState(true);
    const appliedJobByIdData = useSelector((state) => state.job.appliedJobById) || [];  

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
                        <div className="page-header">
                            <h1>Applied Opportunities ({appliedJobByIdData?.length})</h1>
                            <div className="filters">
                                <ViewToggle onChange={handleViewChange} />
                            </div>
                        </div>
                        {isListMode ? <PaginatedSelfAppliedList
                            employeeId={employeeId}
                            fetchAction={fetchSelfApplyJob}
                            dataSelector={(state) => state.job.appliedJobById}
                            viewType="list"
                        /> : <PaginatedSelfAppliedList
                        employeeId={employeeId}
                        fetchAction={fetchSelfApplyJob}
                        dataSelector={(state) => state.job.appliedJobById}
                        viewType="tile"
                        />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManagerAppliedJob;
