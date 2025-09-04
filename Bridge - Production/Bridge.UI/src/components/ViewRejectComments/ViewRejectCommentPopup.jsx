import React from "react";
import Popup from 'reactjs-popup';
import '../../components/home/home.scss';
import '../../components/ConfirmationPopup/ConfirmationPopup.scss'

const ViewRejectCommentPopup = ({confirmationPopup, handleConfirmationAction, confirmationMessage})=>{
    return (
        <Popup
        open={confirmationPopup}
        onClose={() => handleConfirmationAction()}
        closeOnDocumentClick={false}
            >
            <div className="modal-overlay">
                <div className="modal-content auto-width max-width-400 pb-15">
                <div className="modal-header">
                        <h2>View Reject Comments</h2>
                    </div>
                    <div>{confirmationMessage}</div>
                    <div className="modal-buttons">
                        <button className="cancel modal-button" onClick={() => handleConfirmationAction()}>Ok</button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default ViewRejectCommentPopup;