import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import DownArrowBlue from "../../resources/down-arrow-blue-border.svg";
import DownArrowWhite from "../../resources/down-arrow-white-border.svg";
import "../home/home.scss";
import "./index.scss";

const ActionDropdown = ({
  buttonText = "Action",
  uniqueId,
  dropDownOptions,
  handleClick,
  show = false,
  addedClassName = "added-padding",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownMenu, setDrowDownMenu] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getImageSource = () => {
    return isHovered ? DownArrowWhite : DownArrowBlue;
  };

  const handleActionDropdown = () => {
    setDrowDownMenu(!dropdownMenu);
  };

  return (
    <div
      className={`update-status-wrapper-action ${addedClassName} ${
        show ? "no-dis" : ""
      }`}
    >
      <button
        className="btn btn-update"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={handleActionDropdown}
      >
        {buttonText}
        <img
          style={{ marginLeft: 4 }}
          src={getImageSource()}
          alt={`arrow-${uniqueId}`}
        />
      </button>
      {dropdownMenu && (
        <ClickAwayListener onClickAway={() => setDrowDownMenu(false)}>
          <div className={`option-menu-wrapper no-padding`}>
            <ul className="option-menu">
              {dropDownOptions?.length &&
                dropDownOptions?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="option-menu-items"
                      onClick={() => {
                        handleClick(item?.label);
                        setDrowDownMenu(!dropDownOptions);
                      }}
                    >
                      {item?.label}
                    </li>
                  );
                })}
            </ul>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default ActionDropdown;
