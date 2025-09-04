import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/header/header";
import LeftMenu from "../../components/leftmenu";
import { GetViewLaunchPadResourceAnalysis } from '../../redux/actions/analysisActions';
import ScheduleBasedonRR from "../../components/scheduleBasedonRR";
import backIcon from "../../resources/back-arrow.svg";
import '../dashboard/dashboard.scss';
import ViewAnalysisPopup from "./ViewAnalysisPopup";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
const ViewAnalysisMain = () => {
  const dispatch = useDispatch();
  const viewDataAnalysis = useSelector((state) => state?.analysis?.AllViewLaunchPadResourceAnalysis) || {};
 
  const [approvePopup, setApprovePopup] = useState(false);
  const [PopupData, setPopupData] = useState([]);
  const [DataCountText, setDataCountText] = useState("");
  const [DataCount, setDataCount] = useState(0);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (
      viewDataAnalysis != null
    ) {
      dispatch(GetViewLaunchPadResourceAnalysis());
     
    }
  }, []);

  const handlePrimaryClick = () => {

    setPopupData(viewDataAnalysis?.primarySkillsWiseResponsess);
    setDataCountText("Number of Resources matching Only Primary Skill");
    setDataCount(viewDataAnalysis.primarySkillCount);
    setApprovePopup(true);
  };
  const handleSecClick = () => {

    setPopupData(viewDataAnalysis?.secWiseResponsess)
    setDataCountText("Number of Resources matching Secondary skills");
    setDataCount(viewDataAnalysis.scendarySkillCount);
    setApprovePopup(true);
  };
  const handleRoleClick = () => {

    setPopupData(viewDataAnalysis?.roleWiseResponsess)
    setDataCountText("Number of Resources matching only the Role");
    setDataCount(viewDataAnalysis.roleCount);
    setApprovePopup(true);
  };
  const handleExperienceClick = () => {

    setPopupData(viewDataAnalysis?.experienceResponsess);
    setDataCountText("Number of Matching  Experience");
    setDataCount(viewDataAnalysis.experienceCount);
    setApprovePopup(true);
  };
  const handleLocationClick = () => {

    setPopupData(viewDataAnalysis?.locationResponsess);
    setDataCountText("Number of Resources matching Location");
    setDataCount(viewDataAnalysis.locationwiseCount);
    setApprovePopup(true);
  };
  const closeApprovalPopup = () => {
    setApprovePopup(false);

  };
  return <>
    <div className="dashcontainer">
      <Header />
      <div className="home-container">
        <div className="left-panel">
          <LeftMenu />
        </div>
        <div className="right-panel">
          <div className="schedule-wrap profile-schedule">
            <span className="back-arrow"><img src={backIcon} alt="" title="Go back" onClick={() => navigate(-1)} /></span>

          </div>
          <div className="Analysis-details">
            <div className="right-cont"><h2>View Analysis</h2>  </div>
            <table className="Analysis-details">
              <th></th> <th>Count</th>
              <tr>
                <td>Number of Resources matching Only Primary Skill</td>
                <td>   <button className="btn btn-update" onClick={handlePrimaryClick}>       {viewDataAnalysis.primarySkillCount}
                </button>
                </td>
              </tr>
              <tr>
                <td>     Number of Resources matching Secondary skills
    </td>
                <td>
                  <button className="btn btn-update" onClick={handleSecClick}>       {viewDataAnalysis.scendarySkillCount}
                  </button>
                </td>
              </tr>
              <tr>
                <td>       Number of Resources matching only the Role
    </td>
                <td>
                  <button className="btn btn-update" onClick={handleRoleClick}  >       {viewDataAnalysis.roleCount}
                  </button>
                </td>
              </tr>
              <tr>
                <td>      Number of Matching  Experience
    </td>
                <td>
                  <button className="btn btn-update" onClick={handleExperienceClick}    >       {viewDataAnalysis.experienceCount}
                  </button>
                </td>
              </tr>
              <tr>
                <td>        Number of Resources matching Location
    </td>
                <td>
                  <button className="btn btn-update" onClick={handleLocationClick}  >       {viewDataAnalysis.locationwiseCount}
                  </button>
                </td>
              </tr>


            </table>



          </div>
        </div>
      </div>
    </div>
    <Popup
      open={approvePopup}
      onClose={closeApprovalPopup}
      closeOnDocumentClick={false}
    >
      <ViewAnalysisPopup
        onClose={closeApprovalPopup}
        PopupDatas={PopupData}
        DataCountText={DataCountText}
        DataCount={DataCount}
      />
    </Popup>

  </>
}

export default ViewAnalysisMain;
