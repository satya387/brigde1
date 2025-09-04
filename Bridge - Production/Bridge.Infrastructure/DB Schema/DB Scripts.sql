
IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'Bridge')
Begin
Create DataBase Bridge
End
go 

use Bridge;
Go 

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EmployeeMyJobsSearchCriteria')
Begin

CREATE TABLE EmployeeMyJobsSearchCriteria
(
Id int primary Key Identity(1,1),
EmployeeId nvarchar(100),
ExperienceInYears int,
PrimarySkills nvarchar(1000) Null,
Location nvarchar(50) Null,
Role nvarchar(50) Null,
IsActive bit not null,
CreatedOn DateTime  null,
CreatedBy int null,
ModifiedOn DateTime  NULL,
ModifiedBy int null
)
End
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EmployeeOpportunity')
Begin
Create table EmployeeOpportunity
(
Id int primary key Identity(1,1),
EmployeeId nvarchar(25) not null,
RrId int not null,
DisapprovedBy nvarchar(50),
StatusId int,
Comments nvarchar(max),
CreatedOn DateTime  null,
CreatedBy int null,
ModifiedOn DateTime  NULL,
ModifiedBy int null
)
End
Go

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MailNotification')
begin

Create table MailNotification
(
Id int primary key Identity(1,1),
[From] nvarchar(255),
[To] nvarchar(255),
Cc nvarchar(255),
Bcc nvarchar(255),
[Subject] nvarchar(255),
[Body] nvarchar(max),
[Status] nvarchar(25) ,
Error nvarchar(max),
EmployeeID NVARCHAR(50) null,
RRNumber NVARCHAR(50) null,
IsActive bit not null,
CreatedOn DateTime  null,
CreatedBy int null,
ModifiedOn DateTime  NULL,
ModifiedBy int null
)
End
GO


IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EmployeeOpportunityStatus')
Begin

Create table EmployeeOpportunityStatus
(
Id int primary key Identity(1,1),
[Status] nvarchar(100)
)
End
go


IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Skills')
Begin

CREATE TABLE Skills (
    SkillId INT PRIMARY KEY IDENTITY(1,1),
    SkillName VARCHAR(100) NOT NULL
);

End
Go

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'DisapprovalReasons')
Begin

CREATE TABLE DisapprovalReasons (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DisapprovalReason NVARCHAR(MAX) NOT NULL,
);

End
Go


