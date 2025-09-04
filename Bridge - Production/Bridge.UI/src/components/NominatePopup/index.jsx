import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import emailIcon from "../../resources/mail.svg";
import skillIcon from "../../resources/skill.svg";
import avatar from "../../resources/user-icon.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import { fetchManagerJobById } from "../../redux/actions/managerActions";
import * as CONST from "./constant";
import "./index.scss";
import "../home/home.scss";
import { styles } from "../../common/constants";
import CustomRROption from "../CustomRROption";

const NominatePopup = ({
  userDetail,
  handleClose,
  selectedRR,
  setSelectedRR,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const allJobs = useSelector((state) => state?.manager?.managerJobByID);

  useEffect(() => {
    if (userDetail) {
      dispatch(
        fetchManagerJobById({
          managerId: "-1",
          employeeId: userDetail?.employeeId || userDetail?.emidsUniqueId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userDetail]);

  const handleRRChange = (val) => {
    setSelectedRR(val);
  };

  const scrollToMenuOption = () => {
    if (selectedRR) {
      setTimeout(() => {
        const childElement = document?.querySelector(
          `#option-${selectedRR?.rrId}`
        );
        const container = document?.querySelector(`.select__menu-list`);
        if (childElement && container) {
          // Calculate the scroll position to make the child element visible
          const containerScrollTop = container.scrollTop;
          const containerHeight = container.clientHeight;
          const childOffsetTop = childElement.offsetTop;
          const childHeight = childElement.offsetHeight;

          // Check if the child element is already in the visible area
          if (
            childOffsetTop >= containerScrollTop &&
            childOffsetTop + childHeight <= containerScrollTop + containerHeight
          ) {
            return; // Child element is already visible, no need to scroll
          }

          // Scroll to the child element
          container.scrollTop = childOffsetTop;
        }
      }, 200);
    }
  };

  const CustomOptionComponent = (props) => {
    return <CustomRROption {...props} />;
  };

  const theme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#533EED",
    },
    spacing: {
      controlHeight: 20,
      menuGutter: 1,
      baseUnit: 2,
    },
  });
  return (
    <>
      <div className="modal-overlay schedule nominate-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{CONST.NOMINATE_HEADER}</h2>
            <p>{CONST.NOMINATE_SUB_HEADER}</p>
          </div>
          <div className="modal-cont">
            <div className="profile-header">
              <div className="img-wrapper">
                <img
                  className="user"
                  src={`${EMPLOYEE_IMG_URL_BASE}${
                    userDetail?.employeeId || userDetail?.emidsUniqueId
                  }.jpeg`}
                  alt=""
                  onError={(e) => {
                    e.target.src = avatar;
                  }}
                />
              </div>
              <div className="head-details">
                <h1>{userDetail?.employeeName}</h1>
                <span>
                  {userDetail?.designation} |{" "}
                  {userDetail?.employeeId || userDetail?.emidsUniqueId}
                </span>
                <span className="contact-details">
                  <span>
                    <img src={emailIcon} alt="Email" />
                    {userDetail?.employeeEmailId ||
                      userDetail?.emailId ||
                      "N/A"}
                  </span>

                  <span className="skills">
                    <img src={skillIcon} alt="Skills" />
                    {userDetail?.primarySkills
                      ?.split(",")
                      .map((skill, index) => (
                        <span key={index}>{skill.trim()}</span>
                      ))}
                  </span>
                </span>
              </div>
            </div>
            {allJobs?.length > 0 && (
              <div className="select-rr">
                <p>{CONST.RR_HEADING}</p>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="rr-select"
                  options={allJobs}
                  value={selectedRR}
                  placeholder={CONST.RR_HEADING}
                  components={{ Option: CustomOptionComponent }}
                  getOptionLabel={(option) => option.rrNumber}
                  getOptionValue={(option) => option.rrNumber}
                  onChange={handleRRChange}
                  onMenuOpen={scrollToMenuOption}
                  theme={theme}
                  styles={styles}
                />
              </div>
            )}
          </div>
          <div className="modal-buttons">
            <button
              className={`modal-button ${selectedRR ? "" : "disabled"}`}
              onClick={handleSubmit}
            >
              Nominate
            </button>
            <button
              className="cancel modal-button"
              onClick={() => {
                setSelectedRR(null);
                handleClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NominatePopup;
