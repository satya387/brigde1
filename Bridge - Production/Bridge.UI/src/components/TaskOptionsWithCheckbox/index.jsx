import React, { useEffect, useState } from "react";
import "./index.scss";

const TaskOptionsWithCheckbox = ({
  heading,
  onSelectedOption,
  option1,
  option2,
  clearForm = false,
  isDisabled = false,
  defaultValue = "",
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (clearForm) {
      setSelectedOption(null);
    }
  }, [clearForm]);

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    onSelectedOption(option, heading); // Call the callback function with the selected option
  };

  return (
    <div className="option-container">
      <h2 className="option-heading">{heading}</h2>
      <div className="option-wrapper">
        <label className="option-label">
          <input
            className="option-checkbox"
            type="checkbox"
            value={option1}
            checked={
              defaultValue === "" ? selectedOption === option1 : defaultValue
            }
            onChange={() => handleCheckboxChange(option1)}
            disabled={isDisabled}
          />
          {option1}
        </label>
        <label className="option-label">
          <input
            className="option-checkbox"
            type="checkbox"
            value={option2}
            checked={
              defaultValue === "" ? selectedOption === option2 : !defaultValue
            }
            onChange={() => handleCheckboxChange(option2)}
            disabled={isDisabled}
          />
          {option2}
        </label>
      </div>
    </div>
  );
};

export default TaskOptionsWithCheckbox;
