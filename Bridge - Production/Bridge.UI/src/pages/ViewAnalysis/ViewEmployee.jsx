import React, { Fragment, useState, useEffect } from "react";
import Pagination from "../../components/pagination";
const ViewEmployee = ({

    PopupDatas2
}) => {
 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const onClose = true;
    const totalPages =
        Math.ceil(PopupDatas2.length / itemsPerPage);


    // Calculate the start and end indices for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const itemsToShow =
        PopupDatas2.slice(startIndex, endIndex);

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (<div >

        <ul>
            <li className="list-header" >
                <div className="name" className="tooltip" data-tooltip="EmployeeName">EmployeeName</div>
                <div className="tooltip" data-tooltip="ManagerID">ManagerID</div>
                <div className="tooltip" data-tooltip="Location">Location</div>
                <div className="tooltip" data-tooltip="Primary Skills">Primary Skills</div>
                <div className="tooltip" data-tooltip="Secondary Skills">Secondary Skills</div>
                <div className="tooltip" data-tooltip="Role">Role</div>
                <div className="tooltip" data-tooltip="Experience">Experience</div>

            </li>

            {PopupDatas2?.map((item, index) => {

                return (
                    <div>
                        <Fragment key={index}>
                            <li className="list-data">
                                <div className="tooltip" data-tooltip={item.employeeName}>   {item.employeeName}    </div>
                                <div  className="tooltip" data-tooltip={item.managerID}>{item.managerID} </div>
                                <div  className="tooltip" data-tooltip={item.location}>{item.location} </div>
                                <div  className="tooltip" data-tooltip={item.primarySkills}>{item.primarySkills} </div>
                                <div  className="tooltip" data-tooltip={item.secondarySkills}>{item.secondarySkills} </div>
                                <div className="tooltip" data-tooltip={item.empRole} >{item.empRole} </div>
                                <div className="tooltip" data-tooltip={item.experience} >{item.experience} </div>


                            </li>

                        </Fragment></div>
                )
            })}

        </ul>
        
    </div>
    );
};

export default ViewEmployee;
