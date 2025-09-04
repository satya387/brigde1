import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { ScheduledActiveRRsAction, clearScheduledApplicationFilters } from '../../../redux/actions/wfmActions';
import Pagination from "../../../components/pagination";
import backIcon from "../../../resources/back-arrow.svg";
import MenuList from '../../../components/leftmenu';
import Header from '../../../components/header/header';
import { useDispatch, useSelector } from 'react-redux';
import notepadIcon from "../../../resources/notepadIcon.svg";
import Popup from "reactjs-popup";
import ViewManagerComments from "../../../components/ViewManagerComments";
import loaderImage from "../../../resources/Loader.svg";
import FilterInput from "../../../components/FilterInput";
import { filterScheduledApplication, setScheduledApplicationPageCount, sortScheduledApplication } from '../../../redux/actions/wfmActions';
import EmptyComponent from '../../../components/empty/emptyComponent';
import ClearFilters from '../../../components/ClearFilters';
import { formatDateToddmmyyyy, isEmpty } from '../../../common/commonMethods';

const ScheduledActiveRRs = () => {
    const rrDataBasedOnStatus = useSelector((state) => state.wfm.rrstatusactions) || [];
    const filtersrrDataBasedOnStatus = useSelector((state) => state.wfm.filterScheduledApplication);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [empData, setEmpData] = useState(null);
    const [rejectionCommentPopup, setRejectionCommentPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const active = useSelector((state) => state.wfm.active) || [];
  const withdrawn = useSelector((state) => state.wfm.withdrawn) || [];
  const declined = useSelector((state) => state.wfm.declined) || [];
  const data = location.state.status === "Active" ? active : location.state.status === "Withdrawn"? withdrawn: location.state.status === "Declined" ? declined: rrDataBasedOnStatus;
  const totalPages = Math.ceil(data.length / itemsPerPage);

    useEffect(() => {
        setLoading(true);
        dispatch(ScheduledActiveRRsAction(location.state.status));
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [dispatch]);

    useEffect(() => {
        dispatch(ScheduledActiveRRsAction(location.state.status));
    }, []);

    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [sortedJobData, setSortedJobData] = useState([]); 
    const itemsToShow = data.slice(startIndex, endIndex);

    useEffect(() => {
        if (rrDataBasedOnStatus && rrDataBasedOnStatus?.length > 0) {
            setSortedJobData(rrDataBasedOnStatus);
        }
    }, [rrDataBasedOnStatus]);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleOpenRejectionComments = (job) => {
        setEmpData(job);
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
        (state) => state?.wfm?.columnScheduledApplication
    );
    const sortOrder = useSelector(
        (state) => state?.wfm?.sortOrderScheduledApplication
    );

    const handleSort = (columnName) => {
        if (columnName === sortColumn) {
            // Toggle sorting order if the same column is clicked again
            dispatch(
                sortScheduledApplication(columnName, sortOrder === "asc" ? "desc" : "asc", location.state.status)
            );
        } else {
            // Set the new column to sort by and default to ascending order
            dispatch(sortScheduledApplication(columnName, "asc", location.state.status));
        }
    };

    const handleFilter = (value, applyOn) => {
        dispatch(setScheduledApplicationPageCount(1));
        dispatch(filterScheduledApplication(value, applyOn, location.state.status));
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
                                {location.state.status === "Scheduled,L2Discussion" ?
                                    <h1 className="dropped-heading">Scheduled Applications ({rrDataBasedOnStatus.length})</h1> :
                                    location.state.status === "Active" ? <h1 className="dropped-heading">Active Applications ({active.length})</h1> :
                                        location.state.status === "Declined" ? <h1 className="dropped-heading">Declined Applications ({declined.length})</h1> :
                                            location.state.status === "Withdrawn" ? <h1 className="dropped-heading">Withdrawn Applications ({withdrawn.length})</h1> : <h1 />}
                            </span>
                            <div className="filters">
                                {!isEmpty(filtersrrDataBasedOnStatus) && (
                                    <ClearFilters
                                        clearAction={clearScheduledApplicationFilters}
                                        fetchAction={ScheduledActiveRRsAction}
                                        params={location.state.status}
                                    />
                                )}
                            </div>
                        </div>
                        {loading && (
                            <span className="loader table-loader">
                                <img src={loaderImage} alt="Loading" className="loader-img" />
                            </span>
                        )}
                        {!loading && data && data?.length === 0 && <EmptyComponent />}
                        {!loading && data?.length > 0 && (
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
                                            </span>
                                            <FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"rrNumber"}
                                                applySelector={(state) =>
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                            />
                                        </div>
                                        <div className="list-flex"><span onClick={() => handleSort("projectName")}>
                                            Project Name
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
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                            />
                                        </div>
                                        <div className="list-flex"><span onClick={() => handleSort("rrAging")}>
                                            RR Aging
                                            {sortColumn === "rrAging" && sortOrder === "asc" && (
                                                <span className="sort-arrow-up"></span>
                                            )}
                                            {sortColumn === "rrAging" && sortOrder === "desc" && (
                                                <span className="sort-arrow-down"></span>
                                            )}
                                        </span>
                                            <FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"rrAging"}
                                                applySelector={(state) =>
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                                slider
                                                sliderData={sortedJobData}
                                                sliderKey={"rrAging"}
                                            />
                                        </div>
                                        <div className="list-flex"
                                            onClick={() => handleSort("employeeName")}
                                        >
                                            Employee Name
                                            {sortColumn === "employeeName" && sortOrder === "asc" && (
                                                <span className="sort-arrow-up"></span>
                                            )}
                                            {sortColumn === "employeeName" && sortOrder === "desc" && (
                                                <span className="sort-arrow-down"></span>
                                            )}
                                            <FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"employeeName"}
                                                applySelector={(state) =>
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                            />
                                        </div>
                                        <div className="list-flex"><span onClick={() => handleSort("skills")}>
                                            Skills
                                            {sortColumn === "skills" && sortOrder === "asc" && (
                                                <span className="sort-arrow-up"></span>
                                            )}
                                            {sortColumn === "skills" && sortOrder === "desc" && (
                                                <span className="sort-arrow-down"></span>
                                            )}
                                        </span>{" "}
                                            <FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"skills"}
                                                applySelector={(state) =>
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                            /></div>
                                        <div className="list-flex"><span onClick={() => handleSort("location")}>
                                            Location
                                            {sortColumn === "location" &&
                                                sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                            {sortColumn === "location" &&
                                                sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                        </span>{" "}
                                            <FilterInput
                                                handleFilter={handleFilter}
                                                applyOn={"location"}
                                                applySelector={(state) =>
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                            /></div>
                                        <div className="list-flex">
                                            <span onClick={() => handleSort("experience")}>
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
                                                applySelector={(state) =>
                                                    state?.wfm?.filterScheduledApplication
                                                }
                                                slider
                                                sliderData={sortedJobData}
                                                sliderKey={"experience"}
                                            />
                                        </div>
                                        <div onClick={() => handleSort("appliedon")}>
                                            Applied on
                                            {sortColumn === "appliedon" && sortOrder === "asc" && (
                                                <span className="sort-arrow-up"></span>
                                            )}
                                            {sortColumn === "appliedon" && sortOrder === "desc" && (
                                                <span className="sort-arrow-down"></span>
                                            )}
                                        </div>
                                        {location.state.status === "Scheduled,L2Discussion" ?
                                            <div onClick={() => handleSort("scheduleDate")}>
                                                Schedule Date
                                                {sortColumn === "scheduleDate" && sortOrder === "asc" && (
                                                    <span className="sort-arrow-up"></span>
                                                )}
                                                {sortColumn === "scheduleDate" && sortOrder === "desc" && (
                                                    <span className="sort-arrow-down"></span>
                                                )}
                                            </div> :
                                            location.state.status === "Active" ?
                                                <div className="list-flex"> <span onClick={() => handleSort("employeeAgeing")}>
                                                    Application Aging
                                                    {sortColumn === "employeeAgeing" && sortOrder === "asc" && (
                                                        <span className="sort-arrow-up"></span>
                                                    )}
                                                    {sortColumn === "employeeAgeing" && sortOrder === "desc" && (
                                                        <span className="sort-arrow-down"></span>
                                                    )}</span>
                                                </div> :
                                                location.state.status === "Declined" ? <div>Rejection Reason</div> : location.state.status === "Withdrawn" ? <div>Withdrawn Reason</div> : <div></div>}
                                    </li>
                                    {itemsToShow?.map((item, index) => {
                                       
                                        return (
                                            <Fragment key={index}>
                                                <li className="list-data">

                                                    <div className="tooltip" data-tooltip={item.rrNumber}><Link className="rr-link" to={`/managerrrs?id=${item.rrId}`}>
                                                        {item.rrNumber}
                                                    </Link></div>
                                                    <div className="tooltip" data-tooltip={item.projectName}>{item.projectName}</div>
                                                    <div>{item.rrAging} days</div>
                                                    <div className="tooltip" data-tooltip={item.employeeName}>
                                                        <Link
                                                            className="list-data-emp-head"
                                                            to={`/m-available-resources/${item.employeeId}`}
                                                        >{item.employeeName}</Link>
                                                    </div>
                                                    <div className="tooltip" data-tooltip={item.skills}>{item.skills}</div>
                                                    <div>{item.location}</div>
                                                    <div>{item.experience}</div>
                                                    <div>{formatDateToddmmyyyy(item.appliedon)}</div>
                                                    {location.state.status === "Scheduled,L2Discussion" ?
                                                        <div className="tooltip" data-tooltip={item.scheduleDate}>{item.scheduleDate}</div> :
                                                        location.state.status === "Active" ? <div>{item.employeeAgeing} days</div> :
                                                            location.state.status === "Declined" ? <div>
                                                                <span
                                                                    className="notepad-icon-container"
                                                                    onClick={() => handleOpenRejectionComments(item)}
                                                                >
                                                                    <img
                                                                        className="notepad-icon"
                                                                        src={notepadIcon}
                                                                        alt="View Comments"
                                                                    />
                                                                </span></div> : location.state.status === "Withdrawn" ? <div>
                                                                    <span
                                                                        className="notepad-icon-container"
                                                                        onClick={() => handleOpenRejectionComments(item)}
                                                                    >
                                                                        <img
                                                                            className="notepad-icon"
                                                                            src={notepadIcon}
                                                                            alt="View Comments"
                                                                        />
                                                                    </span></div> : <div></div>}
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

export default ScheduledActiveRRs;