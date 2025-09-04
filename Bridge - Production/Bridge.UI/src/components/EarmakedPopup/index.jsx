import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import * as CONST from './constant';
import { styles } from "../../common/constants";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import emailIcon from "../../resources/mail.svg";
import skillIcon from "../../resources/skill.svg";
import avatar from "../../resources/user-icon.svg";
import { getWFMTeamList, fetchManagerJobById } from '../../redux/actions/managerActions';
import { formateDateFromddmmyyyyTommddyyyy } from "../../common/commonMethods";
import CustomRROption from "../CustomRROption";
import './index.scss';

const EarmakedPopup = (props) => {

    const {
        userDetail,
        closEarmakedPopup,
        resourceAvailabilityPopup,
        selectedStatus,
        setSelectedAvailableStatus,
        selectedWFMSpocName,
        setSelectedWFMSpocName,
        effectiveDateForEarmark,
        setEffecttiveDateForEarmark,
        handleSubmitClick,
        selectedRRForEarmark,
        setSelectedRRForEarmark,
        allocationPercentage,
        setAllocationPercentage,
        handleEarmarkClick
    } = props;

    const dispatch = useDispatch();
    const wfmTeamList = useSelector((state) => state.manager.getWFMTeamList);
    const allJobs = useSelector((state) => state?.manager?.managerJobByID);
    const managerId = useSelector((state) => state.user.employeeId);
    const employeeData = useSelector((state) => state.employee.employeeProfile);

    const findDefaultOptionValue = (arrayValues, defaultOption, label = 'label') => {
        return arrayValues.find(element => element[label] === defaultOption)
    }

    const handleAvailableStatusChange = (selectedOption) => {
        setSelectedAvailableStatus(selectedOption.value);
    };

    const handleWfmNameChange = (selectedOption) => {
        setSelectedWFMSpocName(selectedOption.employeeName);
    }

    const [confirmationPopup, setConfirmationPopup] = useState(false);

    useEffect(() => {
        dispatch(getWFMTeamList());
    }, [dispatch])

    const isSubmitButtonEnabled = () => {
        return selectedRRForEarmark !== undefined && effectiveDateForEarmark !== undefined && allocationPercentage !== 0
    }

    const CustomOptionComponent = (props) => {
        return <CustomRROption {...props} />;
    };

    const handleRRChange = (val) => {
        setSelectedRRForEarmark(val);
    };

    useEffect(() => {
        const requestData = {
            managerId: "-1",
            employeeId: userDetail?.employeeId,
        };
        dispatch(fetchManagerJobById(requestData));
    }, [dispatch, userDetail?.employeeId, managerId]);

    const scrollToMenuOption = () => {
        if (selectedRRForEarmark) {
          setTimeout(() => {
            const childElement = document?.querySelector(
              `#option-${selectedRRForEarmark?.rrId}`
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
        <div className="modal-overlay modal-interview-rejection">
            <div className="modal-content modal-content-rejection">
                <div className="modal-header modal-header-rejection">
                    <h2>{CONST.HEADER}</h2>
                </div>

                <div className="modal-header-rejection">
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
                            {employeeData?.emailId ||
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
                            value={selectedRRForEarmark}
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

                <div className="wfm-wrapper">
                    <div className="calendar">
                        <div className="rejection-header">Effective Date <span className="required-field">*</span></div>
                        <div className="calendar-input">
                            {
                                <DatePicker
                                    selected={effectiveDateForEarmark}
                                    onChange={(date) => setEffecttiveDateForEarmark(date)}
                                    minDate={new Date()}
                                    autoFocus={false}
                                    preventOpenOnFocus
                                    id="date-picker-allocation"
                                    dateFormat="MMMM d, yyyy"
                                    className="date-picker"
                                    calendarClassName="date-picker-allocation"
                                    placeholderText="MM/DD/YYYY"
                                />
                            }
                        </div></div>
                    <div className="rejection-reason-wrapper">
                        <div className="rejection-header">% Allocation</div>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={allocationPercentage}
                            onChange={e => setAllocationPercentage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="modal-buttons">
                    <button className="cancel modal-button" onClick={closEarmakedPopup}>Cancel</button>
                    <button className={`modal-button ${isSubmitButtonEnabled() ? '' : 'disabled'}`} disabled={!isSubmitButtonEnabled()} onClick={() => handleEarmarkClick()}>Earmark</button>
                </div>
            </div>
        </div>
    );
};

export default EarmakedPopup;