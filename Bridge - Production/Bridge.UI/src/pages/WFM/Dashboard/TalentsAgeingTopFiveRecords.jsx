import { Fragment, useEffect, useState } from "react";
import ArrowIcon from '../../../resources/DashboardArrow.svg';
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpadEmployees } from "../../../redux/actions/managerActions";
import { EMPLOYEE_IMG_URL_BASE } from "../../../config";
import avatar from "../../../resources/user-icon.svg";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";


const TalentsAgeingTopFiveRecords = () => {

    const dispatch = useDispatch();
    const lanchpadEmpListData = useSelector((state) => state.manager.lanchpadEmpList) || [];
    const [responseData, SetResponseData] = useState([]);
    const [top5Records, setTop5Records] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (lanchpadEmpListData.length === 0) {
            dispatch(fetchLaunchpadEmployees(-1));
        }
        const sortedData = lanchpadEmpListData.sort((a, b) => a.aging - b.aging).reverse()
        setTop5Records(sortedData?.slice(0, 5))
        SetResponseData(sortedData)
    }, [lanchpadEmpListData]);

    const handleClick = () => {
        navigate("/resourcesdisplay", { state: { from: location, data: responseData } });
    }
    return (
        <>
            <span className='topfive-block'>
                <h1>Talents Aging - Top 5</h1>
                <img className='img-arrow'
                    src={ArrowIcon}
                    alt="icon"
                    onClick={handleClick} />
            </span>
            <ul>
                <li className="list-header">
                    <div className="name">Name</div>
                    <div>Job Title</div>
                    <div>Experience</div>
                    <div>Aging</div>
                </li>
                {top5Records?.map((item, index) => {
                    const employeeImg = `${EMPLOYEE_IMG_URL_BASE}${item?.employeeId}.jpeg`;
                    return (
                        <Fragment key={index}>
                            <li className="list-data">
                                <div className="tooltip" data-tooltip={item.employeeName}>
                                    <Link
                                        className="list-data-emp-head"
                                        to={`/m-available-resources/${item.employeeId}`}
                                    >
                                        <span>
                                            {employeeImg && (
                                                <img
                                                    className="talents-profile-img"
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
                    )
                })}
            </ul>
        </>
    )

}
export default TalentsAgeingTopFiveRecords;