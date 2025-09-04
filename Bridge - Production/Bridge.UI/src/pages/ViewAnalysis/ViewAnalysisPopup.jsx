import React, {Fragment, useState, useEffect } from "react";
import Pagination from "../../components/pagination";
import ViewEmployee from "./ViewEmployee";
const ViewAnalysisPopup = ({
  onClose,
  PopupDatas,
  DataCountText ,
        DataCount
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =1;
  const totalPages =  
       Math.ceil(PopupDatas.length / itemsPerPage);
     

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsToShow =  
        PopupDatas.slice(startIndex, endIndex);
      
    // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="modal-overlay modal-interview-allocation-approval">
      <div className="modal-content modal-content-allocation-approval">
        <div className="modal-header modal-header-allocation-approval">
          <h2>View Analysis</h2>
  <p>{DataCountText} : Total Count: {DataCount}</p>  
        </div>
        <ul>
                {/* <li className="list-header talents-list-header">
                    <div className="name" style={{"width": "10px"}}>Technology</div>
                     
                    <div style={{"width": "10px"}}>Head Count</div>
                    <div style={{"width": "600px"}}>Employee Available in Respective Search</div>
                </li> */}
               
                {itemsToShow?.map((item, index) => {
                    
                    return (
                      <div> 
                        <Fragment key={index}>                            
                             
                                <div  style={{"width": "600px","font-size": "14px",  "font-weight": "600"}}  >No Of Employee Available :{item.skillsResponses[0].skillCount} <b>(Group By {DataCountText})</b></div>
                                <div style={{ height:"370px", overflow: "auto"}}>

                                 <ViewEmployee       
                                  PopupDatas2={item.skillsResponses[index].skillWiseListofEmployee}  
                                 />  
                                </div>  
                           

                        </Fragment></div>
                    )
                })}
                <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
            </ul>        
            <button className="cancel modal-button" onClick={onClose}>            Cancel            
          </button>         
      </div>    
    </div>
  );
};

export default ViewAnalysisPopup;
