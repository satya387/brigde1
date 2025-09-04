
use Bridge;
Go 



IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EmployeeOpportunityStatus')
Begin

if not exists (select id from EmployeeOpportunityStatus where [Status] = 'Active' )
insert into EmployeeOpportunityStatus ([Status])
select 'Active'

if not exists (select id from EmployeeOpportunityStatus where [Status] = 'Withdrawn' )
insert into EmployeeOpportunityStatus ([Status])
select 'Withdrawn'

if not exists (select id from EmployeeOpportunityStatus where [Status] = 'Declined' )
insert into EmployeeOpportunityStatus ([Status])
select 'Declined'

if not exists (select id from EmployeeOpportunityStatus where [Status] = 'Scheduled' )
insert into EmployeeOpportunityStatus ([Status])
select 'Scheduled'


End
go

IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Skills')
Begin

DECLARE @CommaSeparatedSkills NVARCHAR(MAX) = 'HTML/CSS, JavaScript, Python, .Net, Angular, Node JS, MySQL, Dev Ops, QA Automation,
Business Analyst, C#, QA Manual, Java, ADO .Net, Entity Framework, MVC, jQuery, Bootstrap, Graphic Designer, Content writing, .net core';

INSERT INTO Skills (SkillName)
SELECT DISTINCT LTRIM(RTRIM(value))
FROM STRING_SPLIT(@CommaSeparatedSkills, ',') s
LEFT JOIN Skills t ON LTRIM(RTRIM(s.value)) = LTRIM(RTRIM(t.SkillName))
WHERE t.SkillName IS NULL;

End
Go

IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'DisapprovalReasons')
Begin

DECLARE @CommaSeparatedReasons NVARCHAR(MAX) = 'Client Rejection, Behaviour Rejection, Employee Self-rejection, Cost Rejection, Skills Proficiency < 3,
Skills Gap - Potential Training Candidate, Skills Proficient- Ancillary Skills Inadequate';

INSERT INTO DisapprovalReasons (DisapprovalReason)
SELECT DISTINCT LTRIM(RTRIM(value))
FROM STRING_SPLIT(@CommaSeparatedReasons, ',') s
LEFT JOIN DisapprovalReasons t ON LTRIM(RTRIM(s.value)) = LTRIM(RTRIM(t.DisapprovalReason))
WHERE t.DisapprovalReason IS NULL;

End
Go

