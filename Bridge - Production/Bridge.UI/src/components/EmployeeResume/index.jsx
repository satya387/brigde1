import React from "react";
import EmidsLogo from '../../resources/EmidsLogo.svg';
import './EmployeeResume.scss';

const EmployeeResume =({employeeData})=> {

    const renderHeader=()=>{
        return (
            <div className="resume-header">
                <img src={EmidsLogo} alt="Emids" className="header-logo"/>
            </div>
        );
    }

    const renderProfileHeader=()=>{
        return (
            <div className="resume-profile-header">
                <div className="employee-name">{employeeData?.employeeName}</div>
                <div className="employee-info-wrapper">
                    <div className="employee-email sub-heading-text">{employeeData?.emailId}</div>
                    <div className="employee-location sub-heading-text">{employeeData?.location}</div>
                </div>
            </div>
        );
    };

    const renderProfileSummary=()=>{
        return (
            <div className="professional-summary-wrapper">
                <div className="sub-heading-text">{'PROFESSIONAL: '}</div>
                <div className="professional-summary body-text">{employeeData?.about || 'Not Available'}</div>
            </div>
        );
    };

    const renderSkills=()=>{
        const expertSkills = employeeData?.skillMatrix?.expertSkills?.split(",")?.filter((expertSkills) => expertSkills.trim() !== "");
        const advancedSkills = employeeData?.skillMatrix?.advancedSkills?.split(",")?.filter((advancedSkills) => advancedSkills.trim() !== "");
        const intermediateSkills = employeeData?.skillMatrix?.intermediateSkills?.split(",")?.filter((intermediateSkills) => intermediateSkills.trim() !== "");
        const beginnerSkills = employeeData?.skillMatrix?.beginnerSkills?.split(",")?.filter((beginnerSkills) => beginnerSkills.trim() !== "");
        const additionalSkills = expertSkills?.concat(advancedSkills, intermediateSkills, beginnerSkills);
        return (
            <div className="skills-container">
                <div className="sub-heading-text">{'SKILL & TECHNOLOGY SUMMARY: '}</div>
                <div className="skills-table-wrapper">
                    <table className="skills-table">
                        <thead>
                            <tr>
                                <th className="table-col-text" rowSpan="4">Primary Skill</th>
                                <th className="table-col-text" rowSpan="4">Secondary Skill</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="body-text">{employeeData?.skillMatrix?.primarySkills || 'N/A'}</td>
                                <td className="body-text">{employeeData?.skillMatrix?.secondarySkills || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="skills-table add-skill-table">
                        <thead>
                            <tr>
                                <th className="table-col-text" rowSpan="4">Additional Skill</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="body-text">{additionalSkills?.join(', ') || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const renderCertifications=()=>{
        const listOfCertification = employeeData?.skillMatrix?.certifications?.split(",")?.filter((certificate) => certificate.trim() !== "");
        return (
            <>
               {listOfCertification?.length > 0 && <div className="certification-wrapper">
                    <div className="sub-heading-text">{'CERTIFICATIONS: '}</div>
                    <div className="certification-listing">
                        {listOfCertification?.map((certificate) => (
                            <li className="certification-item body-text" key={certificate.trim()}>{certificate.trim()}</li>
                        ))}
                    </div>
                </div>}
            </>
        );
    };

    const renderEmployersDetails=()=>{
        return (
            <div className="employer-details">
                <div className="sub-heading-text">{'EMPLOYMENT SUMMARY: '}</div>
                <div className="employer-table-wrapper">
                    <table className="employer-table">
                        <thead>
                            <tr>
                                <th className="table-col-text" rowSpan="4">Employer</th>
                                <th className="table-col-text" rowSpan="4">Designation</th>
                                <th className="table-col-text" rowSpan="4">From</th>
                                <th className="table-col-text" rowSpan="4">To</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="body-text">{'EMIDS'}</td>
                                <td className="body-text">{employeeData?.designation || 'N/A'}</td>
                                <td className="body-text">{'-'}</td>
                                <td className="body-text">{'Present'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const renderProject=(projectData, currentOrg)=>{
        const responsibilities = projectData?.projectKeyResponsibilities || projectData?.keyResponsibilities;
        let startDate = new Date(projectData?.assignDate || projectData?.startDate);
        let releaseDate = new Date(projectData?.releaseDate || projectData?.endDate);
        startDate = startDate?.toLocaleDateString('rm-CH', {
            month: 'short',
            year: 'numeric'
        });
        releaseDate = releaseDate?.toLocaleDateString('rm-CH', {
            month: 'short',
            year: 'numeric'
        });

        return (
            <div className="project-detail-wrapper" id={'project-detail-wrapper'}>
                <table className="table-project">
                    <tbody>
                        {currentOrg && <tr className="table-project-row">
                            <th className="table-key added-padding">Employer: </th>
                            <th className="body-text added-padding">{currentOrg ? 'Emids': 'N/A'}</th>
                        </tr>}
                        <tr className="table-project-row">
                            <td className="table-key added-padding">Project Name: </td>
                            <td className="body-text added-padding">{projectData?.projectName}</td>
                        </tr>
                        <tr className="table-project-row">
                            <td className="table-key added-padding">Location: </td>
                            <td className="body-text added-padding">{'N/A'}</td>
                        </tr>
                        <tr className="table-project-row">
                            <td className="table-key added-padding">Technology: </td>
                            <td className="body-text added-padding">{projectData?.projectSkills || projectData?.technologies || 'N/A'}</td>
                        </tr>
                        <tr className="table-project-row">
                            <td className="table-key added-padding">Period: </td>
                            <td className="body-text added-padding">{`${startDate} - ${releaseDate}`}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="responsibilities-wrapper">
                    <div className="sub-heading-text">{'Responsibilities: '}</div>
                    <ul className="bullet-list-responsibilities">
                        {responsibilities?.split('\n')?.map((line, index) => {
                        const trimmedLine = line.trim();
                        if (trimmedLine === '-' || trimmedLine === '•' || trimmedLine === '*') {
                            return <li key={index} className="body-text responsibility-details">{trimmedLine}</li>;
                        } else if (trimmedLine === '') {
                            return null;
                        } else {
                            return (
                            <li key={index} className="body-text responsibility-details">
                                {trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') ? trimmedLine.substring(2) : trimmedLine}
                            </li>
                            );
                        }
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    const renderProjectSummary=()=>{
        return (
            <div className="project-summary-wrapper">
                 <div className="sub-heading-text margin-bottom-negative">{'PROJECT SUMMARY: '}</div>
                 {employeeData?.employeeProjects?.map((item, index)=>{
                    return <div key={index}>{item?.projectKeyResponsibilities ? renderProject(item, true) : null}</div>
                 })}
                 {employeeData?.previousOrgAssignments?.map((item, index)=>{
                    return <div key={index}>{item?.keyResponsibilities ? renderProject(item, false) : null}</div>
                 })}
                 { document?.querySelectorAll('#project-detail-wrapper')?.length ? null : <div className="project-summary-text body-text">{'Not Available'}</div> }
            </div>
        )
    }

    return (
        <>
            {
                employeeData && <div className="employee-resume-wrapper" id={`employee-resume-${employeeData?.emidsUniqueId}`}>
                    {renderHeader()}
                    {renderProfileHeader()}
                    <div className="seperator-header"></div>
                    {renderProfileSummary()}
                    {renderSkills()}
                    {renderCertifications()}
                    {renderEmployersDetails()}
                    {renderProjectSummary()}
                </div>
            }
        </>
    );
};

export default EmployeeResume;