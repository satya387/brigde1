ALTER TABLE EmployeeOpportunity
DROP COLUMN [ReasonForDisapprove];

ALTER TABLE [EmployeeOpportunity]
ADD ScheduledDate datetime;

ALTER TABLE EmployeeMyJobsSearchCriteria
ALTER COLUMN PrimarySkills nvarchar(max);
 
ALTER TABLE EmployeeMyJobsSearchCriteria
ALTER COLUMN Role nvarchar(max);

ALTER TABLE [EmployeeOpportunity]
ADD AdditionalComments varchar(500);

ALTER TABLE [EmployeeMyJobsSearchCriteria]
ALTER COLUMN [Location] NVARCHAR(1000) NULL;

ALTER TABLE [EmployeeMyJobsSearchCriteria]
ADD Country varchar(50);

ALTER TABLE [EmployeeOpportunity]
ADD AllocationPercentage int;

ALTER TABLE [EmployeeOpportunity]
ADD AllocationStartDate date;

ALTER TABLE [EmployeeMyJobsSearchCriteria]
DROP COLUMN ExperienceInYears;

ALTER TABLE [EmployeeMyJobsSearchCriteria]
ADD MinExperienceInYears int NULL;

ALTER TABLE [EmployeeMyJobsSearchCriteria]
ADD MaxExperienceInYears int NULL;


IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'BridgeAppAnalytics')
Begin
CREATE TABLE BridgeAppAnalytics
(
	Id int primary Key Identity(1,1),
	EmployeeId nvarchar(25),
	EmployeeName nvarchar(100),
	TimesLoggedIn int,
	LastLogin DateTime,
	LastProfileUpdated DateTime,
	MachineName nvarchar(100),
	MachineIP nvarchar(100),
	BrowserType nvarchar(50),
	City nvarchar(100),
	Country nvarchar(100),
	Latitude nvarchar(10),
	Longitude nvarchar(10),
	CreatedOn DateTime null,
	CreatedBy int null,
	ModifiedOn DateTime NULL,
	ModifiedBy int null
)
End
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EmployeeOpportunityLog')
Begin
CREATE TABLE EmployeeOpportunityLog
(
	[Id] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[EmployeeOpportunityId] [int] FOREIGN KEY REFERENCES EmployeeOpportunity(Id),
	[EmployeeId] [nvarchar](25) NOT NULL,
	[RrId] [int] NOT NULL,
	[CreatedOn] [datetime] NULL,
	[CreatedBy] [nvarchar](50) NULL,
	[ModifiedOn] [datetime] NULL,
	[ModifiedBy] [int] NULL,
	[DisapprovedBy] [nvarchar](50) NULL,
	[StatusId] [int] NULL,
	[Comments] [nvarchar](max) NULL,
	[ScheduledDate] [datetime] NULL,
	[AdditionalComments] [varchar](500) NULL,
	[AllocationPercentage] INT,
	AllocationStartDate DATETIME
)
End
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ResourceAvailability')
Begin
CREATE TABLE ResourceAvailability
(
	Id int primary Key Identity(1,1),
	EmployeeId nvarchar(25),
	EffectiveTill Datetime,
	WFMSpoc nvarchar(40),
	ModifiedOn DateTime NULL,
	AvailableStatusID Int,
	CreatedOn DateTime NULL,
	CreatedBy nvarchar(40),  
	ModifiedBy nvarchar(40),
    WFMEmployeeId nvarchar(25), 
    ManagerApproveOrWithdrawDate DateTime NULL,
    ReleaseReason  nvarchar(300),
    InformedEmployee  nvarchar(25),
    WfmSuggestedDate DateTime NULL    
)
 
End
GO
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ResourceAvailabilityLog')
Begin
CREATE TABLE ResourceAvailabilityLog
(
	Id int primary Key Identity(1,1),
	EmployeeId nvarchar(25),
	EffectiveTill Datetime null,
	WFMSpoc nvarchar(40),
	ModifiedOn DateTime NULL,
	AvailableStatusID Int,
	CreatedOn DateTime Null,
	CreatedBy nvarchar(40),
	ModifiedBy nvarchar(40),
	WFMEmployeeId nvarchar(40),  
    ManagerApproveOrWithdrawDate DateTime NULL,
    ReleaseReason  nvarchar(300),
    InformedEmployee  nvarchar(25),
    WfmSuggestedDate DateTime NULL    
	
)
 
End
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ResourceAvailabilityStatus')
Begin
CREATE TABLE ResourceAvailabilityStatus
(
	Id int primary Key Identity(1,1),
	AvailableStatus nvarchar(50)
)
END
GO

ALTER TABLE EmployeeOpportunity 
ADD ManagerId NVARCHAR(25) NULL;

ALTER TABLE EmployeeOpportunity 
ADD WfmAllocationStartDate DATETIME NULL;

ALTER TABLE EmployeeOpportunity 
ADD WfmAllocationPercentage INT NULL;

ALTER TABLE EMPLOYEEOPPORTUNITYLOG 
ADD ManagerId NVARCHAR(25) NULL;

ALTER TABLE EMPLOYEEOPPORTUNITYLOG 
ADD WfmAllocationStartDate DATETIME NULL;

ALTER TABLE EMPLOYEEOPPORTUNITYLOG 
ADD WfmAllocationPercentage INT NULL;


ALTER TABLE [EmployeeOpportunity] 
ALTER COLUMN CreatedBy NVARCHAR(200) NULL


ALTER TABLE [EmployeeOpportunityLog] 
ALTER COLUMN CreatedBy NVARCHAR(200) NULL
