GO

CREATE TABLE [dbo].[RR_ResourceRequestsComments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RrId] [int] NOT NULL,
	[RRNumber] [nvarchar](50) NULL,
	[RRComment] [nvarchar](2000) NULL,
	[WFMCreatedBy] [nvarchar](50) NOT NULL,
	[WFMCreatedDate] [datetime] NOT NULL
) ON [PRIMARY]
GO

GO

CREATE TABLE [dbo].[RR_ResourceRequestsCommentsLog](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RrId] [int] NOT NULL,
	[RRNumber] [nvarchar](50) NULL,
	[RRComment] [nvarchar](2000) NULL,
	[WFMCreatedBy] [nvarchar](50) NOT NULL,
	[WFMCreatedDate] [datetime] NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE EmployeeMyJobsSearchCriteria
ADD ProjectName NVARCHAR(Max) NULL;

ALTER TABLE EmployeeOpportunity ADD IsRampUpProject BIT NOT NULL DEFAULT 0;
ALTER TABLE EMPLOYEEOPPORTUNITYLOG ADD IsRampUpProject BIT NOT NULL DEFAULT 0;

ALTER TABLE ResourceAvailability
ADD WfmRejectComment varchar(300);

ALTER TABLE ResourceAvailabilityLog
ADD WfmRejectComment varchar(300);

ALTER TABLE [RR_ResourceRequestsComments]
ADD RRID int;

ALTER TABLE [RR_ResourceRequestsCommentsLog]
ADD RRID int;

ALTER TABLE ResourceAvailability
ADD Comments varchar(300);

ALTER TABLE ResourceAvailabilityLog
ADD Comments varchar(300);

CREATE TABLE BridgeConfigSettings (
    Id INT PRIMARY KEY IDENTITY(1,1),
    [Name] NVARCHAR(255) NOT NULL,
    [Value] NVARCHAR(255) NOT NULL,
	IsEnabled BIT default 1
);
Go
 

ALTER TABLE EmployeeOpportunityStatus
ADD RRLookUpValue varchar(1000);

ALTER TABLE EmployeeOpportunityStatus
ADD TalentLookUpValue varchar(1000);

Update  EmployeeOpportunityStatus  Set RRLookUpValue='@TalentName Applied for the RR' Where [Status]='Active'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@TalentName Withdrawn the application for the RR' Where [Status]='Withdrawn'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@ManagerName  Declined  the application of @TalentName for the RR' Where [Status]='Declined'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@ManagerName Scheduled a meeting with @TalentName on @ScheduledDate for the RR'  Where [Status]='Scheduled'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@ManagerName  Requested Allocation for @TalentName effective @AllocationRequestedDate for the RR' Where [Status]='AllocationRequested'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@ManagerName Dropped for @TalentName for the RR after the interview' Where [Status]='Dropped'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@WFMName Earmarked the @TalentName on effective @EarmarkedDate for the RR Withdrawn the application Earmarked'  Where [Status]='Earmarked'
Update  EmployeeOpportunityStatus  Set RRLookUpValue='@ManagerName  L2 Scheduled a meeting with @TalentName on @L2DiscussionDate for the RR' Where [Status]='L2Discussion'


Update  EmployeeOpportunityStatus  Set TalentLookUpValue='@TalentName assigned to Launchpad' Where [Status]='Active'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='@TalentName Withdrawn the RR3 due to the reason @reason' Where [Status]='Withdrawn'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='Application is Declined by Manager for RR2' Where [Status]='Declined'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='An interview scheduled with Talent for @ScheduledDate for RR1'  Where [Status]='Scheduled'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='@ManagerName  raised the Allocation Request for the Talent for RR1' Where [Status]='AllocationRequested'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='@ManagerName Dropped for @TalentName for the RR after the interview' Where [Status]='Dropped'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='@WFMName  approved the allocation request for Talent  for RR1'  Where [Status]='Earmarked'
Update  EmployeeOpportunityStatus  Set TalentLookUpValue='@ManagerName scheduled L2 meeting with Talent  for RR1' Where [Status]='L2Discussion'

ALTER TABLE EmployeeOpportunity ADD RRStatus BIT NOT NULL DEFAULT 0;
ALTER TABLE EMPLOYEEOPPORTUNITYLOG ADD RRStatus BIT NOT NULL DEFAULT 0;

 