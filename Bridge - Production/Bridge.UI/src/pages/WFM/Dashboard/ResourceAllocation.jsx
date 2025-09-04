import { Fragment, useEffect, useState } from "react";
import Pagination from "../../../components/pagination";
import { Link, useNavigate } from "react-router-dom";
import backIcon from "../../../resources/back-arrow.svg";
import { exportToCSV, formatDateToddmmyyyy, isEmpty } from "../../../common/commonMethods";
import { ScheduledActiveRRsAction, sortResourceAllocation, filterResourceAllocation } from "../../../redux/actions/wfmActions";
import { useDispatch, useSelector } from "react-redux";
import loaderImage from "../../../resources/Loader.svg";
import EmptyComponent from "../../../components/empty/emptyComponent";
import FilterInput from "../../../components/FilterInput";
import { setResourceAllocationPageCount } from "../../../redux/actions/wfmActions";
import { clearResourceAllocationFilters } from "../../../redux/actions/wfmActions";
import ClearFilters from "../../../components/ClearFilters";


const ResourceAllocation = (props) => {
    const data = props?.data;
    const title = props?.title;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const rrDataBasedOnStatus = useSelector((state) => state.wfm.rrstatusactions) || [];
    const l2Scheduled = useSelector((state) => state.wfm.l2Scheduled) || [];
    const allocationRequest = useSelector((state) => state.wfm.allocationRequest) || [];
    const sortedData = title === "Resources aligned to L2 Interviews " ? l2Scheduled : (title === "Resources aligned to Interview " ? rrDataBasedOnStatus : allocationRequest);
    const paramData = title === "Resources aligned to L2 Interviews " ? "L2Discussion" : (title === "Resources aligned to Interview " ? "Scheduled,L2Discussion" : "AllocationRequested");
    const stateDetails = title === "Resources aligned to L2 Interviews " ? (state) => state?.wfm?.l2Scheduled : (title === "Resources aligned to Interview " ? (state) => state?.wfm?.rrstatusactions : (state) => state?.wfm?.allocationRequest);
    const filtersResourceAllocation = useSelector((state) => state.wfm.filterResourceAllocation);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Apply sorting to the jobData array
    const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const itemsToShow = sortedData?.slice(startIndex, endIndex);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Initialize sorting state
    const sortColumn = useSelector(
        (state) => state?.wfm?.columnResourceAllocation
    );
    const sortOrder = useSelector(
        (state) => state?.wfm?.sortOrderResourceAllocation
    );
    const [loading, setLoading] = useState(false);
    const handleSort = (columnName) => {
        if (columnName === sortColumn) {
            // Toggle sorting order if the same column is clicked again
            dispatch(
                sortResourceAllocation(columnName, sortOrder === "asc" ? "desc" : "asc", title)
            );
        } else {
            // Set the new column to sort by and default to ascending order
            dispatch(sortResourceAllocation(columnName, "asc", title));
        }
    };
    useEffect(() => {
        setLoading(true);
        dispatch(ScheduledActiveRRsAction(paramData));
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [dispatch]);

    const handleFilter = (value, applyOn) => {
        dispatch(setResourceAllocationPageCount(1));
        dispatch(filterResourceAllocation(value, applyOn, title));
        setCurrentPage(1);
    };

    const handleDownload = async (e) => {
        let resp_arr = [];
        sortedData?.map((item) => {
            let resp_data = {
                "RR Number": item.rrNumber,
                "Project": item?.projectName,
                "Employee Name": item?.employeeName,
                "Skills": item?.skills,
                "Location": item?.location,
                "Experience (Years)": item?.experience,
                "Applied On": formatDateToddmmyyyy(item?.appliedon),
                "Scheduled On": formatDateToddmmyyyy(item?.scheduleDate)
            };
            resp_arr?.push(resp_data);
        });
        exportToCSV(resp_arr, title);
    };

    return (
        <>
            <span className="projectwise-header">
                <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                <h1 className="resource-allocation-heading">{title} ({sortedData?.length})</h1>
                <div className="download-button-wrapper resource-allocation-filter">
                    {!isEmpty(filtersResourceAllocation) && (
                        <ClearFilters
                            clearAction={clearResourceAllocationFilters}
                            fetchAction={ScheduledActiveRRsAction}
                            params={paramData}
                        />
                    )}
                    <button className="download-button-wrapper text-blue" onClick={(e) => handleDownload(e)}>
                        Download
                    </button>
                </div>
            </span>
            {loading && (
                <span className="loader table-loader">
                    <img src={loaderImage} alt="Loading" className="loader-img" />
                </span>
            )}
            {!loading && sortedData && sortedData?.length === 0 && <EmptyComponent />}
            {!loading && sortedData?.length > 0 && (
                <>
                    <ul>
                        <li className="list-header">
                            <div className="list-flex">
                                <span onClick={() => handleSort("rrNumber")}>
                                    RR Number
                                    {sortColumn === "rrNumber" && sortOrder === "asc" && (
                                        <span className="sort-arrow-up"></span>
                                    )}
                                    {sortColumn === "rrNumber" && sortOrder === "desc" && (
                                        <span className="sort-arrow-down"></span>
                                    )}
                                </span>
                                <FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"rrNumber"}
                                    applySelector={stateDetails}
                                />
                            </div>
                            <div className="list-flex">
                                <span onClick={() => handleSort("projectName")}>
                                    Project
                                    {sortColumn === "projectName" && sortOrder === "asc" && (
                                        <span className="sort-arrow-up"></span>
                                    )}
                                    {sortColumn === "projectName" && sortOrder === "desc" && (
                                        <span className="sort-arrow-down"></span>
                                    )}
                                </span>
                                <FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"projectName"}
                                    applySelector={stateDetails} />
                            </div>
                            <div className="list-flex">
                                <span onClick={() => handleSort("employeeName")}>
                                    Employee Name
                                    {sortColumn === "employeeName" && sortOrder === "asc" && (
                                        <span className="sort-arrow-up"></span>
                                    )}
                                    {sortColumn === "employeeName" && sortOrder === "desc" && (
                                        <span className="sort-arrow-down"></span>
                                    )}
                                </span>
                                <FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"employeeName"}
                                    applySelector={stateDetails} /></div>
                            <div className="list-flex"><span onClick={() => handleSort("skills")}>
                                Skills
                                {sortColumn === "skills" && sortOrder === "asc" && (
                                    <span className="sort-arrow-up"></span>
                                )}
                                {sortColumn === "skills" && sortOrder === "desc" && (
                                    <span className="sort-arrow-down"></span>
                                )}
                            </span>
                                <FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"skills"}
                                    applySelector={stateDetails} /></div>
                            <div className="list-flex"><span onClick={() => handleSort("location")}>
                                Location
                                {sortColumn === "location" && sortOrder === "asc" && (
                                    <span className="sort-arrow-up"></span>
                                )}
                                {sortColumn === "location" && sortOrder === "desc" && (
                                    <span className="sort-arrow-down"></span>
                                )}
                            </span>
                                <FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"location"}
                                    applySelector={stateDetails} /></div>
                            <div className="list-flex"><span onClick={() => handleSort("experience")}>
                                Experience (Years)
                                {sortColumn === "experience" && sortOrder === "asc" && (
                                    <span className="sort-arrow-up"></span>
                                )}
                                {sortColumn === "experience" && sortOrder === "desc" && (
                                    <span className="sort-arrow-down"></span>
                                )}
                            </span>
                                <FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"experience"}
                                    applySelector={stateDetails}
                                    slider
                                    sliderData={sortedData}
                                    sliderKey={"experience"}
                                /></div>
                            <div className="list-flex"><span onClick={() => handleSort("appliedon")}>
                                Applied On
                                {sortColumn === "appliedon" && sortOrder === "asc" && (
                                    <span className="sort-arrow-up"></span>
                                )}
                                {sortColumn === "appliedon" && sortOrder === "desc" && (
                                    <span className="sort-arrow-down"></span>
                                )}
                            </span></div>
                            <div className="list-flex"><span onClick={() => handleSort("scheduleDate")}>
                                Scheduled On
                                {sortColumn === "scheduleDate" && sortOrder === "asc" && (
                                    <span className="sort-arrow-up"></span>
                                )}
                                {sortColumn === "scheduleDate" && sortOrder === "desc" && (
                                    <span className="sort-arrow-down"></span>
                                )}
                            </span></div>
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
                                        <div className="tooltip" data-tooltip={item.employeeName}>{item.employeeName}</div>
                                        <div className="tooltip" data-tooltip={item.skills}>{item.skills}</div>
                                        <div>{item.location}</div>
                                        <div>{item.experience}</div>
                                        <div>{formatDateToddmmyyyy(item.appliedon)}</div>
                                        <div>{formatDateToddmmyyyy(item.scheduleDate)}</div>
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
            )}
        </>
    )
}
export default ResourceAllocation;