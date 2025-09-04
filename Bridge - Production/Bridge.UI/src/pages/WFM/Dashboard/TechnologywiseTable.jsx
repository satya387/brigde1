import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OPPORTUNITY_STATUS_ENUM } from "../../../common/constants";
import Pagination from "../../../components/pagination";
import { exportToCSV, isEmpty } from "../../../common/commonMethods";
import backIcon from "../../../resources/back-arrow.svg";
import { EMPLOYEE_IMG_URL_BASE } from "../../../config";
import avatar from "../../../resources/user-icon.svg";
import FilterInput from "../../../components/FilterInput";
import { useDispatch, useSelector } from "react-redux";
import { clearTechnologywiseFilters, filterTechnologywise, getAllAvailableResources, setTechnologywisePageCount } from "../../../redux/actions/managerActions";
import ClearFilters from "../../../components/ClearFilters";


const TechnologywiseTable = (props) => {
    const data = props.data;
    const technologywiseData = useSelector((state) => state.manager.getAllAvailableResourcesData) || [];
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 10;
    // Apply sorting to the jobData array
    const totalPages = Math.ceil(technologywiseData.length / itemsPerPage);

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
     const dispatch = useDispatch();
    const filterTechnologywiseData = useSelector((state) => state.manager.filterTechnologywise);

    const itemsToShow =  Object.keys(filterTechnologywiseData).length ? technologywiseData.slice(startIndex, endIndex): data.slice(startIndex, endIndex);

   

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDownload = async (e) => {
        let resp_arr1 = [];
        data?.map((item) => {
            let resp_data1 = {
                Name: item?.employeeName,
                Role: item?.designation,
                Skills: item.primarySkills + " ," + item.secondarySkills,
                "Overall Experience": `${item?.experience || "N/A"} Years`,
                Location: item?.workingLocation,
                Availability: item?.availability,
                "On LaunchPad From": item?.onLaunchPadFrom,
                Aging: item?.aging + " Days"
            };
            resp_arr1?.push(resp_data1);
        });
        exportToCSV(resp_arr1, "Technologywise Talents");
    }

    const handleFilter = (value, applyOn) => {
        dispatch(setTechnologywisePageCount(1));
        dispatch(filterTechnologywise(value, applyOn));
    };
    return (
        <>
            <div className="right-panel">
                <span className="projectwise-header">
                    <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                    <h1 className="projectwise-heading">Technologywise Talents ({data.length})</h1>
                    <button className="projectwise-text-blue" onClick={(e) => handleDownload(e)}>
                        Download
                    </button>
                    <div className="filters">
                    {!isEmpty(filterTechnologywiseData) && (
                        <ClearFilters
                            clearAction={clearTechnologywiseFilters}
                            fetchAction={getAllAvailableResources}
                        />
                    )}
                    </div>
                </span>
                <ul>
                    <li className="list-header technologywise-list-header">
                        <div className="list-flex">Name
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"employeeName"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                            /></div>
                        <div className="list-flex">Role
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"designation"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                            />
                        </div>
                        <div className="list-flex">Skills
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"primarySkills"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                            />
                        </div>
                        <div className="list-flex">Overall Experience (Years)
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"experience"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                                slider
                                sliderData={technologywiseData}
                                sliderKey={"experience"}
                            />
                        </div>
                        <div className="list-flex">Location
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"workingLocation"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                            />
                        </div>
                        <div className="list-flex">Availability
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"availability"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                            />
                        </div>
                        <div className="list-flex">Aging
                            <FilterInput
                                handleFilter={handleFilter}
                                applyOn={"aging"}
                                applySelector={(state) =>
                                    state.manager.getAllAvailableResourcesData
                                }
                            />
                        </div>
                        <div>Available Allocation
                        </div>
                    </li>

                    {itemsToShow?.map((job, index) => {
                        const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${job?.employeeId}.jpeg`;
                        return (
                            <Fragment key={index}>
                                <li className=" list-data technologywise-list-data">
                                    <div className="empname">
                                        <Link
                                            className="list-data-emp-head"
                                            to={`/m-available-resources/${job?.employeeId}`}
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
                                            <span>
                                                <h2 className="emp-name">{job?.employeeName}</h2>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="tooltip" data-tooltip={job?.designation}>{job?.designation}</div>
                                    <div
                                        className="tooltip"
                                        data-tooltip={`${job?.primarySkills}${job?.secondarySkills ? `, ${job?.secondarySkills}` : ""
                                            }`}
                                    >
                                        {job?.primarySkills ? <span>{job?.primarySkills}</span> : ""}
                                        {job?.secondarySkills ? (
                                            <span>{`, ${job?.secondarySkills}`}</span>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div>{job?.experience}</div>
                                    <div>{job?.workingLocation}</div>
                                    <div className="availablity-status">
                                        <span className="availablity-text">{job?.availability}</span>
                                        {job?.availability === OPPORTUNITY_STATUS_ENUM.Earmarked && (
                                            <span className="availablity-sub-text">{job?.rrNumber}</span>
                                        )}
                                        {job?.availability !== OPPORTUNITY_STATUS_ENUM.Earmarked &&
                                            job?.availability !== OPPORTUNITY_STATUS_ENUM.Available && (
                                                <span className="availablity-sub-text">{job?.effectiveTill}</span>
                                            )}
                                    </div>
                                    <div>{job?.aging} Days</div>
                                    <div>
                                        {(job?.availableAllocationPercentage == null || job?.availableAllocationPercentage < 100)
                                            ? <span className="AllocationLessThanHundreds">{job?.availableAllocationPercentage ?? 0}%</span>
                                            : <span >{job?.availableAllocationPercentage}%</span>
                                        }
                                    </div>
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
            </div>
        </>
    )

}
export default TechnologywiseTable;