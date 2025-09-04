import React from "react";

const TextAreaWrapper=(props)=>{
    const {
        title,
        value,
        field,
        handleFormState,
        isDisabled = false
    } = props
    return (
        <div className="textarea-wrapper">
            <div className="header-container">
                <div className="date-header">{title}</div>
                {!isDisabled && <div className="date-header">{`${300 - value?.length}`} Character</div>}
            </div>
            <textarea
                className="postive-observations textarea-class"
                rows={4}
                cols={114}
                maxLength={300}
                value={value}
                onChange={(event) => handleFormState(event.target.value, field)}
                placeholder="Write an additional comment if you have"
                disabled={isDisabled}
            />
        </div>        
    );
};

export default TextAreaWrapper;
