import React, { useEffect } from "react";
import "../index.scss";
import { useDispatch, useSelector } from "react-redux";
import ProfileHeader from "../../profile/ProfileHeader";
import { fetchEmployeeProfile } from "../../../redux/actions/employeeActions";

const EmployeeData = ({ empID }) => {
  const employeeData = useSelector((state) => state.employee.employeeProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (empID && employeeData === null) {
      dispatch(fetchEmployeeProfile(empID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, empID]);

  return (
    <div className="employee-detail-wrapper">
      {employeeData && (
        <ProfileHeader
          employeeData={employeeData}
          showProfileCompleteness={false}
        />
      )}
    </div>
  );
};

export default EmployeeData;
