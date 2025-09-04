import React from "react";
import "./header.scss";
import logo from "../../resources/logo.svg";
import { useSelector } from "react-redux";
import avatar from "../../resources/user-icon.svg";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../search/searchComponent";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";

const Header = () => {
  let navigate = useNavigate();
  const employeeId = useSelector((state) => state.user.employeeId);
  const employeeImage = `${EMPLOYEE_IMG_URL_BASE}${employeeId}.jpeg`;

  const onClickingHome = () => {
    navigate("/home");
  };

  const onClickingProfile = () => {
    navigate(`/profile/${employeeId}`);
  };

  return (
    <div className="header">
      <div className="toolbar">
        <div className="logo-wrap">
          <img
            src={logo}
            className="logo"
            onClick={onClickingHome}
            alt="Emids"
          />
        </div>
        <div className="iconsbox">
          <SearchComponent />
          <div
            size="medium"
            color="inherit"
            className="icon my-profile"
            onClick={onClickingProfile}
          >
            <img
              className="user"
              src={employeeImage}
              alt=""
              onError={(e) => {
                e.target.src = avatar;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
