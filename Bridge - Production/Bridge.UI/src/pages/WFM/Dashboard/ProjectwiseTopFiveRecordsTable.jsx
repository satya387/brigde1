import { Fragment, useEffect, useState } from 'react';
import "./index.scss";
import ArrowIcon from '../../../resources/DashboardArrow.svg';
import { useLocation, useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectName } from "../../../redux/actions/jobActions";


const ProjectwiseTopFiveRecordsTable = () => {
    const projectData = useSelector((state) => state.job.projectNames);
    const dispatch = useDispatch();
    const [top5Records, setTop5Records] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (projectData?.length === 0) {
            dispatch(fetchProjectName());
        }
        const sortedData = projectData.sort((a, b) => a.projectRRCount - b.projectRRCount).reverse()
        setTop5Records(sortedData?.slice(0, 5))
    }, [projectData]);

    const handleClick = (event) => {
        event.preventDefault();
        navigate("/home", { state: { from: location } });
    }

    return (
        <>
            <span className='projectwise-topfive-block'>
                <h1>Project Wise RR Counts - Top 5</h1>
                <img className='img-arrow'
                    src={ArrowIcon}
                    alt="icon"
                    onClick={handleClick}
                />
            </span>
            <br />
            {top5Records?.map((item, index) => {
                const projectName = item.projectName;
                const firstTwoLetters = projectName.substring(0, 2);
                return (
                    <Fragment key={index} className='talents-data'>

                        <div className='element-block'>
                            <div className='circle'>
                                <span className="dashboard-proj-logo">{firstTwoLetters}</span>
                            </div>
                            <a className='db-rr-link'
                                href='/rr-ageing' onClick={handleClick}>
                                {item.projectName}
                            </a>
                            <span className='talentRejectionCount'>
                                {item.projectRRCount} RR
                            </span>
                        </div>
                        <hr />
                    </Fragment>
                )
            })}
        </>
    )
};

export default ProjectwiseTopFiveRecordsTable;