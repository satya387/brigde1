import React from "react";
import InputTextArea from "../../../components/InputTextArea";
import TaskOptionsWithCheckbox from "../../../components/TaskOptionsWithCheckbox";
import * as CONST from "../constant";
import "../index.scss";

const SelfSummaryForm = ({
  selfSummaryDetails,
  setSelfSummaryDetails,
  clearForm = false,
  isDisabled,
  defaultValues = {},
}) => {
  const handleShiftQuery = (option, forField) => {
    const modifiedSelfSummary = {
      ...selfSummaryDetails,
      workInShift: option === "Yes" ? true : false,
    };
    setSelfSummaryDetails(modifiedSelfSummary);
  };

  const handleValueChange = (value, forField) => {
    // Use switch case to perform different actions based on the value of newText
    let modifiedSelfSummary = {
      ...selfSummaryDetails,
    };
    switch (forField) {
      case CONST.KEY_ACHIEVEMENT:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          keyProfessionalAchievements: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.CURRENT_ACHIEVEMENT:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          contributionCurrentProject: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.SKILLS_IDENTIFIED:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          threeSkillsIdentified: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.IMPROVEMENT_AREA:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          areasForImprovement: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.ASPIRATION:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          nextRoleAspiration: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.TECH_PREFERENCE:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          techStackPreference: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      case CONST.GEO_PREFRENCE:
        modifiedSelfSummary = {
          ...selfSummaryDetails,
          geographyPreference: value,
        };
        setSelfSummaryDetails(modifiedSelfSummary);
        break;
      default:
        break;
    }
  };

  return (
    <div className="self-assessment-form-container">
      <h2>{CONST.SELF_ASSESSMENT}</h2>
      <InputTextArea
        heading={CONST.KEY_ACHIEVEMENT}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.KEY_ACHIEVEMENT_PLACEHOLDER}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.keyProfessionalAchievements}
      />
      <InputTextArea
        heading={CONST.CURRENT_ACHIEVEMENT}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.CURRENT_ACHIEVEMENT_PLACEHOLDER}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.contributionCurrentProject}
      />
      <InputTextArea
        heading={CONST.SKILLS_IDENTIFIED}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.SKILLS_IDENTIFIED_PLACEHOLDER}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.threeSkillsIdentified}
      />
      <InputTextArea
        heading={CONST.IMPROVEMENT_AREA}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.IMPROVEMENT_AREA}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.areasForImprovement}
      />
      <InputTextArea
        heading={CONST.ASPIRATION}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.ASPIRATION_PLACEHOLDER}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.nextRoleAspiration}
      />
      <InputTextArea
        heading={CONST.TECH_PREFERENCE}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.TECH_PREFERENCE_PLACEHOLDER}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.techStackPreference}
      />
      <InputTextArea
        heading={CONST.GEO_PREFRENCE}
        maxLength={CONST.MAX_LENGTH}
        placeholder={CONST.GEO_PREFRENCE_PLACEHOLDER}
        onValueChange={handleValueChange}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.geographyPreference}
      />
      <TaskOptionsWithCheckbox
        heading={CONST.SHIFT_QUERY}
        onSelectedOption={handleShiftQuery}
        option1={CONST.OPTION_YES}
        option2={CONST.OPTION_NO}
        isDisabled={isDisabled}
        clearForm={clearForm}
        defaultValue={defaultValues?.workInShift}
      />
    </div>
  );
};

export default SelfSummaryForm;
