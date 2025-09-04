import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/header/header";
import MenuList from "../../../components/leftmenu";
import { clearUnconfirmedResourceFilters, filterUnconfirmedResource, getFutureAvailableResources, setUnconfirmedResourcePageCount } from "../../../redux/actions/managerActions";
import Pagination from "../../../components/pagination";
import backIcon from "../../../resources/back-arrow.svg";
import { Fragment, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { sortUnconfirmedResource } from "../../../redux/actions/managerActions";
import FilterInput from "../../../components/FilterInput";
import ClearFilters from "../../../components/ClearFilters";
import { exportToCSV, isEmpty } from "../../../common/commonMethods";
import EmptyComponent from "../../../components/empty/emptyComponent";
import loaderImage from "../../../resources/Loader.svg";
import PeopleEmpty from "../../../resources/PeopleGroup.svg";
import { UNCONFIRMED_NO_DATA_PLACEHOLDER } from "../ApproveTalent/ApproveTalentPopup/constant";


const UnconfirmedResource = () => {
    const futureResourcesData = useSelector((state) => state.manager.futureAvailableResourcesData) || [];
    const filtersUnconfirmedResource = useSelector(
        (state) => state.manager.filterUnconfirmedResource
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const path = location?.state?.from;
    const [confirmedData, setConfirmedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState(false);
    const [sortedJobData, setSortedJobData] = useState([]);
    const totalPages = path === "Confirmed" ? Math.ceil(confirmedData?.length / itemsPerPage): Math.ceil(sortedJobData?.length / itemsPerPage);
    
    useEffect(() => {
        dispatch(getFutureAvailableResources());
    }, []);

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = path === "Confirmed" ? confirmedData.slice(startIndex, endIndex) : sortedJobData.slice(startIndex, endIndex);
    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Initialize sorting state
    const sortColumn = useSelector(
        (state) => state?.manager?.columnUnconfirmedResource
    );
    const sortOrder = useSelector(
        (state) => state?.manager?.sortOrderUnconfirmedResource
    );

    const data = path === "Confirmed" ? confirmedData: sortedJobData;
    const handleSort = (columnName) => {
        if (columnName === sortColumn) {
            // Toggle sorting order if the same column is clicked again
            dispatch(
                sortUnconfirmedResource(columnName, sortOrder === "asc" ? "desc" : "asc", path)
            );
        } else {
            // Set the new column to sort by and default to ascending order
            dispatch(sortUnconfirmedResource(columnName, "asc", path));
        }
    };

    useEffect(() => {
        if (futureResourcesData && futureResourcesData?.length > 0) {
            const unconfirmedData = futureResourcesData.filter(item => item.releaseStatus !== "Confirmed");
            setSortedJobData(unconfirmedData);
            const confirmedData = futureResourcesData.filter(item => item.releaseStatus === "Confirmed");
            setConfirmedData(confirmedData);
        }
    }, [futureResourcesData]);

    const handleFilter = (value, applyOn) => {
        dispatch(setUnconfirmedResourcePageCount(1));
        dispatch(filterUnconfirmedResource(value, applyOn, path));
    };
    useEffect(() => {
        setLoading(true);
        dispatch(getFutureAvailableResources());
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [dispatch]);

    const handleDownload = async (e) => {
        let resp_arr = [];
        const fileName = path === "Confirmed" ? "Confirmed Resource Release" : "Unconfirmed Resource Release";
        data?.map((item) => {
            let resp_data = {
                "Employee Id": item.employeeId,
                "Resource Name": item?.employeeName,
                "Current Project": item?.projectName,
                "Reporting To": item?.reportingManagerName,
                "Allocated On": item?.onLaunchPadFrom,
                "Allocation Ending On": item?.availableOn,
                "Primary Skills": item?.primarySkills,
                "Secondary Skills": item?.secondarySkills,
                "Total Experience (Years)": item?.experience,
                "Emids Experience (Years)": item?.emidsExperience,
                "Location": item?.workingLocation,
            };
            resp_arr?.push(resp_data);
        });
        exportToCSV(resp_arr, fileName);
    };
    
    return (
        <>
            <div className="dashboard-container">
                <Header />
                <div className="home-container">
                    <div className="left-panel">
                        <MenuList />
                    </div>
                    <div className="right-panel">
                        {!loading && data?.length > 0 && (
                            <>
                                <div className="page-header">
                                    <span className='projectwise-header'>
                                        <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                                    {path === "Confirmed" ? <h1 className="unconfirmed-heading">Confirmed Resource Release ({futureResourcesData?.length === 0 ? 0 : confirmedData?.length})</h1> :
                                        <h1 className="unconfirmed-heading">Unconfirmed Resource Release ({futureResourcesData?.length === 0 ? 0 : sortedJobData?.length})</h1>
                        }
                                    </span>
                                    <div className="download-button-wrapper">
                                        {!isEmpty(filtersUnconfirmedResource) && (
                                            <ClearFilters
                                                clearAction={clearUnconfirmedResourceFilters}
                                                fetchAction={getFutureAvailableResources}
                                            />
                                        )}
                                        <button className="download-button-wrapper text-blue" onClick={(e) => handleDownload(e)}>
                                            Download
                                        </button>
                                    </div>
                                </div>
                                {loading && (
                                    <span className="loader table-loader">
                                        <img src={loaderImage} alt="Loading" className="loader-img" />
                                    </span>
                                )}
                                {!loading && futureResourcesData && futureResourcesData?.length === 0 && <EmptyComponent />}
                                {!loading && futureResourcesData?.length > 0 && (                                   
                                    <>
                                        <ul className='rrageing-list'>
                                            <li className="list-header">
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("employeeId")}>
                                                        Employee ID
                                                        {sortColumn === "employeeId" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "employeeId" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span>
                                                    <FilterInput
                                                        handleFilter={handleFilter}
                                                        applyOn={"employeeId"}
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("employeeName")}>
                                                        Resource Name
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
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("projectName")}>
                                                        Current Project
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
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("reportingManagerName")}>
                                                        Reporting To
                                                        {sortColumn === "reportingManagerName" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "reportingManagerName" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span><FilterInput
                                                        handleFilter={handleFilter}
                                                        applyOn={"reportingManagerName"}
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("onLaunchPadFrom")}>
                                                        Allocated On
                                                        {sortColumn === "onLaunchPadFrom" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "onLaunchPadFrom" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("availableOn")}>
                                                        Allocation Ending On
                                                        {sortColumn === "availableOn" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "availableOn" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("primarySkills")}>
                                                        Primary Skills
                                                        {sortColumn === "primarySkills" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "primarySkills" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span><FilterInput
                                                        handleFilter={handleFilter}
                                                        applyOn={"primarySkills"}
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("secondarySkills")}>
                                                        Secondary Skills
                                                        {sortColumn === "secondarySkills" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "secondarySkills" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span><FilterInput
                                                        handleFilter={handleFilter}
                                                        applyOn={"secondarySkills"}
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("experience")}>
                                                        Total Experience (Years)
                                                        {sortColumn === "experience" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "experience" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span><FilterInput
                                                        handleFilter={handleFilter}
                                                        applyOn={"experience"}
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                        slider
                                                        sliderData={data}
                                                        sliderKey={"experience"}
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("emidsExperience")}>
                                                        Emids Experience (Years)
                                                        {sortColumn === "emidsExperience" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "emidsExperience" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span><FilterInput
                                                        handleFilter={handleFilter}
                                                        applyOn={"emidsExperience"}
                                                        applySelector={(state) =>
                                                            state?.manager?.futureAvailableResourcesData
                                                        }
                                                        slider
                                                        sliderData={data}
                                                        sliderKey={"emidsExperience"}
                                                    /></div>
                                                <div className="list-flex">
                                                    <span onClick={() => handleSort("workingLocation")}>
                                                        Location
                                                        {sortColumn === "workingLocation" && sortOrder === "asc" && (
                                                            <span className="sort-arrow-up"></span>
                                                        )}
                                                        {sortColumn === "workingLocation" && sortOrder === "desc" && (
                                                            <span className="sort-arrow-down"></span>
                                                        )}
                                                    </span></div>
                                            </li>
                                            {itemsToShow?.map((item, index) => {

                                                return (
                                                    <Fragment key={index}>
                                                        <li className="list-data">

                                                            <div>{item.employeeId}</div>
                                                            <div className="tooltip" data-tooltip={item.employeeName}>
                                                                <Link
                                                                    className="list-data-emp-head"
                                                                    to={`/m-available-resources/${item.employeeId}`}
                                                                >{item.employeeName}</Link>
                                                            </div>
                                                            <div className="tooltip" data-tooltip={item.projectName}>{item.projectName}</div>
                                                            <div className="tooltip" data-tooltip={item.reportingManagerName}>{item.reportingManagerName}</div>
                                                            <div>{item.onLaunchPadFrom}</div>
                                                            <div>{item.availableOn}</div>
                                                            <div className="tooltip" data-tooltip={item.primarySkills}>{item.primarySkills}</div>
                                                            <div>{item.secondarySkills}</div>
                                                            <div>{item.experience}</div>
                                                            <div>{item.emidsExperience}</div>
                                                            <div>{item.workingLocation}</div>
                                                        </li>

                                                    </Fragment>
                                                )
                                            })}
                                        </ul>           <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            handlePageChange={handlePageChange}
                                        />
                                    </>
                                )}

                            </>
                        )}
                        {loading && data?.length === 0 && (
                            <span className="loader table-loader">
                                <img src={loaderImage} alt="Loading" className="loader-img" />
                            </span>
                        )}
                        {!loading && data?.length === 0 && (
                            <EmptyComponent imgSrc={PeopleEmpty} message={UNCONFIRMED_NO_DATA_PLACEHOLDER} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default UnconfirmedResource;