import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import ResourceFeedbackForm from "../ResourceFeedbackForm";
import * as CONST from "../ResourceFeedback/constant";
import { fetchEmployeeSummary } from "../../redux/actions/managerActions";
import { isEmpty } from "../../common/commonMethods";

const ViewResourceFeedback = (props) => {
  const dispatch = useDispatch();
  const employeeSummary = useSelector(
    (state) => state.employee.employeeSummary
  );
  const { onClose, header, empId } = props;
  const [formState, setFormState] = useState(null);
  useEffect(() => {
    dispatch(fetchEmployeeSummary(empId));
  }, [dispatch]);
  useEffect(() => {
    if (employeeSummary !== null) {
      setFormState({
        positiveObservations:
          employeeSummary?.managerSummary?.positiveObservations,
        technicalFeedback: employeeSummary?.managerSummary?.technicalFeedback,
        trainingRecommendations:
          employeeSummary?.managerSummary?.trainingRecommendations,
        anyCommitments: employeeSummary?.managerSummary?.anyCommitments,
        releaseFeedBack: {
          label: employeeSummary?.managerSummary?.releaseFeedBack,
          value: employeeSummary?.managerSummary?.releaseFeedBack,
        },
        nineBoxGridRating: {
          label: employeeSummary?.managerSummary?.nineBoxGridRating,
          value: employeeSummary?.managerSummary?.nineBoxGridRating,
        },
        behavioralSkill: {
          label: employeeSummary?.managerSummary?.behavioralSkill,
          value: employeeSummary?.managerSummary?.behavioralSkill,
        },
      });
    }
  }, [employeeSummary]);

  return (
    <div className="modal-overlay modal-resource-feedback">
      <div 
        className={`
            modal-content modal-content-resource-feedback 
            ${isEmpty(employeeSummary?.managerSummary) ? "modal-content-resource-feedback-no-data" : ""}`
        }
      >
        {formState !== null && !isEmpty(employeeSummary?.managerSummary) && (
          <>
            <div className="row-wrapper">
              <div className="modal-header modal-header-resource-feedback">
                <div>{header}</div>
              </div>
            </div>
            <ResourceFeedbackForm
              isDisabled={true}
              constants={CONST}
              formState={formState}
              handleFormState={() => {}}
              // formState={formState}
            />
          </>
        )}
        {
          isEmpty(employeeSummary?.managerSummary) &&
          <div className="self-assessment-form-container">
              <h2>{header}</h2>
              <div className="input-text-area-wrapper">
                  <div className="input-header">
                      <div className="heading">No Summary is Available</div>
                  </div>
              </div>
          </div>
        }
        
        <div className="modal-buttons">
          <button className="cancel modal-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewResourceFeedback;
