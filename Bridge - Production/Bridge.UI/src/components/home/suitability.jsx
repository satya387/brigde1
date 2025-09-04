import React from 'react';
import './home.scss';
import matchIcon from "../../resources/thumbs-up-yellow.svg";
import lessMatchIcon from '../../resources/thumbs-up-grey.svg';

const Suitability = ({ onClose, children }) => {
    return (
        <div className="suitability-cont">
            <h2>Match indicator criteria’s </h2>
            <p>The criteria consist of a combination of properties, each with its own percentage of importance. These combinations of criteria will result in a certain percentage of  match against RR.</p>
            <span className="skills">
                <span>Primary skills</span>
                <span>Secondary skills</span>
                <span>Work experience</span>
                <span>Role</span>
                <span>Location</span>
            </span>
            <h2>How match indicator works?</h2>
            <p>After aligning the Primary Skill stated in the RR with the employee's Primary Skill, the subsequent Matching Criteria is put into action.</p>
            <table>
                <tr>
                    <td>Primary Skill</td>
                    <td>50%</td>
                </tr>
                <tr>
                    <td>Secondary Skill</td>
                    <td>15%</td>
                </tr>
                <tr>
                    <td>Role</td>
                    <td>10%</td>
                </tr>
                <tr>
                    <td>Experience</td>
                    <td>15%</td>
                </tr>
                <tr>
                    <td>Work location</td>
                    <td>10%</td>
                </tr>
            </table>
        </div>
    );
};

export default Suitability;
