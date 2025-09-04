import { Fragment, useEffect, useState } from 'react';
import "./index.scss";
import { fetchRRAgeing } from '../../../redux/actions/rrActions';
import ArrowIcon from '../../../resources/DashboardArrow.svg';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateToddmmyyyy } from '../../../common/commonMethods';

const RRAgeingTopFiveRecordsTable = () => {

    const [ageingResponseData, SetAgeingResponseData] = useState([]);
    const [top5Records, setTop5Records] = useState([]);
    const location = useLocation();
    const dispatch = useDispatch();
    const rrAgingData = useSelector((state) => state.rr.rrAging) || [];
    
    useEffect(() => {
        if(rrAgingData.length===0){
            dispatch(fetchRRAgeing())
        }
        const sortedData = rrAgingData.sort((a, b) => a.ageing - b.ageing).reverse()
            const descOrderData = sortedData.slice(0, 5);
            SetAgeingResponseData(rrAgingData)
            setTop5Records(descOrderData)
    }, [rrAgingData]);

    return (
        <>
            <span className='topfive-block'>
                <h1>RR Aging - Top 5 </h1>
                <Link to='/home'
                    state={{data: ageingResponseData, from: "rrageing"}}
                >
                    <img className='img-arrow'
                        src={ArrowIcon}
                        alt="icon"
                    />
                </Link>

            </span>

            <ul className='rrageing-list'>
                <li className="list-header">
                    <div className="empname-header">RR</div>
                    <div>Project</div>
                    <div>Job Title</div>
                    <div>Posted On</div>
                    <div>Aging</div>
                </li>
                {top5Records?.map((item, index) => {

                    return (
                        <Fragment key={index}>
                            <li key={index} className="list-data rr-list-data">
                                <div className="tooltip" data-tooltip={item.rrNumber}>
                                    <Link className="rr-link"
                                    to={`/managerrrs?id=${item.rrId}`}>
                                        {item.rrNumber}
                                    </Link>
                                </div>
                                <div className="tooltip" data-tooltip={item.projectName}>{item.projectName}</div>
                                <div className="tooltip" data-tooltip={item.roleRequested}>{item.roleRequested}</div>
                                <div className="tooltip" data-tooltip={formatDateToddmmyyyy(item.postedOn)}>{formatDateToddmmyyyy(item.postedOn)}</div>
                                <div className="tooltip" data-tooltip={item.ageing}>{item.ageing} days</div>
                            </li>
                        </Fragment>
                    );
                })}
            </ul>
        </>
    )
};

export default RRAgeingTopFiveRecordsTable;