import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../../components/home/home.scss';
import * as CONST from './constant';
import './Report.scss';

const DateSelector =({
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate,
    handleView,
    headerTitle,
})=>{

    const handleDateChange = (date) => {
        // Check if the selected date is the same as the current date
        const isSameDate = date.getDate() === new Date().getDate() &&
                           date.getMonth() === new Date().getMonth() &&
                           date.getFullYear() === new Date().getFullYear();
    
        // If the selected date is the same as the current date, set the time to the current time
        if (isSameDate) {
          const currentTime = new Date();
          date.setHours(currentTime.getHours());
          date.setMinutes(currentTime.getMinutes());
        }
    
        // Update the state with the modified date
        setEndDate(date);
      };
    
    return (
        <>
            <div className="page-header">
                <h1>{headerTitle}</h1>
            </div>
            <div className="date-range-wrapper">
                <div className="range-wrap">
                    <div className="range-cont">
                        <label htmlFor="range-picker-start" className="label-range">From</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={new Date()}
                            className="range-picker range-picker-start"
                            id="range-picker-start"
                            dateFormat="MMMM d, yyyy"
                            placeholderText="MM/DD/YYYY"
                        />
                    </div>
                    <div className="range-cont">
                        <label htmlFor="range-picker-end" className="label-range">To</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => handleDateChange(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            maxDate={new Date()}
                            className="range-picker range-picker-end"
                            id="range-picker-end"
                            dateFormat="MMMM d, yyyy"
                            placeholderText="MM/DD/YYYY"
                        />
                    </div>
                    <button className={`blue-btn btn show view ${startDate && endDate ? '' : 'disabled'}`} onClick={handleView}>{CONST.VIEW_BUTTON}</button>
                </div>
            </div>
        </>
    );
};

export default DateSelector;
