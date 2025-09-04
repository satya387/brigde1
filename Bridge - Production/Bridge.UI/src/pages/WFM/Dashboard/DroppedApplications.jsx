import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { clearDroppedApplicationFilters, filterDroppedApplications, getDroppedApplication, setDroppedApplicationPageCount, sortDroppedApplication } from '../../../redux/actions/rrActions';
import Pagination from "../../../components/pagination";
import backIcon from "../../../resources/back-arrow.svg";
import Header from '../../../components/header/header';
import MenuList from '../../../components/leftmenu';
import notepadIcon from "../../../resources/notepadIcon.svg";
import Popup from "reactjs-popup";
import ViewManagerComments from "../../../components/ViewManagerComments";
import { useDispatch, useSelector } from 'react-redux';
import { formatyyyymmddToddmmyyyy, isEmpty } from '../../../common/commonMethods';
import FilterInput from '../../../components/FilterInput';
import ClearFilters from '../../../components/ClearFilters';
import loaderImage from "../../../resources/Loader.svg";
import EmptyComponent from '../../../components/empty/emptyComponent';


const DroppedApplications = () => {
    const droppedApplications = useSelector((state) => state.rr.droppedApplications) || [];
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(droppedApplications?.length / itemsPerPage);
    const navigate = useNavigate();
    const [empData, setEmpData] = useState(null);
    const [rejectionCommentPopup, setRejectionCommentPopup] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const filtersDroppedApplication = useSelector(
        (state) => state.rr.filterDroppedApplications
    );

    useEffect(() => {
        setLoading(true);
        dispatch(getDroppedApplication());
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [dispatch]);

    useEffect(() => {
        if (droppedApplications.length === 0) {
            dispatch(getDroppedApplication())
        }
    }, []);

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const itemsToShow = droppedApplications.slice(startIndex, endIndex);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleOpenRejectionComments = (job) => {
        const myList = {
            "comments": job.droppedReason,
            "additionalComments": job.additionalComments
        };
        setEmpData(myList);
        setRejectionCommentPopup(true);
    };
    const closeRejectionCommentPopup = () => {
        setRejectionCommentPopup(false);
        setTimeout(() => {
            setEmpData(null);
        }, 100);
    };

    // Initialize sorting state
    const sortColumn = useSelector(
        (state) => state?.rr?.columnDroppedApplication
    );
    const sortOrder = useSelector(
        (state) => state?.rr?.sortOrderDroppedApplication
    );

    const handleSort = (columnName) => {
        if (columnName === sortColumn) {
            // Toggle sorting order if the same column is clicked again
            dispatch(
                sortDroppedApplication(columnName, sortOrder === "asc" ? "desc" : "asc")
            );
        } else {
            // Set the new column to sort by and default to ascending order
            dispatch(sortDroppedApplication(columnName, "asc"));
        }
    };

    const handleFilter = (value, applyOn) => {
        dispatch(setDroppedApplicationPageCount(1));
        dispatch(filterDroppedApplications(value, applyOn));
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
                        <div className="page-header">
                            <span className='projectwise-header'>
                                <span className="back-arrow projectwise-back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>
                                <h1 className="dropped-heading">Dropped Applications ({droppedApplications.length})</h1>
                            </span>
                            <div className="download-button-wrapper">
                                {!isEmpty(filtersDroppedApplication) && (
                                    <ClearFilters
                                        clearAction={clearDroppedApplicationFilters}
                                        fetchAction={getDroppedApplication}
                                    />
                                )}
                            </div>
                        </div>
                        {loading && (
                            <span className="loader table-loader">
                                <img src={loaderImage} alt="Loading" className="loader-img" />
                            </span>
                        )}
                        {!loading && droppedApplications && droppedApplications?.length === 0 && <EmptyComponent />}
                        {!loading && droppedApplications?.length > 0 && (
                            <>
                                <ul className='rrageing-list'>
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
                                            </span><FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"rrNumber"}
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("projectName")}>
                                                Project Name
                                                {sortColumn === "projectName" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "projectName" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </span><FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"projectName"}
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("rrAging")}>
                                                RR Ageing
                                                {sortColumn === "rrAging" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "rrAging" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </span><FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"rrAging"}
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                                slider
                                                sliderData={droppedApplications}
                                                sliderKey={"rrAging"}
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("employeeName")}>
                                                Employee Name
                                                {sortColumn === "employeeName" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "employeeName" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </span><FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"employeeName"}
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("rrSkills")}>
                                                Skills
                                                {sortColumn === "rrSkills" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "rrSkills" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </span><FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"rrSkills"}
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("location")}>
                                                Location
                                                {sortColumn === "location" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "location" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </span><FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"location"}
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("experience")}>
                                                Experience
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
                                                applySelector={(state) =>
                                                    state?.rr?.droppedApplications
                                                }
                                                slider
                                                sliderData={droppedApplications}
                                                sliderKey={"experience"}
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("appliedOn")}>
                                                Applied on
                                                {sortColumn === "appliedOn" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "appliedOn" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </span></div>
                                        <div>Dropped Reason</div>
                                    </li>
                                    {itemsToShow?.map((item, index) => {                                      
                                        return (
                                            <Fragment key={index}>
                                                <li className="list-data">
                                                    <div className="tooltip" data-tooltip={item.rrNumber}>
                                                        <Link className="rr-link" to={`/managerrrs?id=${item.rrId}`}>
                                                            {item.rrNumber}
                                                        </Link>
                                                    </div>
                                                    <div className="tooltip" data-tooltip={item.projectName}>{item.projectName}</div>
                                                    <div>{item.rrAging} days</div>
                                                    <div className="tooltip" data-tooltip={item.employeeName}>
                                                        <Link
                                                            className="list-data-emp-head"
                                                            to={`/m-available-resources/${item.employeeId}`}
                                                        >{item.employeeName}</Link>
                                                    </div>
                                                    <div>{item.rrSkills}</div>
                                                    <div>{item.location}</div>
                                                    <div>{item.experience}</div>
                                                    <div>{formatyyyymmddToddmmyyyy(item.appliedOn)}</div>
                                                    <div>
                                                        <span
                                                            className="notepad-icon-container"
                                                            onClick={() => handleOpenRejectionComments(item)}
                                                        >
                                                            <img
                                                                className="notepad-icon"
                                                                src={notepadIcon}
                                                                alt="View Comments"
                                                            />
                                                        </span></div>
                                                </li>

                                            </Fragment>
                                        )
                                    })}
                                </ul>           <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                />
                                <Popup
                                    open={rejectionCommentPopup}
                                    onClose={() => closeRejectionCommentPopup()}
                                    closeOnDocumentClick={true}
                                >
                                    <ViewManagerComments
                                        empData={empData}
                                        handleClose={() => closeRejectionCommentPopup()}
                                    />
                                </Popup>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
};

export default DroppedApplications;