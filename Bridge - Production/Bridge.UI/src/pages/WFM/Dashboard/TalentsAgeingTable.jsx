import { useState } from "react";
import React from 'react';
import { Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import Pagination from "../../../components/pagination";
import { Link } from 'react-router-dom';
import { EMPLOYEE_IMG_URL_BASE } from "../../../config";
import avatar from "../../../resources/user-icon.svg";
import { exportToCSV } from '../../../common/commonMethods';
import ReactSlider from "react-slider";
import EmptyComponent from "../../../components/empty/emptyComponent";
import backIcon from "../../../resources/back-arrow.svg";
import FilterInput from "../../../components/FilterInput";
import { useDispatch, useSelector } from "react-redux";
import {
  setTalentAgingPageCount,
  filterTalentAgeingPage,
  clearTalentAgeingPageFilters,
  fetchLaunchpadEmployees
} from "../../../redux/actions/managerActions";
import ClearFilters from "../../../components/ClearFilters";
import { isEmpty } from "../../../common/commonMethods";

const TalentsAgeingTable = (props) => {
  const filterTalentAgeingData = useSelector(
    (state) => state?.manager?.filterTalentAgeing);
  const dispatch = useDispatch();
  const propsData = props.data;
  const [currentPage, setCurrentPage] = useState(1);
  const maxAgeing = Math.max(...propsData.map(o => o.aging));
  const [sliderValue, setSliderValue] = useState([0, 1000]);
  const lanchpadEmpListData = useSelector((state) => state.manager.lanchpadEmpList) || [];

  //const filteredData = propsData.filter((item) => item.aging >= sliderValue[0] && item.aging <= sliderValue[1]);
  const filteredData = lanchpadEmpListData.filter((item) => item.aging >= sliderValue[0] && item.aging <= sliderValue[1]);
  const navigate = useNavigate();

  const itemsPerPage = 10;
  // Apply sorting to the jobData array
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToShow = filteredData.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilter = (value, applyOn) => {
    dispatch(setTalentAgingPageCount(1));
    dispatch(filterTalentAgeingPage(value, applyOn));
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    setCurrentPage(1);
  };

  const handleDownload = async (e) => {
    let resp_arr = [];
    filteredData?.map((item) => {
      let resp_data = {
        "Name": item?.employeeName,
        "Job Title": item?.designation,
        "Experience": item?.experience,
        "Ageing": item?.aging
      };
      resp_arr?.push(resp_data);
    });
    exportToCSV(resp_arr, "Talents Ageing");
  };

  return (
    <>

      <div className="right-panel">
        <div className="page-header">
          <span className="projectwise-header">
            <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>

            <h1 className="projectwise-heading talents-heading">Talents Aging ({filteredData.length})</h1>
          </span>
          <div className="talents-ageing-filter">
          {!isEmpty(filterTalentAgeingData) && (
            <ClearFilters
              clearAction={clearTalentAgeingPageFilters}
              fetchAction={fetchLaunchpadEmployees}
              params={-1}
            />
          )}
            <ReactSlider
              className="talents-rc-slider"
              thumbClassName="rc-slider-handle "
              trackClassName="rc-slider-rail"
              min={0}
              max={maxAgeing}
              value={sliderValue}
              onChange={handleSliderChange}
              ariaLabel={["Lower thumb", "Upper thumb"]}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              renderThumb={(props, state) => (
                <div {...props}>{state.valueNow}</div>
              )}
              pearling
              minDistance={1}
            />

            <button
              className="talents-text-blue"
              onClick={(e) => handleDownload(e)}
            >
              Download
            </button>
          </div>
        </div>
        {filteredData.length > 0 ? (
          <>
            <ul>
              <li className="list-header">
                <div className="list-flex">Name
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"employeeName"}
                    applySelector={(state) =>
                      state.manager.lanchpadEmpList
                    }
                  />
                </div>
                <div className="list-flex">Job Title
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"designation"}
                    applySelector={(state) =>
                      state.manager.lanchpadEmpList
                    }
                  />
                </div>
                <div className="list-flex">Experience
                  <FilterInput
                    handleFilter={handleFilter}
                    applyOn={"experience"}
                    applySelector={(state) =>
                      state.manager.lanchpadEmpList
                    }
                    slider
                    sliderData={lanchpadEmpListData}
                    sliderKey={"experience"}
                  /></div>
                <div>Aging</div>
              </li>

              {itemsToShow?.map((item, index) => {
                const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${item?.employeeId}.jpeg`;
                return (
                  <Fragment key={index}>
                    <li key={index} className="list-data">
                      <div className="tooltip" data-tooltip={item.employeeName}>
                        <Link
                          className="list-data-emp-head"
                          to={`/m-available-resources/${item.employeeId}`}
                        >
                          <span>
                            {employeeImg && (
                              <img
                                className="empimg"
                                src={employeeImg}
                                alt=""
                                onError={(e) => (e.target.src = avatar)}
                              />
                            )}
                          </span>
                          <span>{item.employeeName}</span>
                        </Link>
                      </div>
                      <div className="tooltip" data-tooltip={item.designation}>{item.designation}</div>
                      <div>{item.experience} years</div>
                      <div>{item.aging} days</div>
                    </li>
                  </Fragment>
                );
              })}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </>)
          : <EmptyComponent />}
      </div>
    </>
  )
};

export default TalentsAgeingTable;