import { useEffect, useState } from "react";
import React from 'react';
import { Fragment } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from "../../../components/pagination";
import { Link } from 'react-router-dom';
import "./index.scss";
import { clearRRAgingFilters, fetchRRAgeing, filterRRAging, filterTechnologywiseData, setRRAgingPageCount } from "../../../redux/actions/rrActions";
import { exportToCSV, formatDateToddmmyyyy, isEmpty } from '../../../common/commonMethods';
import backIcon from "../../../resources/back-arrow.svg";
import ReactSlider from "react-slider";
import EmptyComponent from "../../../components/empty/emptyComponent";
import { useDispatch, useSelector } from "react-redux";
import FilterInput from "../../../components/FilterInput";
import ClearFilters from "../../../components/ClearFilters";


const RRAgeingTable = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, SetData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const state = (location.state);
    const rrAgingData = useSelector((state) => state.rr.rrAging) || [];   
    const itemsPerPage = 10;
    const dispatch = useDispatch();
    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [sortedProjectwiseData, SetProjectwiseData] = useState([]);
    const [previousLocation, setPreviousLocation] = useState(null);
    const filterRRAgingData = useSelector((state) => state.rr.filterRRAging);
    const filterProjectwiseData = useSelector((state) => state.rr.filterProjectwise);
    const projectwiseStateData = (useSelector((state) => state.rr.projectwiseTableData) || []);
    const projectwiseData = Object.keys(filterProjectwiseData).length ?  projectwiseStateData : sortedProjectwiseData;

    useEffect(() => {
        let from = location.state?.from;
        setPreviousLocation(from);
    }, [location]);

    const [sliderValue, setSliderValue] = useState([0, 1000]);
    const [rrAgeingData, setRRAgeingData] = useState([]);

    const filteredData = previousLocation !== "rrageing" ? projectwiseData :
        (Object.keys(filterRRAgingData).length ? rrAgingData : rrAgeingData.filter((item) => item.ageing >= sliderValue[0] && item.ageing <= sliderValue[1]));

    useEffect(() => {
        if (rrAgingData.lenght === 0) {
            dispatch(fetchRRAgeing())
            
        }
        const sortedData = rrAgingData.sort((a, b) => {
            const nameA = a.projectName.toUpperCase();
            const nameB = b.projectName.toUpperCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        }).reverse();
        SetProjectwiseData(sortedData)}, []);
    
    useEffect(() => {
        const ageingSortedData = projectwiseData.sort((a, b) => a.ageing - b.ageing).reverse();
        SetData(ageingSortedData);
    }, []);

    useEffect(() => {
        if (state?.data && state?.data?.length > 0)
            setRRAgeingData(state?.data)
    }, [state?.data]);

    const maxAgeing = Math.max(...rrAgeingData.map(o => o.ageing));
    const totalPages = previousLocation === "rrageing" ? Math.ceil(filteredData.length / itemsPerPage) : Math.ceil(projectwiseData.length / itemsPerPage);
    const itemsToShow = previousLocation === "rrageing" ? filteredData.slice(startIndex, endIndex) : projectwiseData.slice(startIndex, endIndex);

    const handleSliderChange = (value) => {
        setSliderValue(value);
        setCurrentPage(1);
    };

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDownload = async (e) => {
        let resp_arr = [];
        const dataforDownload = previousLocation === "rrageing" ? filteredData : projectwiseData;
        const fileName = previousLocation === "rrageing" ? "RR Ageing" : "Projectwise RR Count";
        dataforDownload?.map((item) => {
            let date = item.postedOn
            const dateformat = new Date(date)

            const postedOn = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short' }).format(dateformat);
            const postedOnFormat = postedOn.split(" ")
            const postedOnDate = postedOnFormat[1].concat(" ", postedOnFormat[0]);
            let resp_data = {
                "RR": item.rrNumber,
                "Projects": item.projectName,
                "Job Title": item?.roleRequested,
                "Posted On": postedOnDate,
                "Ageing": item?.ageing
            };
            resp_arr?.push(resp_data);
        });
        exportToCSV(resp_arr, fileName);
    };

    const handleFilter = (value, applyOn) => {
        dispatch(setRRAgingPageCount(1));
        if (previousLocation === "rrageing")
            dispatch(filterRRAging(value, applyOn, "rrageing"));
        else
            dispatch(filterRRAging(value, applyOn, "projectwise"));
    };

    const applySelector = previousLocation === "rrageing" ? ((state) => state?.rr?.rrAging) : ((state) => state?.rr?.projectwiseTableData);
    const sliderData = previousLocation === "rrageing" ? rrAgeingData : projectwiseData;
    return (
        <>
            <div className="right-panel">

                {previousLocation === "rrageing" ? (
                    <span className="projectwise-header">
                        <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                        <h1 className="projectwise-heading">RR Aging ({filteredData.length})</h1>
                        <div className="talents-ageing-filter">
                            <div className="download-button-wrapper">
                                {!isEmpty(filterRRAgingData) && (
                                    <ClearFilters
                                        clearAction={clearRRAgingFilters}
                                        fetchAction={fetchRRAgeing}
                                    />
                                )}
                            </div>
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
                            <button className="talents-text-blue" onClick={(e) => handleDownload(e)}>
                                Download
                            </button>
                        </div>
                    </span>)
                    : (<span className="projectwise-header">

                        <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                        <h1 className="projectwise-header-filter-heading">Projectwise RR Details ({projectwiseData.length})</h1>
                        <div className="download-button-wrapper filters">

                            {!isEmpty(filterProjectwiseData) && (
                                <ClearFilters
                                    clearAction={clearRRAgingFilters}
                                    fetchAction={fetchRRAgeing}
                                />
                            )}
                            <button className="download-button-wrapper text-blue" onClick={(e) => handleDownload(e)}>
                                Download
                            </button>
                        </div>

                    </span>)
                }
                {filteredData.length > 0 ?
                    (
                        <>
                            <ul>
                                <li className="list-header">
                                    <div className="list-flex">RR
                                        <FilterInput
                                            handleFilter={handleFilter}
                                            applyOn={"rrNumber"}
                                            applySelector={applySelector}
                                        /></div>
                                    <div className="list-flex">Project
                                        <FilterInput
                                            handleFilter={handleFilter}
                                            applyOn={"projectName"}
                                            applySelector={applySelector}
                                        />
                                    </div>
                                    <div className="list-flex">Job Title
                                        <FilterInput
                                            handleFilter={handleFilter}
                                            applyOn={"roleRequested"}
                                            applySelector={applySelector}
                                        />
                                    </div>
                                    <div className="list-flex">Aging
                                        <FilterInput
                                            handleFilter={handleFilter}
                                            applyOn={"ageing"}
                                            applySelector={applySelector}
                                            slider
                                            sliderData={sliderData}
                                            sliderKey={"ageing"}
                                        />
                                    </div>
                                    <div>Posted On</div>

                                </li>
                                {itemsToShow?.map((item, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <li key={index} className="list-data">
                                                <div className="tooltip" data-tooltip={item.rrNumber}>
                                                    <Link className="rr-link" to={`/managerrrs?id=${item.rrId}`}>
                                                        {item.rrNumber}
                                                    </Link>
                                                </div>
                                                <div className="tooltip" data-tooltip={item.projectName}>{item.projectName}</div>
                                                <div className="tooltip" data-tooltip={item.roleRequested}>{item.roleRequested}</div>
                                                <div>{item.ageing} days</div>
                                                <div>{formatDateToddmmyyyy(item.postedOn)}</div>

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
                        </>
                    )
                    : <EmptyComponent />}
            </div>
        </>
    )
};

export default RRAgeingTable;