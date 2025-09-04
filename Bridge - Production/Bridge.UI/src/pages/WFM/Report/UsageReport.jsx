import React, { Fragment } from "react";

const UsageReport = ({ data }) => {
  return (
    <>
      <ul className="list-table">
        {data.map((job, index) => {
          return (
            <li key={index} className="list-header">
              <div>Employee ID</div>
              <div>Employee Name</div>
              <div>Work Location</div>
              <div>Role (Mgr/Emp)</div>
              <div># Times Logged in</div>
              <div>Last Login</div>
              <div>Profile Updated?</div>
              <div>#RRs Owned</div>
              <div style={{ display: "inline-table", textAlign: "center" }}>
                Manager
                <div style={{ display: "flex", width: 640 }}>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Received
                  </div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Active
                  </div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Allocation Requested
                  </div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Withdrawn
                  </div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Declined
                  </div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Meeting Scheduled
                  </div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Application Dropped
                  </div>
                </div>
              </div>
              <div style={{ display: "inline-table", textAlign: "center" }}>
                Employee
                <div style={{ display: "flex", width: 640 }}>
                  <div style={{ padding: "10px 0px" }}>#RRs Applied</div>
                  <div style={{ padding: "10px 0px" }}>#RRs Active</div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Allocation Requested
                  </div>
                  <div style={{ padding: "10px 0px" }}>#RR Withdrawn</div>
                  <div style={{ padding: "10px 0px" }}>#RRs Declined</div>
                  <div style={{ padding: "10px 0px" }}>
                    #RRs Meeting Scheduled
                  </div>
                  <div style={{ padding: "10px 0px" }}>#RRs Dropped</div>
                </div>
              </div>
            </li>
          );
        })}
        {data.map((item, index) => {
          return (
            <Fragment key={index}>
              <li key={index} className="list-data">
                <div>{item["Employee ID"]}</div>
                <div>{item["Employee Name"]}</div>
                <div>{item["Work Location"]}</div>
                <div>{item["Role (Mgr/Emp)"]}</div>
                <div>{item["# Times Logged in"]}</div>
                <div>{item["Last Login"]}</div>
                <div>{item["Profile Updated?"]}</div>
                <div>{item["#RRs Owned"]}</div>
                <div style={{ display: "inline-table", textAlign: "center" }}>
                  <div style={{ display: "flex", width: 640 }}>
                    <div>{item["#RRs Application Received (Manager)"]}</div>
                    <div>{item["#RRs Application Active (Manager)"]}</div>
                    <div>
                      {item["#RRs Application Allocation Requested (Manager)"]}
                    </div>
                    <div>{item["#RRs Application Withdrawn (Manager)"]}</div>
                    <div>{item["#RRs Application Declined (Manager)"]}</div>
                    <div>
                      {item["#RRs Application Meeting Scheduled (Manager)"]}
                    </div>
                    <div>{item["#RRs Application Dropped (Manager)"]}</div>
                  </div>
                </div>
                <div style={{ display: "inline-table", textAlign: "center" }}>
                  <div style={{ display: "flex", width: 640 }}>
                    <div>{item["#RRs Applied (Employee)"]}</div>
                    <div>{item["#RRs Active (Employee)"]}</div>
                    <div>{item["#RRs Allocation Requested (Employee)"]}</div>
                    <div>{item["#RR Withdrawn (Employee)"]}</div>
                    <div>{item["#RRs Declined (Employee)"]}</div>
                    <div>{item["#RRs Meeting Scheduled (Employee)"]}</div>
                    <div>{item["#RRs Dropped (Employee)"]}</div>
                  </div>
                </div>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </>
  );
};

export default UsageReport;
