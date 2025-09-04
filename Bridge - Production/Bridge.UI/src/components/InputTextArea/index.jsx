import React, { useEffect, useState } from "react";
import "./index.scss";

const InputTextArea = ({
  heading,
  maxLength,
  placeholder,
  onValueChange,
  clearForm = false,
  isDisabled = false,
  defaultValue = "",
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (clearForm) {
      setText("");
    }
  }, [clearForm]);

  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    onValueChange(newText, heading);
  };

  return (
    <div className="input-text-area-wrapper">
      <div className="input-header">
        <div className="heading">{heading}</div>
        {!isDisabled && (
          <div className="char-limit">{`${text?.length}/${maxLength} Characters`}</div>
        )}
      </div>
      <div className="input-field">
        <textarea
          className="text-area"
          value={defaultValue === "" ? text : defaultValue}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          cols={50}
          maxLength={maxLength}
          disabled={isDisabled}
          defaultValue={defaultValue}
        />
      </div>
    </div>
  );
};

export default InputTextArea;
