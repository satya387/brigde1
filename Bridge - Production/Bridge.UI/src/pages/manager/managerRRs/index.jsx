import React, { useState, useEffect } from "react";
import Header from "../../../components/header/header";
import Home from "../../../components/home/home.jsx";
import LeftMenu from "../../../components/leftmenu";
import './../../dashboard/dashboard.scss';
import ManagerRRLIST from "./rrlist";

const ManagerMyRRs = () => {
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

    return (
        <>
            <div className="dashcontainer">
                <Header />
                <div className="home-container">
                    <div className="left-panel">
                        <LeftMenu isManager={!isManager} />
                    </div>
                    <div className="right-panel">
                        <ManagerRRLIST />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManagerMyRRs;
