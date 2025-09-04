import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SelfSummaryForm from "../../pages/SelfSummary/SelfSummaryForm";
import { fetchEmployeeSummary } from "../../redux/actions/managerActions";
import { isEmpty } from "../../common/commonMethods";
import * as CONST from "../../pages/SelfSummary/constant";
import "react-datepicker/dist/react-datepicker.css";

const ViewSelfSummaryForm=(props)=>{
    const dispatch = useDispatch();
    const employeeSummary = useSelector((state) => state.employee.employeeSummary);
    const {
        onClose,
        header,
        empId
    } = props
    const [selfSummaryDetails, setSelfSummaryDetails] = useState(null);
    useEffect(() => {
        dispatch(fetchEmployeeSummary(empId));
    }, [dispatch])
    useEffect(() => {
        if(employeeSummary !== null){
            setSelfSummaryDetails({
                keyProfessionalAchievements: employeeSummary?.employeeSummary?.keyProfessionalAchievements,
                contributionCurrentProject: employeeSummary?.employeeSummary?.contributionCurrentProject,
                threeSkillsIdentified: employeeSummary?.employeeSummary?.threeSkillsIdentified,
                areasForImprovement: employeeSummary?.employeeSummary?.areasForImprovement,
                nextRoleAspiration: employeeSummary?.employeeSummary?.nextRoleAspiration,
                techStackPreference: employeeSummary?.employeeSummary?.techStackPreference,
                geographyPreference: employeeSummary?.employeeSummary?.geographyPreference,
                workInShift: employeeSummary?.employeeSummary?.workInShift,
                skillMatrixUpdate: employeeSummary?.employeeSummary?.skillMatrixUpdate,
                updatedProfile: employeeSummary?.employeeSummary?.updatedProfile,
                longLeave: employeeSummary?.employeeSummary?.longLeave,
            })
        }
    }, [employeeSummary])

    return (
        <div className="modal-overlay modal-resource-feedback" >
            <div
                className={`
                    modal-content modal-content-resource-feedback 
                    ${isEmpty(employeeSummary?.employeeSummary) ? "modal-content-resource-feedback-no-data" : ""}`
                }
            >
                {
                    !isEmpty(employeeSummary?.employeeSummary) ? selfSummaryDetails &&
                    <SelfSummaryForm
                        selfSummaryDetails={null}
                        setSelfSummaryDetails={() => {}}
                        isDisabled={true}
                        defaultValues={selfSummaryDetails}
                    />
                    :
                    <div className="self-assessment-form-container">
                        <h2>{CONST.SELF_ASSESSMENT}</h2>
                        <div className="input-text-area-wrapper">
                            <div className="input-header">
                                <div className="heading">No Self Summary is Available</div>
                            </div>
                        </div>
                    </div>
                }
                <div className="modal-buttons">
                    <button className="cancel modal-button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewSelfSummaryForm;
