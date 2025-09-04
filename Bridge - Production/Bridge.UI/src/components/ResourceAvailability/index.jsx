import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import * as CONST from './constant';
import { styles } from "../../common/constants";
import { EMPLOYEE_IMG_URL_BASE } from "../../config";
import avatar from "../../resources/user-icon.svg";
import { getWFMTeamList } from '../../redux/actions/managerActions';
import { formateDateFromddmmyyyyTommddyyyy } from "../../common/commonMethods";
import './index.scss';

const ResourceAvailability = (props) => {
    const {
        userDetail,
        closehandleResourceAvailabilityPopup,
        resourceAvailabilityPopup,
        selectedStatus,
        setSelectedAvailableStatus,
        selectedWFMSpocName,
        setSelectedWFMSpocName,
        effectiveDate,
        setEffecttiveDate,
        handleSubmitClick
    } = props;
    const dispatch = useDispatch();
    const wfmTeamList = useSelector((state) => state.manager.getWFMTeamList);

    const statusValues = [
        { label: 'Available', value: 'Available' },
        { label: 'Unavailable Pool', value: 'Unavailable Pool' },
        { label: 'Resigned', value: 'Resigned' },
        { label: 'Maternity Leave', value: 'Maternity Leave' },
        { label: 'PIP', value: 'PIP' },
        { label: 'Customer interview', value: 'Customer interview' },
        { label: 'Furlough', value: 'Furlough' },
        { label: 'Undergoing Training', value: 'Undergoing Training' },
        { label: 'Partial allocation', value: 'Partial allocation' }
    ];
   
    statusValues.sort((a, b) => a.label.localeCompare(b.label));

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
        return selectedStatus !== "" || effectiveDate !== undefined || selectedWFMSpocName !== ""
    }

    return (
        <div className="modal-overlay modal-interview-rejection">
            <div className="modal-content modal-content-rejection">
                <div className="modal-header modal-header-rejection">
                    <h2>{CONST.HEADER}</h2>
                    <p>{CONST.SUB_HEADING}</p>
                </div>

                <div className="modal-cont modal-cont-rejection">
                    <img className="profile-img" src={`${EMPLOYEE_IMG_URL_BASE}${userDetail.employeeId}.jpeg`} alt="" onError={(e) => e.target.src = avatar} />
                    <div className="auto-width">
                        <div className="auto-width employee-name">{userDetail.employeeName}</div>
                        <div className="auto-width employee-detail-wrap">
                            <span className="employee-detail">{userDetail?.designation}</span>
                            <span className="seprator"></span>
                            <span className="employee-detail">{userDetail.employeeId}</span>
                        </div>
                        <div className="auto-width rr-details-wrap">
                        </div>
                    </div>
                </div>

                {statusValues?.length > 0 && <div className="rejection-reason-wrapper">
                    <div className="rejection-header">{CONST.AVAILABLE_STATUS} <span className="required-field">*</span></div>
                    {
                        userDetail?.availability &&
                        <Select
                            selected={selectedStatus}
                            defaultValue={findDefaultOptionValue(statusValues, userDetail?.availability)}
                            className="basic-single"
                            classNamePrefix="select"
                            name="statusValues"
                            options={statusValues}
                            onChange={handleAvailableStatusChange}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: '#533EED',
                                },
                            })}
                            styles={styles}
                        />
                    }
                </div>}

                <div className="wfm-wrapper">
                    <div className="calendar">
                        <div className="rejection-header">{CONST.EFFECTIVE_TILL} <span className="required-field">*</span></div>
                        <div className="calendar-input">
                            {
                                <DatePicker
                                    selected={!effectiveDate ? userDetail?.effectiveTill ? new Date(formateDateFromddmmyyyyTommddyyyy(userDetail?.effectiveTill)) : new Date() : new Date(effectiveDate)}
                                    onChange={(date) => setEffecttiveDate(date)}
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
                        <div className="rejection-header">{CONST.WFM_SPOC}</div>
                        {
                            wfmTeamList?.length > 0 && 
                            <Select
                                selected={selectedWFMSpocName}
                                defaultValue={findDefaultOptionValue(wfmTeamList, userDetail?.wfmSpoc, CONST.EMPLOYEE_NAME)}
                                className="basic-single"
                                classNamePrefix="select"
                                name="wfmTeamList"
                                options={wfmTeamList}
                                onChange={handleWfmNameChange}
                                getOptionLabel={(option) => option?.employeeName}
                                getOptionValue={(option) => option?.employeeName}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary: '#533EED',
                                    },
                                })}
                                styles={styles}
                            />
                        }
                    </div>
                </div>

                <div className="modal-buttons">
                    <button className="cancel modal-button" onClick={closehandleResourceAvailabilityPopup}>Cancel</button>
                    <button className={`modal-button ${isSubmitButtonEnabled() ? '' : 'disabled'}`} disabled={!isSubmitButtonEnabled()} onClick={() => handleSubmitClick(userDetail)}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ResourceAvailability;