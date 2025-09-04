import React, { useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { useSelector } from "react-redux";
import FilterIcon from "../../resources/FilterIcon.svg";
import "../home/home.scss";
import "../../pages/myJobs/index.scss";
import ReactSlider from "react-slider";
import { calculateMinMax } from "../../common/commonMethods";

const FilterInput = ({
  position = "bottom center",
  handleFilter,
  applyOn,
  applySelector,
  slider = false,
  sliderData = [],
  sliderKey = "aging",
}) => {
  const tooltipRef = useRef(null);
  const appliedFiltersHome = useSelector(applySelector);
  const [filterValue, setFilterValue] = useState("");
  const [expValue, setExpValue] = useState([]);
  const [lowerValue, setLowerValue] = useState(0);
  const [upperValue, setUpperValue] = useState(100);

    useEffect(() => {
    if (slider) {
      const val = calculateMinMax(sliderData, sliderKey);
      setLowerValue(val[0]);
      setUpperValue(val[1]);
      setExpValue(val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slider, sliderKey]);

  const handleChange = (e) => {
    if (slider) {
      setExpValue(e);
    } else {
      const val = e.target.value;
      setFilterValue(val);
    }
  };

  const handleFilterChanges = () => {
    if (slider) {
      handleFilter(expValue, applyOn);
    } else {
      handleFilter(filterValue, applyOn);
    }
    setTimeout(() => {
      closeTooltip();
    }, 200);
  };

  const closeTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.close();
    }
  };

  return (
    <Popup
      ref={tooltipRef}
      trigger={(open) => (
        <span
          className={`list-filter-wrapper ${
            open || appliedFiltersHome?.hasOwnProperty(applyOn)
              ? "list-filter-visible"
              : ""
          }`}
        >
          <img
            src={FilterIcon}
            alt="Filter"
            style={{ width: 14, height: 14 }}
          />
        </span>
      )}
      position={position}
      closeOnDocumentClick
    >
      <div className="filter-box-wrapper">
        {!slider && (
          <input
            type="text"
            className="filter-search"
            value={filterValue}
            onChange={handleChange}
          />
        )}
        {slider && (
          <div
            className="crit-cont slide-container"
            style={{ width: 150, marginRight: 20 }}
          >
            <label className="slider-label first-slider-label">
              {lowerValue}
            </label>
            <label
              className="slider-label second-slider-label"
              style={{ left: 120, whiteSpace: "nowrap" }}
            >
              {upperValue}
            </label>
            <ReactSlider
              className="rc-slider"
              thumbClassName="rc-slider-handle "
              trackClassName="rc-slider-rail"
              min={lowerValue}
              max={upperValue}
              value={expValue}
              onChange={handleChange}
              ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              renderThumb={(props, state) => (
                <div {...props}>{state.valueNow}</div>
              )}
              pearling={false} // Disable pearling
              minDistance={1}
            />
          </div>
        )}
        <button className="btn" onClick={handleFilterChanges}>
          Filter
        </button>
      </div>
    </Popup>
  );
};

export default FilterInput;
