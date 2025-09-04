import { Chart } from 'react-google-charts';
import { useEffect, useState } from 'react';
import "./index.scss";
import MenuList from '../../../components/leftmenu';
import Header from '../../../components/header/header';
import { fetchRRProgressReports } from '../../../redux/actions/rrActions';
import totalResourceRequestIcon from '../../../resources/totalResourceRequest.svg';
import TalentsAvailable from '../../../resources/TalentsAvailable.svg';
import ResourceReleaseCount from '../../../resources/ResoucesReleasecount.svg';
import RRAgeingTopFiveRecordsTable from './RRAgeingTopFiveRecordsTable';
import TalentRejectionAnalysis from './TalentRejectionAnalysis';
import TalentsAgeingTopFiveRecords from './TalentsAgeingTopFiveRecords';
import ProjectwiseTopFiveRecordsTable from './ProjectwiseTopFiveRecordsTable';
import TechnologywiseTopFiveRecords from './TechnologywiseTopFiveRecords';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ScheduledActiveRRsAction } from '../../../redux/actions/wfmActions';
import { getFutureAvailableResources } from "../../../redux/actions/managerActions";
import ArrowIcon from '../../../resources/DashboardArrow.svg';
import { fetchJobById } from '../../../redux/actions/jobActions';


const MainDashboard = () => {

  const [data, setData] = useState({});
  const [totalResourceRequest, setTotalResourceRequest] = useState();
  const [totalDeclinedRequest, setTotalDeclinedRequest] = useState();
  const [totalAllocationRequested, setTotalAllocationRequested] = useState();
  const [totalDropped, setTotalDropped] = useState();
  const [unconfirmedCount, setUnconfirmedCount] = useState();
  const [confirmedCount, setConfirmedCount] = useState();
  const [scheduledCount, setScheduledCount] = useState(0);
  const [L2ScheduledCount, setL2ScheduledCount] = useState(0);
  const [allocationRequestedCount, setAllocationRequestedCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const futureResourcesData = useSelector((state) => state.manager.futureAvailableResourcesData) || [];
  const pieChartData = [
    ["Scenario", "Value"], [`Active Applications(${data.Active})`, data.Active], [`Dropped Applications(${data.dropped})`, data.dropped], [`Withdrawn Applications(${data.withdrawn})`, data.withdrawn], [`Scheduled Applications(${data.scheduled})`, data.scheduled]
  ];
  const options = {
    width: 520,
    title: `Total Applications(${totalResourceRequest})`,
    titlePosition: 'end',
    slices: [{ color: 'Green' }, { color: 'Red' }, { color: 'blue' }, { color: 'Grey' }],
    legend: {
      position: "right",
      textStyle: { bold: false }
    }
  };

  const handleChartClick = (event) => {
    // Extract the clicked data point from the event
    const clickedData = event.chartWrapper.getChart().getSelection()[0];
    // Get the label of the clicked data point
    const label = event.chartWrapper.getDataTable().getValue(clickedData.row, 0);
    navigate('/resourcesdisplay', { state: { label: label} });
  };
  
  const donutData = [
    ['Resources', 'Count'],
    [`Allocated Resources (${allocationRequestedCount})`, allocationRequestedCount],
    [`Resources aligned to L2 Interviews (${L2ScheduledCount})`, L2ScheduledCount],
    [`Resources aligned to Interview (${scheduledCount})`, scheduledCount]
  ];
  const donutOptions = {
    pieSliceText: 'label',
    slices: {
      0: { color: '#7851A9' },
      1: { color: '#FFD800' },
      2: { color: '#74C69D' }
    },
    pieStartAngle: 100,
    pieSliceTextStyle: {
      color: 'black',
    },
    legend: {
      position: "right",
      textStyle: { bold: false }
    }
  };

  const rrDataBasedOnStatus = useSelector((state) => state.wfm.rrstatusactions) || [];
  const l2Scheduled = useSelector((state) => state.wfm.l2Scheduled) || [];
  const allocationRequest = useSelector((state) => state.wfm.allocationRequest) || [];
  const rrProgressReports = useSelector((state) => state.rr.rrProgressReports) || [];
  const active = useSelector((state) => state.wfm.active) || [];
  const withdrawn = useSelector((state) => state.wfm.withdrawn) || [];
  const declined = useSelector((state) => state.wfm.declined) || [];
  const allJobs = useSelector((state) => state.job.jobById) || [];
  useEffect(() => {
    if(rrProgressReports.length === 0){
      dispatch(fetchRRProgressReports({
        fromDate: "2021-01-01T00:00:00.000",
        toDate: new Date().toISOString()
      }
      ))
    }
      const active = rrProgressReports?.reduce((a, v) => a = a + v?.rRsApplication.active, 0);
      const dropped = rrProgressReports?.reduce((a, v) => a = a + v?.rRsApplication.dropped, 0);
      const withdrawn = rrProgressReports?.reduce((a, v) => a = a + v?.rRsApplication.withdrawn, 0);
      const scheduled = rrProgressReports?.reduce((a, v) => a = a + v?.rRsApplication.scheduled, 0);
      const myList = {
        "Active": active,
        "dropped": dropped,
        "withdrawn": withdrawn,
        "scheduled": scheduled
      };
      setData(myList)
      const total = rrProgressReports.reduce((a, v) => a = a + v?.rRsApplication.total, 0)
      setTotalResourceRequest(total)
      const declined = rrProgressReports.reduce((a, v) => a = a + v?.rRsApplication.declined, 0)
      setTotalDeclinedRequest(declined)
      const allocationRequested = rrProgressReports?.reduce((a, v) => a = a + v?.rRsApplication.allocationRequested, 0);
      setTotalAllocationRequested(allocationRequested)
      setTotalDropped(dropped)
  }, [rrProgressReports]);

  useEffect(() => {
    if (rrDataBasedOnStatus?.length === 0) {
      dispatch(ScheduledActiveRRsAction("Scheduled,L2Discussion"));
    }
    setScheduledCount(rrDataBasedOnStatus?.length)
  }, [rrDataBasedOnStatus]);

  useEffect(() => {
    if (l2Scheduled?.length === 0) {
      dispatch(ScheduledActiveRRsAction("L2Discussion"));
    }
    setL2ScheduledCount(l2Scheduled?.length)
  }, [l2Scheduled]);

  useEffect(() => {
    if (allocationRequest?.length === 0) {
      dispatch(ScheduledActiveRRsAction("AllocationRequested"));
    }
    setAllocationRequestedCount(allocationRequest?.length)
  }, []);

  useEffect(() => {
    dispatch(getFutureAvailableResources());
  }, [dispatch]);

  useEffect(() => {
    const unconfirmedData = futureResourcesData.filter(item => item.releaseStatus !== "Confirmed");
      setUnconfirmedCount(unconfirmedData?.length)
      const confirmedData = futureResourcesData.filter(item => item.releaseStatus === "Confirmed"); 
      setConfirmedCount(confirmedData?.length) 
  },[futureResourcesData]);

  useEffect(() => {
    if(active.length === 0 || withdrawn.length === 0|| declined.length === 0){
      dispatch(ScheduledActiveRRsAction("Active"));
      dispatch(ScheduledActiveRRsAction("Withdrawn"));
      dispatch(ScheduledActiveRRsAction("Declined"));
    }   
}, []);

  const totalTalentsAvailable = (!isNaN(scheduledCount) && !isNaN(totalDropped) && !isNaN(totalAllocationRequested)) ? (scheduledCount + totalDropped + totalAllocationRequested) : 0;

  const handleClickUnconfirmed = (event) => {
    event.preventDefault();
    navigate("/unconfirmed-resources", { state: { from: "Unconfirmed" } });
}

const handleClickConfirmed = (event) => {
  event.preventDefault();
  navigate("/unconfirmed-resources", { state: { from: "Confirmed" } });
}
const employeeId = useSelector((state) => state.user.employeeId);
useEffect(() => {
  dispatch(fetchJobById(employeeId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch, employeeId]);
  return (
    <>
      <div className="dashboard-container">
        <Header />
        <div className="home-container">
          <div className="left-panel">
            <MenuList />
          </div>
          <div className="right-panel">
            <>
              <div className="page-header">
                <div className="filters">
                  <h1>Dashboard</h1>
                </div>
              </div>
              <div>
                <div className="firstdivLeftPane">
                  <span>
                    <img className='img-total-resource'
                      src={totalResourceRequestIcon}
                      alt="icon" />
                  </span>
                  <Link className='rr-link' to='/home'
                  ><h1 className='count'>{allJobs?.length}</h1></Link>
                  <p className='dashboard-p'>Total Resource Requests</p>
                  <hr />
                  <>
                    <span className='active-block'>
                      <Link className='rr-link' to='/scheduledRRs'
                        state={{ status: "Active" }}
                      ><h2>{active.length}</h2> </Link>Active <br />Requests</span>
                    <span className='withdrawn-block'>
                      <Link className='rr-link' to='/scheduledRRs'
                        state={{ status: "Withdrawn" }}
                      ><h2>{withdrawn.length}</h2></Link> Withdrawn <br /> Requests</span>
                    <span className='declined-block'>
                      <Link className='rr-link' to='/scheduledRRs'
                        state={{ status: "Declined" }}
                      ><h2>{declined.length}</h2></Link> Declined <br /> Requests</span>
                  </>
                </div>
                <div className="firstdivMidPane">
                  <span>
                    <img className='img-total-resource'
                      src={TalentsAvailable}
                      alt="icon" />
                  </span>
                  <Link className='rr-link' to='/resourcesdisplay'>
                    <h1 className='count'>{totalTalentsAvailable}</h1></Link>
                  <p className='dashboard-p'>Talents Available</p>
                  <hr />
                  <>
                    <span className='active-block'>
                      <Link className='rr-link' to='/scheduledRRs'
                        state={{ status: "Scheduled,L2Discussion" }}
                      ><h2>{scheduledCount}</h2></Link>
                      Scheduled <br />Meetings</span>
                    <span className='withdrawn-block dropped-block'><Link className='rr-link' to='/droppedApplications'><h2>{data.dropped}</h2></Link> Dropped <br /> Applications</span>
                    <span className='declined-block'><Link className='rr-link' to='/approve-talent'><h2>{totalAllocationRequested}</h2></Link> Allocation <br /> Requested</span>
                  </>
                </div>
                <div className="firstdivRightPane">
                  <span>
                    <img className='img-total-resource'
                      src={ResourceReleaseCount}
                      alt="icon" />
                  </span>
                  <Link className='rr-link' to='/resourcesdisplay'>
                     <h1 className='count'>{futureResourcesData?.length}</h1></Link>
                  <p className='dashboard-p'>Resources Release Count</p>
                  <hr />
                  <>
                  
                    <span className='withdrawn-block dropped-block'><Link className='rr-link'><h2 onClick={handleClickUnconfirmed}>{unconfirmedCount}</h2></Link> Unconfirmed <br /> Releases</span>                    
                    <span className='withdrawn-block confirmed-block'><Link className='rr-link'><h2 onClick={handleClickConfirmed}>{confirmedCount}</h2></Link> Confirmed <br /> Releases</span>                                     
                  </>
                </div>
              </div>
              <div>
                <div className="list-table-rrageing-list">

                  <RRAgeingTopFiveRecordsTable />
                </div>
                <div className="list-table-rrageing-list">
                  <TalentsAgeingTopFiveRecords />
                </div>
              </div>
            </>
          </div>

        </div>
        <div className='graphblock'>
          <div className='rrApplicationStatus'>
            <h1>RR Application Status</h1>
            <Chart
              chartType="PieChart"
              data={pieChartData}
              options={options}
              width={"100%"} height={"300px"}
            />
          </div>
          <div className='resourceAllocationCount'>
          <span className='resource-allocation-arrow'>
            <h1>Resource Allocation Count</h1>
            <Link to='/resourcesdisplay'
              state={{ from: "ResourceAllocationDetails" }}
            >
              <img className='img-arrow'
                src={ArrowIcon}
                alt="icon"
              />
            </Link>
            </span>
            <Chart
              width={'500px'}
              height={'300px'}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={donutData}
              options={{
                ...donutOptions,
                pieSliceText: 'none',
                pieStartAngle: 100,
                pieHole: 0.6,
              }}
              chartEvents={[
                {
                  eventName: 'select',
                  callback: handleChartClick,
                },
              ]}
            />
          </div>
        </div>
        <div className='countblock'>
          <div className='projectwiseRRCount'>
            <ProjectwiseTopFiveRecordsTable />
          </div>
          <div className='technologywiseCount'>
            <TechnologywiseTopFiveRecords />
          </div>
        </div>
        <TalentRejectionAnalysis />
      </div>
    </>
  )
}
export default MainDashboard;