import axios from "axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { SEND_EMAIL, SEND_CHAT, SEND_INITIATE_CHAT } from "../config";
import { QUARTER_MIN, MILLISECONDS_IN_MINUTES } from "./constants";
import { DEV_EMAIL, DEV_CHAT } from "./emailConstants";

export const getAuthToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return accessToken;
  }

  return null;
};

export const getUserName = () => {
  const userName = localStorage.getItem("userName");
  if (userName) {
    return userName;
  }

  return null;
};
export const emailRegex = /^$|^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

export const formatDate = (date) => {
  const data = new Date(
    date?.charAt(date.length - 1) === "Z" ? date : `${date}Z`
  );
  let dateVal = data.toLocaleDateString("rm-CH", {
    day: "numeric",
    month: "short",
  });
  let time = data.toLocaleTimeString("rm-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateVal}, ${time}`;
};

export const checkScheduleTimePassed = (date) => {
  const currentDate = new Date();
  const scheduledDate = new Date(
    date?.charAt(date.length - 1) === "Z" ? date : `${date}Z`
  );
  if (currentDate > scheduledDate) {
    return true;
  } else {
    return false;
  }
};

export const getLocationData = (empdata) => {
  const primaryLocations = (empdata?.location || "")
    .split(",")
    .map((role) => role.trim())
    .filter((role) => role !== "");
  if (empdata?.country && empdata?.location) {
    if (primaryLocations?.length === 1) {
      return `${empdata?.country} - ${empdata?.location}`;
    } else {
      return `${empdata?.country} - Multiple Cities`;
    }
  } else if (empdata?.country) {
    return `${empdata?.country}`;
  } else if (empdata?.location) {
    return `${empdata?.location}`;
  } else {
    return "N/A";
  }
};

export const sendEmail = async (
  emailBody,
  emailSubject,
  toRecipients,
  ccRecipients
) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const toEmailAddresses = toRecipients?.map((recipient) => ({
      emailAddress: {
        address:
          process.env.REACT_APP_ENV !== "production" ? DEV_EMAIL : recipient,
      },
    }));

    const ccEmailAddresses = ccRecipients?.map((recipient) => ({
      emailAddress: {
        address:
          process.env.REACT_APP_ENV !== "production" ? DEV_EMAIL : recipient,
      },
    }));

    const sendMail = {
      message: {
        subject: emailSubject,
        body: {
          contentType: "HTML",
          content: emailBody,
        },
        toRecipients: toEmailAddresses,
        ccRecipients: ccEmailAddresses,
      },
    };

    const response = await axios.post(`${SEND_EMAIL}`, sendMail, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendChat = async (chatText, chatRecipient) => {
  try {
    let recipient =
      process.env.REACT_APP_ENV !== "production" ? DEV_CHAT : chatRecipient;
    const accessToken = localStorage.getItem("accessToken");

    // Initiate Chat and get the unique chatId
    const chatInitiateContent = JSON.stringify({
      chatType: "OneOnOne",
      members: [
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          roles: ["owner"],
          "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${getUserName()}')`,
        },
        {
          "@odata.type": "#microsoft.graph.aadUserConversationMember",
          roles: ["owner"],
          "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${recipient}')`,
        },
      ],
    });

    const chatInitiateResponse = await axios.post(
      `${SEND_INITIATE_CHAT}`,
      chatInitiateContent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (chatInitiateResponse?.status === 201) {
      let chatInitiateId = chatInitiateResponse.data.id;
      let chatContent = JSON.stringify({
        body: {
          content: chatText,
        },
      });
      // Send the chat using the above generated chatId
      const chatResponse = await axios.post(
        `${SEND_CHAT.replace("<chatInitiateId>", chatInitiateId)}`,
        chatContent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const getLocalIP = async () => {
  return new Promise((resolve, reject) => {
    window.RTCPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
    if (!window.RTCPeerConnection) {
      reject("WebRTC not supported by browser");
    }
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel("");
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => reject(err));
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) {
        return;
      }
      resolve(ice.candidate.candidate.split(" ")[4]);
      pc.onicecandidate = () => {};
    };
  });
};

export const getPublicIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting public IP: ", error);
  }
};

export const getLocation = async () => {
  return new Promise((res, rej) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Sorry, your browser does not support HTML5 geolocation.");
    }

    async function success(position) {
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`;
      const response = await fetch(url);
      const data = await response.json();
      res(data);
    }

    function error(error) {
      console.error(
        "Sorry, we can't retrieve your local weather without location permission."
      );
      rej(false);
    }
  });
};

export const getBrowserType = () => {
  const test = (regexp) => {
    return regexp.test(navigator.userAgent);
  };

  if (test(/opr\//i) || !!window.opr) {
    return "Opera";
  } else if (test(/edg/i)) {
    return "Microsoft Edge";
  } else if (test(/chrome|chromium|crios/i)) {
    return "Google Chrome";
  } else if (test(/firefox|fxios/i)) {
    return "Mozilla Firefox";
  } else if (test(/safari/i)) {
    return "Apple Safari";
  } else if (test(/trident/i)) {
    return "Microsoft Internet Explorer";
  } else if (test(/ucbrowser/i)) {
    return "UC Browser";
  } else if (test(/samsungbrowser/i)) {
    return "Samsung Browser";
  } else {
    return "Unknown browser";
  }
};

export const exportToCSV = (apiData, fileName) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(apiData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

export const formateDateFromddmmyyyyTommddyyyy = (date) => {
  const format = date.split("/");
  return `${format[1]}/${format[0]}/${format[2]}`;
};

export const getDashSeparatedDate = (datValue) => {
  const dateObj = new Date(datValue);
  const month = dateObj.getMonth() + 1; //months from 1-12
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return (
    year +
    "-" +
    `${month / 10 >= 1 ? month : `0${month}`}` +
    "-" +
    `${day / 10 >= 1 ? day : `0${day}`}`
  );
};

export const convertDateFromSlashSeparatedToDashSeparated = (dateValue) => {
  const format = dateValue.split("/");
  return `${format[2]}-${format[1]}-${format[0]}`;
};
export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );
};

export const getDateAfterThreeWeeks = () => {
  const currentDate = new Date();
  // Calculate the date 21 days from now using getDate
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 21);
  return futureDate;
};

export const getNearestMaxQuarter = () => {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  const minutesToAdd = QUARTER_MIN - (currentMinutes % QUARTER_MIN);

  const nearestMaxQuarter = new Date(
    now.getTime() + minutesToAdd * MILLISECONDS_IN_MINUTES
  );

  return nearestMaxQuarter;
};

export const convertUTCtoIST = (utcISOString) => {
  // Create a Date object from the UTC ISO string
  const utcDate = new Date(utcISOString);
  // Add 5 hours and 30 minutes to convert to IST
  utcDate.setHours(utcDate.getHours() + 5);
  utcDate.setMinutes(utcDate.getMinutes() + 30);

  // Format the date in the desired string format (YYYY-MM-DDTHH:mm:ss.SSS)
  const istDateString = utcDate.toISOString().replace("Z", "");

  return istDateString;
};

export const isEmpty = (obj) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
};

export const applyFilters = (data, columnName, searchTerm) => {
  return data.filter((item) => {
    if (Array.isArray(searchTerm) && searchTerm.length === 2) {
      const agingValue = item[columnName];
      const [minRange, maxRange] = searchTerm;
      return agingValue >= minRange && agingValue <= maxRange;
    } else {
      const columnValue = String(item[columnName]).toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      return columnValue.includes(searchTermLower);
    }
  });
};

export const getAging = (job) => {
  const startDate = new Date(
    job?.startDate || job?.projectStartDate || job?.rrCreatedDate
  );
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = currentDate - startDate;

  // Convert milliseconds to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
};

export const sortHomeData = (jobData, columnName, sortOrder) => {
  return [
    ...jobData?.sort((a, b) => {
      if (columnName === "aging" || columnName === "projectStartDate") {
        const daysDifferenceA = getAging(a);
        const daysDifferenceB = getAging(b);
        if (sortOrder === "asc") {
          return daysDifferenceA - daysDifferenceB;
        } else {
          return daysDifferenceB - daysDifferenceA;
        }
      } else if (columnName === "employeeAppliedCount") {
        if (sortOrder === "asc") {
          return a.employeeAppliedCount - b.employeeAppliedCount;
        } else {
          return b.employeeAppliedCount - a.employeeAppliedCount;
        }
      }
      else if (columnName === "experience") {       
        
        if (sortOrder === "asc") {
          return a.experience - b.experience;
        } else {
          return b.experience - a.experience;
        }
      } else if (columnName) {
        const aValue = String(
          a[columnName] ||
            a["project"] ||
            a["requiredExperience"] ||
            ""
        ); // Convert to string and check all three properties
        const bValue = String(
          b[columnName] ||
            b["project"] ||
            b["requiredExperience"] ||
            ""
        ); // Convert to string and check all three properties
        if (sortOrder === "asc") {
          return aValue?.localeCompare(bValue);
        } else {
          return bValue?.localeCompare(aValue);
        }
      }
      return 0;
    }),
  ];
};

export const sortReviewApplicationData = (jobData, columnName, sortOrder) => {
  return [
    ...jobData?.sort((a, b) => {
      if (columnName === "aging") {
        const daysDifferenceA = getAging(a);
        const daysDifferenceB = getAging(b);
        if (sortOrder === "asc") {
          return daysDifferenceA - daysDifferenceB;
        } else {
          return daysDifferenceB - daysDifferenceA;
        }
      }
      else if (columnName === "requiredExperience") {
        const aValue = parseFloat(a[columnName]);
        const bValue = parseFloat(b[columnName]);
        if (!isNaN(aValue) && !isNaN(bValue)) {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
      } else if (columnName) {
        const aValue = String(a[columnName] || a["project"] || "");
        const bValue = String(b[columnName] || b["project"] || "");
        if (sortOrder === "asc") {
          return aValue?.localeCompare(bValue);
        } else {
          return bValue?.localeCompare(aValue);
        }
      }
      return 0;
    }),
  ];
};

export const sortLaunchpadEmpData = (jobData, columnName, sortOrder) => {
  return [
    ...jobData?.sort((a, b) => {
      if (columnName) {
        if (columnName === "experience" || columnName === "availableAllocationPercentage" || columnName === "aging" ) {
          const aValue = parseFloat(a[columnName]);
          const bValue = parseFloat(b[columnName]);
          if (!isNaN(aValue) && !isNaN(bValue)) {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
        } else {
          const aValue = String(a[columnName] || ""); // Ensure aValue is a string
          const bValue = String(b[columnName] || ""); // Ensure bValue is a string
          if (sortOrder === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      }
      return 0;
    }),
  ];
};

const formatNumber = (inputNumber) => {
  if (Number.isInteger(inputNumber)) {
    // If it's a whole number, return as is
    return inputNumber;
  } else {
    // If it's a decimal, round to two decimal places
    return inputNumber.toFixed(2);
  }
};

export const getAboutMePercentage = (employeeData) => {
  // about percentage: 10%
  const aboutPercentage = employeeData?.about?.length > 0 ? 10 : 0;
  return aboutPercentage;
};

export const getPrimarySkillsPercentage = (employeeData) => {
  return employeeData?.skillMatrix?.primarySkills?.length > 0 ? 5 : 0;
};

export const getSecondarySkillsPercentage = (employeeData) => {
  return employeeData?.skillMatrix?.secondarySkills?.length > 0 ? 5 : 0;
};

export const getCertificationsPercentage = (employeeData) => {
  return employeeData?.skillMatrix?.certifications?.length > 0 ? 10 : 0;
};

export const getEmidsProjectsWithResponsibilities = (employeeData) => {
  const emidsProjectsWithResponsibilities =
    employeeData?.employeeProjects?.filter(
      (emidsProject) => emidsProject?.projectKeyResponsibilities?.length > 0
    );

  const emidsProjectCompletenessRatio =
    emidsProjectsWithResponsibilities?.length /
    employeeData?.employeeProjects?.length;

  const emidsProjectPercentage =
    emidsProjectCompletenessRatio > 0 ? 40 * emidsProjectCompletenessRatio : 0;

  return formatNumber(emidsProjectPercentage);
};

export const getPrevProjectPercentage = (employeeData) => {
  const pastProjectsWithResponsibilities =
    employeeData?.previousOrgAssignments?.filter(
      (pastProject) => pastProject?.keyResponsibilities?.length > 0
    );

  const pastProjectCompletenessRatio =
    pastProjectsWithResponsibilities?.length /
    employeeData?.previousOrgAssignments?.length;

  return pastProjectCompletenessRatio > 0
    ? 30 * formatNumber(pastProjectCompletenessRatio)
    : 0;
};

export const getProfileCompletenessPercentage = (employeeData) => {
  // about percentage: 10%
  const aboutPercentage = employeeData?.about?.length > 0 ? 10 : 0;
  // skills and certification percentage: 5 + 5 + 10 = 20%
  const primarySkillsPercentage =
    employeeData?.skillMatrix?.primarySkills?.length > 0 ? 5 : 0;
  const secondarySkillsPercentage =
    employeeData?.skillMatrix?.secondarySkills?.length > 0 ? 5 : 0;
  const certificationsPercentage =
    employeeData?.skillMatrix?.certifications?.length > 0 ? 10 : 0;
  // details of Emids project percentage: 40%
  const emidsProjectsWithResponsibilities =
    employeeData?.employeeProjects?.filter(
      (emidsProject) => emidsProject?.projectKeyResponsibilities?.length > 0
    );
  const emidsProjectCompletenessRatio =
    emidsProjectsWithResponsibilities?.length /
    employeeData?.employeeProjects?.length;
  const emidsProjectPercentage =
    emidsProjectCompletenessRatio > 0 ? 40 * emidsProjectCompletenessRatio : 0;
  // details of previous organisation project percentage: 30%
  const pastProjectsWithResponsibilities =
    employeeData?.previousOrgAssignments?.filter(
      (pastProject) => pastProject?.keyResponsibilities?.length > 0
    );
  const pastProjectCompletenessRatio =
    pastProjectsWithResponsibilities?.length /
    employeeData?.previousOrgAssignments?.length;
  const prevProjectPercentage =
    pastProjectCompletenessRatio > 0 ? 30 * pastProjectCompletenessRatio : 0;

  return (
    aboutPercentage +
    primarySkillsPercentage +
    secondarySkillsPercentage +
    certificationsPercentage +
    emidsProjectPercentage +
    prevProjectPercentage
  );
};

export const getFormattedDate = (job) => {
  const startDate = new Date(job.startDate || job.projectStartDate);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return startDate.toLocaleString(undefined, options);
};

export const formatDateTime = (inputDateTime) => {
  const inputDate = new Date(inputDateTime);

  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
  const year = inputDate.getFullYear();

  const formattedDateTime = `${formattedTime}, ${day}-${month}-${year}`;

  return formattedDateTime;
};

export const calculateMinMax = (arr, key) => {
  const values = arr.map(item => item[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return [min, max];
};

export const formatDateToddmmyyyy = (date) => {
  if (date === "" || date === undefined)
    return ""
  else {
    const dateParts = date.split(" ")[0].split("/");
    return `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
  }
};

export const formatyyyymmddToddmmyyyy = (date) => {
  if (date === "")
    return ""
  else {
    const dateParts = date.split("T")[0].split("-");
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }
};

