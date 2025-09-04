import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./index.scss";
import * as CONST from "./constant";
import * as GLOBAL_CONST from "../../common/constants";
// import Logout from '../../pages/login/logout';
import { useSelector, useDispatch } from "react-redux";
import {
  clearAvailableResourceFilters,
  clearFutureEmpFilters,
  clearLaunchpadEmpFilters,
  clearManagerReleaseFilters,
  clearReviewApplicationFilters,
  setMatchingResource,
} from "../../redux/actions/managerActions";
import Dropdown from "./Dropdown";
import { clearHomeFilters } from "../../redux/actions/jobActions";
function MenuList({ isManager }) {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);
  const user = JSON.parse(localStorage.getItem("user"));
  const [menusubOpen, setsubMenuOpen] = useState(false);
  const matchingResources = useSelector(
    (state) => state?.manager?.matchingResources
  );

  const menuItems =
    userRole === GLOBAL_CONST.EMPLOYEE
      ? user?.isLaunchpadEmployee
        ? [...CONST.employeeMenuItems, CONST.launchPadAdditionalItem]
        : CONST.employeeMenuItems
      : userRole === GLOBAL_CONST.Manager
      ? CONST.managerMenuItems
      : CONST.WFMTeamMenuItems;

  const [activeItem, setActiveItem] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // State to track menu open/close

  const handleItemClick = (itemId) => {
    if (matchingResources) {
      dispatch(setMatchingResource(!matchingResources));
    }
    if (itemId !== 1) {
      dispatch(clearHomeFilters());
    }
    if (itemId !== 3 && userRole === GLOBAL_CONST.Manager) {
      dispatch(clearReviewApplicationFilters());
    }
    if (itemId !== 5 && userRole === GLOBAL_CONST.Manager) {
      dispatch(clearLaunchpadEmpFilters());
      dispatch(clearFutureEmpFilters());
    }
    if (itemId !== 2 && userRole === GLOBAL_CONST.WFMTeam) {
      dispatch(clearAvailableResourceFilters());
      dispatch(clearFutureEmpFilters());
    }
    if (itemId !== 4 && userRole === GLOBAL_CONST.Manager) {
      dispatch(clearManagerReleaseFilters());
    }
    setActiveItem(itemId);
    setMenuOpen(false); // Close the menu after an item is clicked
  };

  // Function to toggle the menu open/close
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className={`menu-container ${menuOpen ? "collapse" : ""}`}>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <div className="menu-list">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={`menu-item ${activeItem === item.id ? "active" : ""}`}
              onClick={() => handleItemClick(item.id)}
            >
              <img
                src={item.icon}
                alt={item.title}
                id={`imgtest${item.id}`}
                className="menu-icon"
              />
              <span>
                {item.title}
                <div>
                  {" "}
                  {menusubOpen === true && Array.isArray(item?.submenu) ? (
                    <Dropdown submenus={item?.submenu} />
                  ) : (
                    <div></div>
                  )}
                </div>
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default MenuList;
