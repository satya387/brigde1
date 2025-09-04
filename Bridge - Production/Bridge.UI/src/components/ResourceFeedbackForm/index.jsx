import React, { useEffect } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import TextAreaWrapper from "../TextAreaWrapper";
import { styles } from "../../common/constants";

const ResourceFeedbackForm = (props) => {
  const { isDisabled, constants, formState, handleFormState } = props;

  return (
    <>
      <div className="row-wrapper">
        <div className="dropdown-wrapper">
          <div className="date-header">Overall feedback of the Talent</div>
          <Select
            className="basic-single"
            classNamePrefix="select"
            name="release-feedback"
            options={constants.RELEASE_FEEDBACK_ARRAY}
            onChange={(value) =>
              handleFormState(
                value?.value,
                constants.FORM_FIELDS.releaseFeedBack
              )
            }
            defaultValue={formState?.releaseFeedBack}
            placeholder={"Select feedback from the dropdown"}
            isDisabled={isDisabled}
            theme={(theme) => ({
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
            })}
            styles={styles}
          />
        </div>
        <div className="dropdown-wrapper">
          <div className="date-header">9 Box Grid Rating</div>
          <Select
            className="basic-single"
            classNamePrefix="select"
            name="box-grid-rating"
            options={constants.NINE_BOX_GRID_RATING_ARRAY}
            onChange={(value) =>
              handleFormState(
                value?.value,
                constants.FORM_FIELDS.nineBoxGridRating
              )
            }
            defaultValue={formState?.nineBoxGridRating}
            placeholder={"Select the rating"}
            isDisabled={isDisabled}
            theme={(theme) => ({
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
            })}
            styles={styles}
          />
        </div>
      </div>
      <div className="row-wrapper">
        <TextAreaWrapper
          title="Positive Observations"
          value={formState?.positiveObservations}
          field={constants.FORM_FIELDS.positiveObservations}
          handleFormState={handleFormState}
          isDisabled={isDisabled}
        />
      </div>
      <div className="row-wrapper">
        <TextAreaWrapper
          title="Technical Feedback"
          value={formState?.technicalFeedback}
          field={constants.FORM_FIELDS.technicalFeedback}
          handleFormState={handleFormState}
          isDisabled={isDisabled}
        />
      </div>
      <div className="row-wrapper">
        <div className="dropdown-wrapper">
          <div className="date-header">Behavioral Skills</div>
          <Select
            className="basic-single"
            classNamePrefix="select"
            name="release-reason"
            options={constants.BEHAVIORAL_SKILLS_ARRAY}
            onChange={(value) =>
              handleFormState(
                value?.value,
                constants.FORM_FIELDS.behavioralSkill
              )
            }
            defaultValue={formState?.behavioralSkill}
            placeholder={"Select skills from the dropdown"}
            isDisabled={isDisabled}
            theme={(theme) => ({
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
            })}
            styles={styles}
          />
        </div>
      </div>
      <div className="row-wrapper">
        <TextAreaWrapper
          title="Training Recommendations"
          value={formState?.trainingRecommendations}
          field={constants.FORM_FIELDS.trainingRecommendations}
          handleFormState={handleFormState}
          isDisabled={isDisabled}
        />
      </div>
      <div className="row-wrapper">
        <TextAreaWrapper
          title="Any Commitments"
          value={formState?.anyCommitments}
          field={constants.FORM_FIELDS.anyCommitments}
          handleFormState={handleFormState}
          isDisabled={isDisabled}
        />
      </div>
    </>
  );
};

export default ResourceFeedbackForm;
