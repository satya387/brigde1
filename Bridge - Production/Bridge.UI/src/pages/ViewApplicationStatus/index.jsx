import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { fetchEmployeeProfile } from "../../redux/actions/employeeActions";
import loader from "../../resources/Loader.svg";
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import "../../components/home/home.scss";
import "./index.scss";
import backIcon from "../../resources/back-arrow.svg";
import EmployeeData from "./EmployeeData";
import EmployeeRRTable from "./EmployeeRRTable";
import { getSelfAppliedOpportunity } from "../../redux/actions/jobActions";

const ViewApplicationStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { empID } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [appliedJobById, setAppliedJobById] = useState([]);

  useEffect(() => {
    if (empID) {
      setLoading(true);
      dispatch(fetchEmployeeProfile(empID));
      fetchEmployeeRR();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, empID]);

  const fetchEmployeeRR = async () => {
    try {
      const res = await getSelfAppliedOpportunity(empID);
      if (res?.data) {
        const data = res?.data?.sort((a, b) => {
          // Extract the numeric part of rrNumber and convert it to number for comparison
          let aNum = parseInt(a.rrNumber.split("/")[1]);
          let bNum = parseInt(b.rrNumber.split("/")[1]);
          return aNum - bNum;
        });
        setAppliedJobById(data);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="dashcontainer">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <LeftMenu />
          </div>
          <div className="right-panel">
            <span className="back-arrow">
              <img
                src={backIcon}
                alt=""
                title="Go back"
                onClick={() => navigate(-1)}
              />
            </span>
            {isLoading ? (
              <span className="loader loaderWrap">
                <img src={loader} alt="Loading" />
              </span>
            ) : (
              <div className="content-wrap">
                <EmployeeData empID={empID} />
                {
                  <EmployeeRRTable
                    data={appliedJobById}
                    setData={setAppliedJobById}
                  />
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApplicationStatus;
