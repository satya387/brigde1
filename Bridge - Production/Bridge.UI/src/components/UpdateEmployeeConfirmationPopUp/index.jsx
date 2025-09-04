import React, { useEffect, useState } from "react";
import { formateDateFromddmmyyyyTommddyyyy } from "../../common/commonMethods";

const UpdateEmployeeConfirmationPopUp = ({ userDetail, effectiveDate, selectedStatus, handleConfirmationSubmit, handleConfirmationCancel }) => {
    
    const date = new Date(effectiveDate ? effectiveDate : userDetail?.effectiveTill ? formateDateFromddmmyyyyTommddyyyy(userDetail?.effectiveTill) : new Date());
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();

    const isEffectiveDateMsgVisible = () => {
        return !(selectedStatus === "" && userDetail?.availability === "Available" || selectedStatus === 'Available')
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content auto-width max-width-600 pb-15">
                <div className="emp-confirm-popup-container">
                    <div className="emp-confirm-popup">
                        <div className="emp-confirm-popup-header">
                            <div className="emp-confirm-popup-header-text">
                                Are you sure you want to update <b>{userDetail.employeeName}</b> status as {selectedStatus ? selectedStatus : userDetail?.availability}
                                ? {isEffectiveDateMsgVisible() && <>The effective date is selected as <b>{day} {month} </b>.</>}
                            </div>
                        </div>
                        <div className="center-modal-buttons">
                            <button className="cancel modal-button"
                            onClick={handleConfirmationCancel}
                            ><b>Cancel</b></button>
                            <button className={`modal-button`}
                            onClick={() => handleConfirmationSubmit()}
                            ><b>Yes, Proceed</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployeeConfirmationPopUp;
