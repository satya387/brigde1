import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowIcon from '../../../resources/DashboardArrow.svg';
import { getAllAvailableResources } from "../../../redux/actions/managerActions";
import { useNavigate } from 'react-router-dom';


const TechnologywiseTopFiveRecords = () => {
    const technologywiseData = useSelector((state) => state.manager.getAllAvailableResourcesData) || [];
    const [responseData, SetResponseData] = useState([]);
    const [top5Records, setTop5Records] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (technologywiseData.length === 0) {
            dispatch(getAllAvailableResources());
        }
        // Select distinct records based on the 'name' field
        const distinctRecords = [...new Set(technologywiseData.map(item => item.primarySkills))];

        // Group existing records based on the distinct 'name' and count the records in each group
        const groupedData = distinctRecords.map(name => {
            const filteredItems = technologywiseData.filter(item => item.primarySkills === name);
            return { skills: name, count: filteredItems.length, items: filteredItems };
        });
        const sortedData = groupedData.sort((a, b) => a.count - b.count).reverse()
        setTop5Records(sortedData?.slice(0, 5))
        SetResponseData(sortedData)
    }, [technologywiseData]);

    const handleClick = (event) => {
        event.preventDefault();
        navigate("/resourcesdisplay", { state: { from: "technologywise", data: responseData } });
    }

    return (
        <>
            <span className='technologywise-topfive-block'>
                <h1>Technology Wise Talent Counts - Top 5</h1>
                <img className='img-arrow'
                    src={ArrowIcon}
                    alt="icon" onClick={handleClick} />
            </span>
            <br />
            {top5Records?.map((item, index) => {
                return (
                    <Fragment key={index} className='talents-data'>

                        <div className='technology-element-block'>
                            <a className='db-rr-link'
                                href='resourcesdisplay' onClick={handleClick}>
                                {item.skills}
                            </a>
                            <span className='talentRejectionCount'>
                                {item.count}
                            </span>
                        </div>
                        <hr />
                    </Fragment>
                )
            })}
        </>
    )

}
export default TechnologywiseTopFiveRecords;