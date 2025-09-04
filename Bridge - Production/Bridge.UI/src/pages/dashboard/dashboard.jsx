import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/header";
import Home from "../../components/home/home.jsx";
import LeftMenu from "../../components/leftmenu";
import loaderImage from '../../resources/Loader.svg';
import './dashboard.scss';

function Dashboard() {
  // Simulated role state (change this to your actual role state)
  const manualLogin =useSelector((state) => state.employee.userManualLogin);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if(manualLogin)
    {
      setLoading(false);
    } else{
        if(localStorage.getItem("userName") !==null && localStorage.getItem('accessToken') !==null)
        {
          setLoading(false);
        }
    }
  });

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu isManager={isManager} />            
          </div>
          <div className="right-panel">
            {loading ?  
              <span className="loader loaderWrap">
                <img src={loaderImage} alt="Loading" />
              </span> : <Home />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
