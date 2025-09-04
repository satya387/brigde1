import { Fragment, useEffect, useState } from 'react';
import { fetchTalentRejectionAnalysis } from '../../../redux/actions/rrActions';
import DownloadIcon from "../../../resources/Download.svg"
import { exportToCSV } from '../../../common/commonMethods';
import { useDispatch, useSelector } from 'react-redux';

const TalentRejectionAnalysis = () => {

    const [talentRejection, SetTalentRejection] = useState();
    const [totalTalentRejectionCount, SetTotalTalentRejectionCount] = useState(0);
    const dispatch = useDispatch();
    const talentRejectionAnalysis = useSelector((state) => state.rr.talentRejectionAnalysis) ||[];
    
    useEffect(() => {
        if(talentRejectionAnalysis.length === 0){
            dispatch(fetchTalentRejectionAnalysis())
        }
            const sortedData = talentRejectionAnalysis.sort((a, b) => a.commentsCount - b.commentsCount).reverse()
            SetTalentRejection(sortedData)
            const total = talentRejectionAnalysis.reduce((a, v) => a = a + v?.commentsCount, 0)
            SetTotalTalentRejectionCount(total)
    }, [talentRejectionAnalysis]);

    const handleDownload = async (e) => {
        let resp_arr = [];
        talentRejection?.map((item) => {
            let resp_data = {
                "Talent Rejection Analysis": item?.comments,
                "Rejection Count": item?.commentsCount
            };
            resp_arr?.push(resp_data);
        });
        exportToCSV(resp_arr, "Talent Rejection Analysis");
    };

    return (
        <div className='talentRejection'>
            <span className='talents-block'>
                <h1>Talent Rejection Analysis ({totalTalentRejectionCount})</h1>
                <img className='img-download talentRejectionCount'
                    src={DownloadIcon}
                    alt="icon"
                    onClick={(e) => handleDownload(e)}
                />
            </span>
            {talentRejection?.map((item, index) => {
                return (
                    <Fragment key={index} className='talents-data'>
                        <span className='talentRejectionData'>
                            {item.comments}
                        </span>
                        <span className='talentRejectionCount'>
                            {item.commentsCount}
                        </span>
                        <hr />
                    </Fragment>
                )
            })}
        </div>
    )
}

export default TalentRejectionAnalysis;