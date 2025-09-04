import React, { Fragment } from "react";

const RRProgressReport = ({ data }) => {
  return (
    <>
      <ul className="list-table">
        {data.map((job, index) => {
          return (
            <li key={index} className="list-header">
              <div>RR Number</div>
              <div>Project Name</div>
              <div>Role Requested</div>
              <div>Primary Skills</div>
              <div>Work Location</div>
              <div>Experience</div>
              <div>Posted On</div>
              <div>#RRs Application Received</div>
              <div>#RRs Active</div>
              <div>#RRs Allocation Requested</div>
              <div>#RRs Withdrawn</div>
              <div>#RRs Declined</div>
              <div>#RRs Meeting Scheduled</div>
              <div># RR Meeting Reject</div>
              <div>Reasons for Reject</div>
            </li>
          );
        })}
        {data.map((item, index) => {
          return (
            <Fragment key={index}>
              <li key={index} className="list-data">
                <div>{item["RR Number"]}</div>
                <div className="tooltip" data-tooltip={item["Project Name"]}>
                  {item["Project Name"]}
                </div>
                <div className="tooltip" data-tooltip={item["Role Requested"]}>
                  {item["Role Requested"]}
                </div>
                <div className="tooltip" data-tooltip={item["Primary Skills"]}>
                  {item["Primary Skills"]}
                </div>
                <div>{item["Work Location"]}</div>
                <div>{item["Experience"]}</div>
                <div className="tooltip" data-tooltip={item["Posted On"]}>
                  {item["Posted On"]}
                </div>
                <div>{item["#RRs Application Received"]}</div>
                <div>{item["#RRs Active"]}</div>
                <div>{item["#RRs Allocation Requested"]}</div>
                <div>{item["#RRs Withdrawn"]}</div>
                <div>{item["#RRs Declined"]}</div>
                <div>{item["#RRs Meeting Scheduled"]}</div>
                <div>{item["#RR Meeting Reject"]}</div>
                <div>{item["Reasons for Reject"]}</div>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </>
  );
};

export default RRProgressReport;
