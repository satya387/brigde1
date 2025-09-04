/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "./index.scss";
import ReactSlider from "react-slider";
import Lightbox from "../../components/lightbox";
import {
  fetchEmpSearchData,
  fetchSaveEmpSearchData,
  fetchSkills,
  fetchJobById,
  fetchRoles,
  fetchCountriesAndCities,
  setHomePageCount,
  fetchProjectName,
} from "../../redux/actions/jobActions";
import loaderImage from "../../resources/Loader.svg";
import Toaster from "../../components/toaster";
import * as GLOBAL_CONST from "../../common/constants";
import * as CONST from "./constant";
import { getLocationData } from "../../common/commonMethods";
import "../../components/toaster/index.scss";

const MyJobs = ({ setCurrentPage }) => {
  const dispatch = useDispatch();
  const empdata = useSelector((state) => state.job.empSearchById);
  const employeeId = useSelector((state) => state.user.employeeId);
  const userRole = useSelector((state) => state.user.role);
  const skillsData = useSelector((state) => state.job.skills);
  const rolesData = useSelector((state) => state.job.roles);
  const geoLocations = useSelector((state) => state.job.geoLocations);
  const projectData = useSelector((state) => state.job.projectNames);
  const jobData = useSelector((state) => state.job.jobById);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedWorkLocation, setSelectedWorkLocation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterType, setToasterType] = useState("");
  const [expValue, setExpValue] = useState([0, 30]);

  useEffect(() => {
    dispatch(fetchEmpSearchData(employeeId));
    dispatch(fetchJobById(employeeId));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, employeeId]);

  // Fetching all the skills on screen loads.
  useEffect(() => {
    if (skillsData?.length === 0) {
      dispatch(fetchSkills());
    }
    if (rolesData?.length === 0) {
      dispatch(fetchRoles());
    }
    if (geoLocations?.length === 0) {
      dispatch(fetchCountriesAndCities());
    }
    if (projectData?.length === 0) {
      dispatch(fetchProjectName());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (empdata && skillsData?.length > 0) {
      const primarySkills = (empdata.primarySkills || "")
        ?.split(",")
        ?.map((skill) => skill.trim())
        ?.filter((skill) => skill !== "");
      let defaultSkills = [];
      primarySkills?.map((item) => {
        const index = skillsData?.findIndex((skills) => skills?.value === item);
        if (index > -1) {
          const val = skillsData[index];
          defaultSkills?.push(val);
        }
      });
      setSelectedSkills(defaultSkills);
    }

    if (empdata && rolesData?.length > 0) {
      const primaryRoles = (empdata.role || "")
        ?.split(",")
        ?.map((role) => role.trim())
        ?.filter((role) => role !== "");
      let defaultRoles = [];
      primaryRoles?.map((item) => {
        const index = rolesData?.findIndex((roles) => roles.value === item);
        if (index > -1) {
          const val = rolesData[index];
          defaultRoles?.push(val);
        }
      });
      setSelectedRoles(defaultRoles);
    }

    if (empdata && geoLocations?.length > 0) {
      const primaryLocations = (empdata.location || "")
        ?.split(",")
        ?.map((role) => role.trim())
        ?.filter((role) => role !== "");
      const defaultSelectedCountry = geoLocations?.find(
        (country) => country?.locationName === empdata?.country
      );
      setSelectedLocation(defaultSelectedCountry);

      let selectedCities = [];
      primaryLocations?.map((cityName) => {
        if (defaultSelectedCountry) {
          const city = defaultSelectedCountry?.cities?.find(
            (city) => city?.cityName === cityName
          );
          selectedCities?.push(city);
        }
      });
      setSelectedWorkLocation(selectedCities);
    }

    if (empdata && projectData?.length > 0) {
      const projects = (empdata?.projectName || "")
        ?.split(",")
        ?.map((project) => project?.trim())
        ?.filter((project) => project !== "");
      let defaultProjects = [];
      projects?.map((item) => {
        const index = projectData?.findIndex(
          (project) => project?.projectName === item
        );
        if (index > -1) {
          const val = projectData[index];
          defaultProjects?.push(val);
        }
      });
      setSelectedProjects(defaultProjects);
    }

    if (empdata) {
      setExpValue([
        empdata?.minExperienceInYears || 0,
        empdata?.maxExperienceInYears || 30,
      ]);
    }
  }, [empdata, skillsData, rolesData, geoLocations, projectData]);

  const handleLightboxOpen = () => {
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleSave = () => {
    setIsLoading(true);
    let skills = [];
    selectedSkills?.map((item) => {
      skills.push(item?.value);
    });
    let roles = [];
    selectedRoles?.map((item) => {
      roles.push(item?.value);
    });
    let location = [];
    if (selectedWorkLocation?.length) {
      selectedWorkLocation?.map((item) => {
        location.push(item?.cityName);
      });
    }
    let projects = [];
    selectedProjects?.map((item) => {
      projects.push(item?.projectName);
    });
    const updatedData = {
      ...empdata,
      employeeId: employeeId,
      primarySkills: skills.join(", "),
      location: location.join(", "),
      role: roles.join(", "),
      country: selectedLocation?.locationName || "",
      minExperienceInYears: expValue[0],
      maxExperienceInYears: expValue[1],
      projectName: projects.join(", "),
    };

    setTimeout(() => {
      dispatch(fetchSaveEmpSearchData(updatedData))
        .then(() => {
          return dispatch(fetchJobById(employeeId));
        })
        .finally(() => {
          // setCurrentPage(1);
          dispatch(setHomePageCount(1));
          setIsLoading(false);
          setLightboxOpen(false);
          setShowOptions(false);
        });
    }, 3000);

    // setTimeout(() => {
    //   dispatch(fetchSaveEmpSearchData(updatedData))
    //     .then(() => {
    //       return dispatch(fetchJobById(employeeId));
    //     })
    //     .finally(() => {
    //       setCurrentPage(1);
    //       setIsLoading(false);
    //       setLightboxOpen(false);
    //     });
    // }, 3000);
  };

  const handleCountryChange = (selected) => {
    setSelectedWorkLocation("");
    setSelectedLocation(selected);
  };

  const handleScroll = () => {
    var objDiv = document.getElementById("popup-scroll");
    setTimeout(() => {
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 200);
  };

  const handleChange = (value) => {
    setExpValue(value);
  };

  const handleResetFilter = () => {
    setSelectedSkills([]);
    setSelectedRoles([]);
    setSelectedProjects([]);
    setExpValue([0, 30]);
    setSelectedLocation("");
    setSelectedWorkLocation("");
  };

  return (
    <>
      <button
        className="text-blue filter tooltip"
        data-tooltip="Filter or set the criteria of your jobs"
        onClick={handleLightboxOpen}
      >
        {userRole === GLOBAL_CONST.WFMTeam
          ? CONST.OPPORTUNITY_HEADING_WFM
          : CONST.FILTER_MY_OPPORTUNITY}
      </button>
      {lightboxOpen && (
        <Lightbox onClose={handleLightboxClose}>
          <div className="page-header">
            <h1>{CONST.OPPORTUNITY_HEADING}</h1>
            <div className="filters">
              {!showOptions && (
                <button
                  className="blue-btn"
                  onClick={() => setShowOptions(true)}
                >
                  {CONST.MODIFY_DETAILS}
                </button>
              )}
            </div>
          </div>
          <div className="text-left ">
            {showOptions ? (
              <>
                <div className="light-content" id="popup-scroll">
                  <div className="crit-cont">
                    <h2>{CONST.ROLE}</h2>
                    <Select
                      isMulti
                      value={selectedRoles}
                      name="roles"
                      options={rolesData}
                      onChange={setSelectedRoles}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      closeMenuOnSelect={false}
                      styles={GLOBAL_CONST.styles}
                    />
                  </div>
                  <div className="crit-cont skills">
                    <div className="selected-skills skill-options skills">
                      <h2>{CONST.PRIMARY_SKILLS}</h2>
                      <Select
                        isMulti
                        value={selectedSkills}
                        name="skills"
                        options={skillsData}
                        onChange={setSelectedSkills}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        closeMenuOnSelect={false}
                        styles={GLOBAL_CONST.styles}
                      />
                    </div>
                  </div>
                  <div className="crit-cont">
                    <h2>{CONST.PROJECT_NAME}</h2>
                    <Select
                      isMulti
                      value={selectedProjects}
                      name="roles"
                      options={projectData || []}
                      onChange={setSelectedProjects}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      closeMenuOnSelect={false}
                      getOptionLabel={(option) =>
                        `${option?.projectName} (Open RRs- ${option?.projectRRCount})`
                      }
                      getOptionValue={(option) => option?.projectName}
                      styles={GLOBAL_CONST.styles}
                    />
                  </div>
                  <div className="crit-cont slide-container">
                    <h2>{CONST.EXPERIENCE_LEVEL}</h2>
                    <label className="slider-label first-slider-label">
                      0 Years
                    </label>
                    <label className="slider-label second-slider-label">
                      30 Years
                    </label>
                    <ReactSlider
                      className="rc-slider"
                      thumbClassName="rc-slider-handle "
                      trackClassName="rc-slider-rail"
                      min={0}
                      max={30}
                      value={expValue}
                      onChange={handleChange}
                      ariaLabel={["Lower thumb", "Upper thumb"]}
                      ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                      renderThumb={(props, state) => (
                        <div {...props}>{state.valueNow}</div>
                      )}
                      pearling
                      minDistance={1}
                    />
                  </div>

                  <div className="crit-cont">
                    <div className="select-location-wrap">
                      <div className="select-location">
                        <h2>Location</h2>
                        <Select
                          name="location-country"
                          id="location-country"
                          options={geoLocations}
                          onChange={handleCountryChange}
                          getOptionLabel={(option) => option.locationName}
                          getOptionValue={(option) => option.locationName}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          styles={GLOBAL_CONST.styles}
                          value={selectedLocation}
                          isClearable
                          isSearchable
                          onFocus={handleScroll}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: "#533EED",
                            },
                          })}
                        />
                      </div>
                      <div className="select-location">
                        <h2>{CONST.WORK_LOCATION}</h2>
                        <Select
                          isMulti
                          name="location-city"
                          options={selectedLocation?.cities || []}
                          onChange={setSelectedWorkLocation}
                          value={selectedWorkLocation}
                          getOptionLabel={(option) => option.cityName}
                          getOptionValue={(option) => option.cityName}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          closeMenuOnSelect={false}
                          onFocus={handleScroll}
                          styles={GLOBAL_CONST.styles}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: "#533EED",
                            },
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {isLoading ? (
                    <>
                      <span className="loader">
                        <img src={loaderImage} alt="saving" />
                      </span>
                    </>
                  ) : (
                    <>
                      <button
                        className="cancel-btn"
                        onClick={handleResetFilter}
                      >
                        {GLOBAL_CONST.RESET_FILTER}
                      </button>
                      <button className="save blue-btn" onClick={handleSave}>
                        {GLOBAL_CONST.SAVE_TEXT}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div>
                <div className="crit-cont skills">
                  <h2>{CONST.PRIMARY_SKILLS}</h2>
                  {selectedSkills?.length
                    ? selectedSkills?.map((skill, index) =>
                        skill?.value.length > 0 ? (
                          <span key={index} style={{ marginRight: 2 }}>
                            {skill?.value}
                          </span>
                        ) : (
                          ""
                        )
                      )
                    : "N/A"}
                </div>
                <div className="crit-cont">
                  <h2>{CONST.EXPERIENCE_LEVEL}</h2>
                  <span>
                    {expValue && expValue?.length
                      ? `${expValue[0]} - ${expValue[1]} Years`
                      : "N/A"}
                  </span>
                </div>
                <div className="crit-cont">
                  <h2>{CONST.LOCATION}</h2>
                  <span>{getLocationData(empdata)}</span>
                </div>
                <div className="crit-cont">
                  <h2>{CONST.ROLE}</h2>
                  {selectedRoles?.length
                    ? selectedRoles?.map((role, index) =>
                        role?.value.length > 0 ? (
                          <span key={index} style={{ marginRight: 2 }}>
                            {role?.value}
                          </span>
                        ) : (
                          ""
                        )
                      )
                    : "N/A"}
                </div>
                <div className="crit-cont">
                  <h2>{CONST.PROJECT_NAME}</h2>
                  {selectedProjects?.length
                    ? selectedProjects?.map((project, index) =>
                        project?.projectName.length > 0 ? (
                          <span key={index} style={{ marginRight: 2 }}>
                            {project?.projectName}
                          </span>
                        ) : (
                          ""
                        )
                      )
                    : "N/A"}
                </div>
              </div>
            )}
          </div>
        </Lightbox>
      )}
      {toasterMessage && showToaster && (
        <Toaster
          message={toasterMessage}
          type={toasterType}
          onClose={() => setShowToaster(false)}
        />
      )}
    </>
  );
};

export default MyJobs;
