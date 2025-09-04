import React from "react";
import Popup from 'reactjs-popup';
import '../../components/home/home.scss';
import './ConfirmationPopup.scss'

const ConfirmationPopup = ({confirmationPopup, handleConfirmationAction, confirmationMessage, job})=>{
    return (
        <Popup
        open={confirmationPopup}
        onClose={() => handleConfirmationAction("No")}
        closeOnDocumentClick={false}
            >
            <div className="modal-overlay">
                <div className="modal-content auto-width max-width-400 pb-15">
                    <div>{confirmationMessage}</div>
                    <div className="modal-buttons">
                        <button className="cancel modal-button" onClick={() => handleConfirmationAction("No")}>No</button>
                        <button className="modal-button" onClick={() => handleConfirmationAction("Yes", job)}>Yes</button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default ConfirmationPopup;