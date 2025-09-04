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


const ResourceAllocationTable = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const allStatusData = useSelector((state) => state.wfm.allStatus) || [];

    // Select distinct records based on the 'name' field
    const distinctRecords = [...new Set(allStatusData.map(item => item.status))];
    // Group existing records based on the distinct 'name' and count the records in each group
    const groupedData = distinctRecords.map(name => {
        const filteredItems = allStatusData.filter(item => item.status === name);
        return { status: name, count: filteredItems.length, items: filteredItems };
    });
    const sortedData = groupedData.sort((a, b) => a.count - b.count).reverse();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Apply sorting to the jobData array
    const totalPages = Math.ceil(allStatusData?.length / itemsPerPage);

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Assuming sortedData is defined and is an array of objects with 'items' property
    const allItems = sortedData.flatMap(obj => obj.items || []);
    const itemsToShow = allItems.slice(startIndex, endIndex);
    const filtersResourceAllocation = useSelector((state) => state.wfm.filterResourceAllocation);

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
                sortResourceAllocation(columnName, sortOrder === "asc" ? "desc" : "asc", null)
            );
        } else {
            // Set the new column to sort by and default to ascending order
            dispatch(sortResourceAllocation(columnName, "asc", null));
        }
    };
    useEffect(() => {
        setLoading(true);
        dispatch(ScheduledActiveRRsAction("Scheduled,L2Discussion,AllocationRequested,Active,Withdrawn,Declined,Dropped,Earmarked"));
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [dispatch]);

    const handleFilter = (value, applyOn) => {
        dispatch(setResourceAllocationPageCount(1));
        dispatch(filterResourceAllocation(value, applyOn));
        setCurrentPage(1);
    };

    const handleDownload = async (e) => {
        let resp_arr = [];
        allItems?.map((item) => {
            let resp_data = {
                "RR Number": item.rrNumber,
                "Project": item?.projectName,
                "Employee Name": item?.employeeName,
                "Skills": item?.skills,
                "Location": item?.location,
                "Experience (Years)": item?.experience,
                "Status": item?.status,
                "Applied On": formatDateToddmmyyyy(item?.appliedon),
            };
            resp_arr?.push(resp_data);
        });
        exportToCSV(resp_arr, "Resource Allocation");
    };

    return (
        <>
            <span className="projectwise-header">
                <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                <h1 className="resource-allocation-heading">Resource Allocation ({allItems?.length})</h1>
                <div className="download-button-wrapper resource-allocation-filter">
                    {!isEmpty(filtersResourceAllocation) && (
                        <ClearFilters
                            clearAction={clearResourceAllocationFilters}
                            fetchAction={ScheduledActiveRRsAction}
                            params="Scheduled,L2Discussion,AllocationRequested,Active,Withdrawn,Declined,Dropped,Earmarked"
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
                                    applySelector={(state) => state.wfm.allStatus}
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
                                    applySelector={(state) => state.wfm.allStatus} />
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
                                    applySelector={(state) => state.wfm.allStatus} /></div>
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
                                    applySelector={(state) => state.wfm.allStatus} /></div>
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
                                    applySelector={(state) => state.wfm.allStatus} /></div>
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
                                    applySelector={(state) => state.wfm.allStatus}
                                    slider
                                    sliderData={allItems}
                                    sliderKey={"experience"}
                                /></div>
                            <div className="list-flex">
                                Status<FilterInput
                                    handleFilter={handleFilter}
                                    applyOn={"status"}
                                    applySelector={(state) => state.wfm.allStatus} /></div>
                            <div className="list-flex"><span onClick={() => handleSort("appliedon")}>
                                Applied On
                                {sortColumn === "appliedon" && sortOrder === "asc" && (
                                    <span className="sort-arrow-up"></span>
                                )}
                                {sortColumn === "appliedon" && sortOrder === "desc" && (
                                    <span className="sort-arrow-down"></span>
                                )}
                            </span></div>
                        </li>
                        {itemsToShow.map((item, index) => {
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
                                        <div className="tooltip" data-tooltip={item.status}>{item.status}</div>
                                        <div>{formatDateToddmmyyyy(item.appliedon)}</div>
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
export default ResourceAllocationTable;