import React from "react";
import './index.scss';

const ReleaseActionDropDown = ({employeeData, handleReleasePopup, handleWithdraw, handleNotesClick}) => {
    return (
        <div className={`update-status-wrapper`}>
            <button className="btn btn-update" onClick={handleReleasePopup}>{employeeData?.status === 'Active' ? 'Release' : 'Edit'}</button> &nbsp;
            <button className="btn btn-update" onClick={employeeData?.status === 'Active' ? handleNotesClick : handleWithdraw}>{employeeData?.status === 'Active' ? 'Notes' : 'Withdraw'}</button>
        </div>
    )
};

export default ReleaseActionDropDown;