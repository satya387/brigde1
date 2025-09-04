export const WFM_TEAM_EMAIL_ADDRESS = "WFM-Team@emids.com";
export const GLOBAL_RMG_EMAIL_ADDRESS = "globalrmg@emids.com";
export const DEV_EMAIL = "bridgeapplicationto@gmail.com";
export const DEV_EMAIL_FROM = "bridgeapplication0@gmail.com";
export const DEV_CHAT = "Kh@emids.com";
export const EMAIL_DATA = {
  WFM_ALLOCATION_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>, <br><br> We have reviewed and will be allocating <EMPLOYEE_NAME> against <RR_NUMBER> effective <ALLOCATION_DATE> with <ALLOCATION_PERCENTAGE>% allocation. <br><br>Thanking You <br>WFM Team.`,
    emailSubject: `BRIDGE: Resource allocation Approval for RR - <RR_NUMBER>`,
  },
  WFM_ALLOCATION_GLOBAL_RMG: {
    emailSubject: `BRIDGE: Resource allocation Approval for RR - <RR_NUMBER>`,
  },
};
export const APPLY_OPPORTUNITY_EMAIL_DATA = {
  EMPLOYEE_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>, <br><br> I have submitted an application for the position associated with RR-number <RR_NUMBER>. Kindly evaluate and respond to the application on Bridge -> Review Applications. <br><br>Thanking You <br><EMPLOYEE_NAME>`,
    emailSubject: `BRIDGE: Application For RR - <RR_NUMBER>`,
  },
};

export const EMPLOYEE_WITHDRAW_EMAIL_DATA = {
  EMPLOYEE_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>, <br><br> I have rescinded the earlier submitted application against <RR_NUMBER>. <br><br> P.S: This is an informational email and no action is needed at your end. <br><br>Additional Comments : <COMMENTS>. <br><br>Thanking You <br><EMPLOYEE_NAME>`,
    emailSubject: `BRIDGE: Withdrawal of application For RR - <RR_NUMBER>`,
  },
};

export const MANAGER_DECLINE_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_EMPLOYEE: {
    emailBody: `Dear <EMPLOYEE_NAME>, <br><br> Your application against <RR_NUMBER> has been regretfully declined on account of <REASON_REJECTION>. Should you wish to reapply for the same position post corrective measures, you can do so on Bridge -> My Applied Opportunities. <br><br>Thanking You <br><MANAGER_NAME>`,
    emailSubject: `BRIDGE: Update on application For RR - <RR_NUMBER>`,
  },
};

export const MANAGER_SCHEDULE_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_EMPLOYEE: {
    emailBody: `Dear <EMPLOYEE_NAME>, <br><br> I have scheduled a connect with you for <RR_NUMBER>. It will reflect in your Outlook Calendar shortly. <br><br>Thanking You <br><MANAGER_NAME>`,
    emailSubject: `BRIDGE: Invite a discussion on RR - <RR_NUMBER>`,
  },
};

export const MANAGER_L2SCHEDULE_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_EMPLOYEE: {
    emailBody: `Dear <EMPLOYEE_NAME>, <br><br>
    I have scheduled a Level 2 connect with you for <RR_NUMBER>. It will reflect in your Outlook Calendar shortly. <br><br>
    Thanking You <br><MANAGER_NAME>`,
    emailSubject: `BRIDGE: Invite Level -2 discussion on RR - <RR_NUMBER>`,
  },
};

export const MANAGER_INTERVIEW_REJECTION_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_EMPLOYEE: {
    emailBody: `Dear <EMPLOYEE_NAME>, <br><br> After careful consideration, we have decided to move with other candidates and your candidature has been dropped. <br><br>Thanking You <br><MANAGER_NAME>`,
    emailSubject: `BRIDGE: Update for discussion on RR - <RR_NUMBER>`,
  },
  MANAGER_MAIL_BODY_TO_WFM: {
    emailBody: `Dear <EMPLOYEE_NAME>, <br><br> After careful consideration, we have decided to move with other candidates and your candidature has been dropped. <br><br>Reason of Rejection : <REJECTION_REASON>. <br><br>Additional Comments : <COMMENTS>. <br><br>Thanking You <br><MANAGER_NAME>`,
    emailSubject: `BRIDGE: Update for discussion on RR - <RR_NUMBER>`,
  },
};

export const MANAGER_RESOURCE_ALLOCATION_REQUEST_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_WFM: {
    emailBody: `Dear WFM Team/WFM SPOC, <br><br>
    I would like to proceed with <CANDIDATE_NAME> for the RR <RR_NUMBER> for the position of <ROLE_NAME> for the project <PROJECT_NAME> effective <ALLOCATION_DATE> with  <ALLOCATION_PERCENTAGE>% allocation.<br><br>  
    Kindly Review and allocate the resource as requested.<br><br>     
    Thanking You <br>
    <MANAGER_NAME>`,
    emailSubject: `BRIDGE: Resource allocation request for RR - <RR_NUMBER>`,
  },
};

export const MANAGER_RESOURCE_RELEASE_REQUEST_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_WFM: {
    emailBody: `Dear WFM Team/WFM SPOC,<br><br>
    I would like to release <CANDIDATE_NAME> from the project <PROJECT_NAME> effective <RELEASE_DATE> due to following <RELEASE_REASON>.<br>Additional Comments: <br><ADDITIONAL_COMMENTS>.<br> I will be updating Release form soon. 
    Kindly Review and plan for Launchpad onboarding the resource as requested.<br><br>   
    Thanking You <br>
    <MANAGER_NAME>`,
    emailSubject: `BRIDGE: Resource Release Request for <PROJECT_NAME>`,
  },
};

export const MANAGER_RESOURCERELEASE_REQUEST_WITHDRAWAL_EMAIL_DATA = {
  MANAGER_MAIL_BODY_TO_WFM: {
    emailBody: `Dear WFM Team/WFM SPOC,<br><br>
    I want to withdraw release of <CANDIDATE_NAME> from the project <PROJECT_NAME> that was initiated earlier due to <WITHDRAWAL_REASON>.<br><br>
    Thanking You <br>
    <MANAGER_NAME>`,
    emailSubject: `BRIDGE: Resource Release withdrawal for <PROJECT_NAME>`,
  },
};

export const WFM_RESOURCE_RELEASE_APPROVAL_EMAIL_DATA = {
  WFM_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>,<br><br>
    We have reviewed and will be releasing <CANDIDATE_NAME> effective <RELEASE_DATE>. Kindly communicate the release details with the employee and update the Resource release form.<br><br> 
    Thanking You <br>
    WFM Team`,
    emailSubject: `BRIDGE: Resource Release Approval for <PROJECT_NAME>`,
  },
};

export const WFM_RESOURCE_RELEASE_WITHDRAWN_EMAIL_DATA = {
  WFM_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>,<br><br>
    We have reviewed and approved the release withdrawal request for <CANDIDATE_NAME>.<br><br> 
    Thanking You <br>
    WFM Team`,
    emailSubject: `BRIDGE: Resource Release Withdrawal Approval for <PROJECT_NAME>`,
  },
};

export const WFM_NOMINATING_RESOURCE_EMAIL_DATA = {
  WFM_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>,<br><br>
    We have nominated <CANDIDATE_NAME> for the position associated with RR-number <RR_NUMBER>. Kindly evaluate and respond to the application on Bridge -> Review Applications.<br><br> 
    Thanking You <br>
    WFM Team`,
    emailSubject: `BRIDGE: Application For RR - <RR_NUMBER> - Nominated`,
  },
  WFM_MAIL_BODY_TO_EMPLOYEE: {
    emailBody: `Dear <CANDIDATE_NAME>,<br><br>
    We have nominated you for the position associated with RR-number <RR_NUMBER>. Kindly go thru application on Bridge -> My Applied Opportunities.<br><br> 
    Thanking You <br>
    WFM Team`,
    emailSubject: `BRIDGE: Application For RR - <RR_NUMBER> - Nominated`,
  },
};

export const WFM_UPDATE_RESOURCE_AS_EARMARKED_EMAIL_DATA = {
  WFM_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>,<br><br>
    We have allocated <CANDIDATE_NAME> against <RR_NUMBER> effective <ALLOCATION_DATE> with <ALLOCATION_PERCENTAGE>% allocation.<br><br> 
    Thanking You <br>
    WFM Team`,
    emailSubject: `BRIDGE: Talent allocated to  <PROJECT_NAME> against <RR_NUMBER>`,
  },
  WFM_MAIL_BODY_TO_GLOBAL_RMG: {
    emailSubject: `BRIDGE: Talent allocated to  <PROJECT_NAME> against <RR_NUMBER>`,
  },
};

export const WFM_UPDATE_RESOURCE_STATUS_EMAIL_DATA = {
  WFM_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>,<br><br>
    As per our discussion, we have de-allocated <CANDIDATE_NAME> against <RR_NUMBER> for <PROJECT_NAME> as of today.<br><br> 
    Thanking You <br>
    WFM Team`,
    emailSubject: `BRIDGE: Talent allocation Change for <PROJECT_NAME> against <RR_NUMBER>`,
  },
  WFM_MAIL_BODY_TO_GLOBAL_RMG: {
    emailSubject: `BRIDGE: Talent allocation Change for <PROJECT_NAME> against <RR_NUMBER>`,
  },
};

export const RELEASE_REJECTION_EMAIL_DATA = {
  EMPLOYEE_MAIL_BODY_TO_MANAGER: {
    emailBody: `Dear <MANAGER_NAME>, <br><br> We have reviewed your resource release request for <EMP_NAME>. After careful review, we have to decline the request due to the below reason. Please feel free to contact WFM for further details, if needed. <br><br>Rejection Comments : <REJECTION_COMMENTS>. <br><br>Thanking You <br>WFM Team.`,
    emailSubject: `BRIDGE: Rejection of Release of <EMP_NAME>`,
  },
};
