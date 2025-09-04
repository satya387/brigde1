import React from "react";
import TaskOptionsWithCheckbox from "../../../components/TaskOptionsWithCheckbox";
import * as CONST from "../constant";

const PreReleaseTask = ({
  selfSummaryDetails,
  setSelfSummaryDetails,
  clearForm = false,
}) => {
  const handleValueChange = (value, forField) => {
    let modifiedSelfSummary = {
      ...selfSummaryDetails,
    };
    switch (forField) {
      case CONST.SKILL_MATRIX:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          skillMatrixUpdate: value === "Yes" ? true : false,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.LATEST_UPDATE:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          updatedProfile: value === "Yes" ? true : false,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.LONG_LEAVE:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          longLeave: value === "Yes" ? true : false,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      default:
        break;
    }
  };

  return (
    <div className="pre-release-task-container">
      <h2>{CONST.PRE_RELEASE_HEADING}</h2>
      <TaskOptionsWithCheckbox
        heading={CONST.SKILL_MATRIX}
        onSelectedOption={handleValueChange}
        option1={CONST.OPTION_YES}
        option2={CONST.OPTION_NO}
        clearForm={clearForm}
      />
      <TaskOptionsWithCheckbox
        heading={CONST.LATEST_UPDATE}
        onSelectedOption={handleValueChange}
        option1={CONST.OPTION_YES}
        option2={CONST.OPTION_NO}
        clearForm={clearForm}
      />
      <TaskOptionsWithCheckbox
        heading={CONST.LONG_LEAVE}
        onSelectedOption={handleValueChange}
        option1={CONST.OPTION_YES}
        option2={CONST.OPTION_NO}
        clearForm={clearForm}
      />
    </div>
  );
};

export default PreReleaseTask;
