import React from "react";
import star from "../../resources/star.svg";

const SkillsBlock = ({ employeeData, className = "" }) => {
  return (
    <div className={`cont ${className}`}>
      <h2>Skills</h2>
      <div className="skills">
        {employeeData?.primarySkills && <h3>Primary</h3>}
        {employeeData?.primarySkills &&
          employeeData?.primarySkills
            .split(",")
            .map((skill) => <span key={skill.trim()}>{skill.trim()}</span>)}
        {employeeData?.secondarySkills && <h3>Secondary</h3>}
        {employeeData?.secondarySkills &&
          employeeData?.secondarySkills
            .split(",")
            .map((skill) => <span key={skill.trim()}>{skill.trim()}</span>)}
        {(employeeData?.skillMatrix?.beginnerSkills ||
          employeeData?.skillMatrix?.intermediateSkills ||
          employeeData?.skillMatrix?.advancedSkills ||
          employeeData?.skillMatrix?.expertSkills) && <h3>Other Skills</h3>}
        {employeeData?.skillMatrix?.beginnerSkills &&
          employeeData?.skillMatrix?.beginnerSkills
            .split(",")
            .filter((skill) => skill.trim() !== "")
            .map((skill) => (
              <span key={skill.trim()}>
                {" "}
                {skill.trim()} - <img src={star} alt="" />
              </span>
            ))}
        {employeeData?.skillMatrix?.intermediateSkills &&
          employeeData?.skillMatrix?.intermediateSkills
            .split(",")
            .filter((skill) => skill.trim() !== "")
            .map((skill) => (
              <span key={skill.trim()}>
                {skill.trim()}- <img src={star} alt="" />
                <img src={star} alt="" />
              </span>
            ))}
        {employeeData?.skillMatrix?.advancedSkills &&
          employeeData?.skillMatrix?.advancedSkills
            .split(",")
            .filter((skill) => skill.trim() !== "")
            .map((skill) => (
              <span key={skill.trim()}>
                {skill.trim()} - <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />{" "}
              </span>
            ))}
        {employeeData?.skillMatrix?.expertSkills &&
          employeeData?.skillMatrix?.expertSkills
            .split(",")
            .filter((skill) => skill.trim() !== "")
            .map((skill) => (
              <span key={skill.trim()}>
                {skill.trim()} - <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
                <img src={star} alt="" />
              </span>
            ))}
      </div>
    </div>
  );
};

export default SkillsBlock;
