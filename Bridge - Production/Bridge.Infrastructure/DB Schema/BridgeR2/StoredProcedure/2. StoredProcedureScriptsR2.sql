CREATE OR ALTER PROCEDURE [dbo].[USP_GetCities]   
AS    
BEGIN  
  select Id, CityName, 'IN' as Country from Tbl_INDIACitiesMaster union all
  select Id, CityName, 'UK' as Country from Tbl_UKCitiesMaster union all
  select Id, CityName, 'US' as Country from Tbl_USCitiesMaster union all
  select Id, CityName, case when LocationId = 4 then 'CA' when LocationId = 5 then 'RO' when LocationId = 6 then 'AR' when LocationId = 8 then 'ARG' when LocationId = 9 then 'MX' else '' end as Country from tbl_CityMaster;
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetResourcesByWFM] 
AS
BEGIN
   SELECT distinct E1.CommonName as [Employee Name],                                                        
	E1.EmpEmidsId as [Employee ID],                                                        
	E1.EmpMailId,  
	E1.EmpPersonalCellNo as [Telephone Mobile],
	ISNULL(d.Designation,'') as [Designation],                                                        
	ISNULL(E1.EmpManager,'') as [Reporting Manger Emp ID],                                                        
	ISNULL(E2.CommonName,'') as [Reporting Manager Name],                                       
	ISNULL(E1.EmpLocation,'') as [Business Location],                                                  
	ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as [Business City],                  
	ISNULL(cast(E1.EmpExperience as float),0.0) as [Past Experience], 
	CASE WHEN (Year(E1.LastWorkingDate)=1900 or E1.LastWorkingDate IS NULL) then ISNULL(cast(datediff(mm,E1.EmpDateofJoin,getdate()) as float),0.0)   
		ELSE ISNULL(cast(datediff(mm,E1.EmpDateofJoin,E1.LastWorkingDate) as float),0.0) end as [eMids Experience],                                             
	CASE WHEN E1.EmpGender='M' then 'Male' When E1.EmpGender='F' then 'Female' When E1.EmpGender='O' then 'Other' else ''  end as [Gender],                
	ISNULL((select dbo.fn_GetProjectsForEmployee(e1.EmpeMidsID)),'') as [Project Name],                                  
	ISNULL((select[dbo].[fn_GetAccountForEmpId](e1.EmpeMidsID)),'') as [Account Name],                            
	ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as WorkingCity,                  
	ISNULL((select dbo.fn_GetBUForEmployee(e1.EmpeMidsID)),'') AS BU,
	ISNULL((select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID,'Account')),'') AS PrimaryAccount,
	ISNULL((select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID,'Project')),'') AS PrimaryProject,
	ISNULL((select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID,'BU')),'') AS PrimaryBU,
	ISNULL(ER.Role,'') AS EmployeeRole,
	ISNULL(ER.PrimarySkill,'') AS PrimarySkill,
	ISNULL(ER.SecondarySkill,'') AS SecondarySkill,
	ISNULL(ra.WFMSpoc, '') AS WFMSpoc,
	ISNULL(ra.EffectiveTill, null) As EffectiveTill ,
	ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,
	 ra.ManagerApproveOrWithdrawDate,
	 ra.WfmSuggestedDate,
	 ra.ReleaseReason,
	ISNULL(ra.InformedEmployee,'False') AS InformedEmployee
 
    FROM Employeemaster e1                                                        
    LEFT JOIN Employeemaster e2 on e1.EmpManager=e2.EmpEmidsid                                
    LEFT JOIN FunctionMaster FM ON ISNULL(e1.EmpFunction , 0) = FM.FunctionId AND FM.IsActive = 1                            
    LEFT JOIN Designation d on E1.empdesignation=d.designationid                                                         
    LEFT JOIN Designation d1 on E2.empdesignation=d1.designationid                       
    LEFT JOIN DeptMaster Dept on Dept.DeptId=E1.EmpDepartment                                                  
    LEFT JOIN Practiceareamaster p on E1.primarypracticearea=p.practiceareaid                                                         
    LEFT JOIN ResourceAssign RS on RS.EmpeMidsID = e1.EmpeMidsID and RS.ReleaseDate >= GETDATE() and ISDuplicate != 1                 
    LEFT JOIN ProjectMaster PM On RS.ProjId = PM.ProjId                
    LEFT JOIN CustomerMaster CM On CM.CustomerID = PM.CustomerId                
    LEFT JOIN MasterCustomer MC On MC.MastCustId = CM.MastCustId 
    LEFT JOIN EmployeeRole ER on E1.EmpeMidsID = ER.EmpeMidsID
	LEFT JOIN ResourceAvailability ra on E1.EmpeMidsID = ra.EmployeeId
	LEFT JOIN ResourceAvailabilityStatus ras on ra.AvailableStatusID = ras.Id 
	WHERE ras.AvailableStatus in ('Release Requested', 'Withdraw Requested') 
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetEmployeeIDByRrId]
@RrId INT
AS
BEGIN
     SET NOCOUNT ON;
    SELECT EmployeeID
    FROM EmployeeOpportunity
    WHERE RrId = @RrId;
END;

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_InsertEmployeeOpportunityLog]
(
	@EmployeeOpportunityId INT
    ,@EmployeeId NVARCHAR(25)
    ,@RrId INT
	,@CreatedOn DATETIME
	,@CreatedBy INT
	,@ModifiedOn DATETIME
	,@ModifiedBy INT
	,@DisapprovedBy NVARCHAR(100)
    ,@StatusId INT
	,@Comments NVARCHAR(max)
    ,@ScheduledDate DATETIME
    ,@AdditionalComments NVARCHAR(max)
	,@AllocationPercentage INT
	,@AllocationStartDate DATETIME
)
AS
BEGIN
    INSERT INTO EmployeeOpportunityLog (EmployeeOpportunityId, EmployeeId, RrId, CreatedOn, CreatedBy, ModifiedOn ,ModifiedBy, DisapprovedBy, StatusId, Comments, ScheduledDate, AdditionalComments, AllocationPercentage, AllocationStartDate)
    VALUES (@EmployeeOpportunityId, @EmployeeId, @RrId,@CreatedOn, @CreatedBy, @ModifiedOn, @ModifiedBy, @DisapprovedBy, @StatusId, @Comments, @ScheduledDate, @AdditionalComments, @AllocationPercentage, @AllocationStartDate);
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetCities]   
AS    
BEGIN  
  select Id, CityName, 'IN' as Country from Tbl_INDIACitiesMaster union all
  select Id, CityName, 'UK' as Country from Tbl_UKCitiesMaster union all
  select Id, CityName, 'US' as Country from Tbl_USCitiesMaster union all
  select Id, CityName, case when LocationId = 4 then 'CA' when LocationId = 5 then 'RO' when LocationId = 6 then 'AR' when LocationId = 8 then 'ARG' when LocationId = 9 then 'MX' else '' end as Country from tbl_CityMaster;
END

GO

CREATE OR ALTER PROCEDURE [dbo].[GetWFMEmployees]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT e1.EmpeMidsID, CommonName, EmpMailID, EmpLocation
	   FROM Employeemaster e1     
	   INNER JOIN ResourceAssign RA on e1.EmpeMidsID = RA.EmpeMidsID
	   INNER JOIN ProjectMaster PM on Pm.ProjId = RA.ProjId
    WHERE 
		E1.IsActive = 1 AND IsDuplicate = 0 AND ReleaseDate >= GETDATE() and Projname like '%WFM%'
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetBridgeUsageReport]
	@FromDate DateTime,
	@ToDate DateTime
AS
BEGIN
 
	Select 
	E1.EmpEmidsId as [Employee ID],
	E1.CommonName as [Employee Name],
	ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as [Work Location],
	RoleExists.EmpeMidsID,
	CASE WHEN (RoleExists.EmpeMidsID Is NULL) THEN 'Employee' ELSE 'Manager' END [Role],
	-- Get count of RR's owned by Manager
	(Select Count(r.Id) [NoRRsOwned] FROM RR_ResourceRequests(Nolock) r INNER Join ProjectMaster(Nolock)
	pm On r.ProjectId = pm.ProjId INNER Join RR_RequestStatusMaster(Nolock) rrm On r.StatusId = rrm.StatusId INNER JOIN ProjectmasterAccess PMA ON PMA.ProjID = Pm.ProjId
	AND PMA.RoleID IN (1,2,3,4,5,6,7,8,10) Where rrm.RRStatus = 'Open' And rrm.IsActive = 1
	AND (PMA.Enddate >= Getdate() OR Year(PMA.EndDate) = 1900) And pma.EmpeMidsID = E1.EmpEmidsId)[NoRRsOwned],
	ManagerRR.*,
	EmployeeRR.*,
	Analytics.*
 
	From EmployeeMaster E1
 
	LEFT JOIN(
	SELECT
	pma.EmpeMidsID AS EmployeeId,
    SUM(CASE WHEN UPPER(S.Status) = 'ACTIVE' THEN 1 ELSE 0 END) AS [Active Manager],
    SUM(CASE WHEN UPPER(S.Status) = 'WITHDRAWN' THEN 1 ELSE 0 END) AS [Withdrawn Manager],
    SUM(CASE WHEN UPPER(S.Status) = 'DECLINED' THEN 1 ELSE 0 END) AS [Declined Manager],
    SUM(CASE WHEN UPPER(S.Status) = 'SCHEDULED' THEN 1 ELSE 0 END) AS [Scheduled Manager],
    SUM(CASE WHEN UPPER(S.Status) = 'ALLOCATIONREQUESTED' THEN 1 ELSE 0 END) AS [AllocationRequested Manager],
    SUM(CASE WHEN UPPER(S.Status) = 'DROPPED' THEN 1 ELSE 0 END) AS [Dropped Manager],
	Count(O.RrId) AS [Total Manager]
	FROM 
		RR_ResourceRequests(Nolock) r INNER Join ProjectMaster(Nolock)	pm On r.ProjectId = pm.ProjId 
		INNER Join RR_RequestStatusMaster(Nolock) rrm On r.StatusId = rrm.StatusId 
		INNER JOIN ProjectmasterAccess PMA ON PMA.ProjID = Pm.ProjId AND PMA.RoleID IN (1,2,3,4,5,6,7,8,10)
		LEFT JOIN EmployeeOpportunity O (NOLOCK) ON O.RrId = R.Id
		LEFT JOIN EmployeeOpportunityStatus S (NOLOCK) ON O.StatusId = S.Id
	WHERE
		rrm.RRStatus = 'Open'
		AND rrm.IsActive = 1
		AND (PMA.Enddate >= Getdate() OR Year(PMA.EndDate) = 1900)
		--AND pma.EmpeMidsID =  E1.EmpEmidsId
		AND CAST(O.CreatedOn AS DATE) BETWEEN CAST(@FromDate AS DATE) AND CAST(@ToDate AS DATE)
	GROUP BY
		pma.EmpeMidsID) AS ManagerRR ON ManagerRR.EmployeeId = E1.EmpEmidsId
 
		LEFT JOIN(
		SELECT
		O.EmployeeId,
		SUM(CASE WHEN UPPER(S.Status) = 'ACTIVE' THEN 1 ELSE 0 END) AS [Active Employee],
		SUM(CASE WHEN UPPER(S.Status) = 'WITHDRAWN' THEN 1 ELSE 0 END) AS [Withdrawn Employee],
		SUM(CASE WHEN UPPER(S.Status) = 'DECLINED' THEN 1 ELSE 0 END) AS [Declined Employee],
		SUM(CASE WHEN UPPER(S.Status) = 'SCHEDULED' THEN 1 ELSE 0 END) AS [Scheduled Employee],
		SUM(CASE WHEN UPPER(S.Status) = 'ALLOCATIONREQUESTED' THEN 1 ELSE 0 END) AS [AllocationRequested Employee],
		SUM(CASE WHEN UPPER(S.Status) = 'DROPPED' THEN 1 ELSE 0 END) AS [Dropped Employee],
		Count(O.RrId) AS [Total Employee]
	FROM 
		EmployeeOpportunity O (NOLOCK)
		LEFT JOIN EmployeeOpportunityStatus S (NOLOCK) ON O.StatusId = S.Id
	WHERE
		CAST(O.CreatedOn AS DATE) BETWEEN CAST(@FromDate AS DATE) AND CAST(@ToDate AS DATE)
	GROUP BY
		EmployeeId) AS EmployeeRR ON EmployeeRR.EmployeeId = E1.EmpEmidsId
 
		LEFT JOIN(
			Select 
		EmployeeId
		,Max(TimesLoggedIn) NoOfTimesLoggedIn
		,Max(LastLogin) LastLogin
		,Max(LastProfileUpdated) ProfileUpdatedOn
		From BridgeAppAnalytics(Nolock) Group By EmployeeId) AS Analytics ON Analytics.EmployeeId = E1.EmpEmidsId
 
		LEFT JOIN(
		Select pma.EmpeMidsID
		From ProjectMaster(Nolock) p 
		Inner Join ProjectmasterAccess(Nolock) pma On p.ProjID = pma.ProjId
		Inner Join ProjectMasterRoles(Nolock) pr On  pma.RoleID = pr.ID
		Where (Pma.EndDate >= GetDate() or Year(pma.EndDate) = 1900) Group By pma.EmpeMidsID) AS RoleExists ON RoleExists.EmpeMidsID = E1.EmpEmidsId
 
	Where E1.isactive = 1
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetRRProgressReport]
	@FromDate DateTime,
	@ToDate DateTime
AS
BEGIN
    SET NOCOUNT ON;
-- RR Progress Report
SELECT
    r.RRNumber AS [RR Number],
    pm.ProjName AS [Project Name],
    r.Role AS [Role Requested],
    r.RLSTechnology AS [Primary Skills],
    Case When R.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END)
		When R.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) When R.Location='UK' Then (CASE WHEN WorkLocation is not null
		or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) ELSE CMT.CityName END AS [Work Location],
    r.YearsOfExp AS [Experience],
    r.StartDate AS [Posted On],
    SUM(CASE WHEN UPPER(S.Status) = 'ACTIVE' THEN 1 ELSE 0 END) AS [Active Employee],
    SUM(CASE WHEN UPPER(S.Status) = 'WITHDRAWN' THEN 1 ELSE 0 END) AS [Withdrawn Employee],
    SUM(CASE WHEN UPPER(S.Status) = 'DECLINED' THEN 1 ELSE 0 END) AS [Declined Employee],
    SUM(CASE WHEN UPPER(S.Status) = 'SCHEDULED' THEN 1 ELSE 0 END) AS [Scheduled Employee],
    SUM(CASE WHEN UPPER(S.Status) = 'ALLOCATIONREQUESTED' THEN 1 ELSE 0 END) AS [AllocationRequested Employee],
    SUM(CASE WHEN UPPER(S.Status) = 'DROPPED' THEN 1 ELSE 0 END) AS [Dropped Employee],
	Count(O.RrId) AS [Total Employee],
	STRING_AGG(o.Comments,',') AS [Reason For Reject]
FROM
    RR_ResourceRequests R (NOLOCK)
    INNER JOIN ProjectMaster pm (NOLOCK) ON r.ProjectId = pm.ProjId
    INNER JOIN RR_RequestStatusMaster rrm (NOLOCK) ON r.StatusId = rrm.StatusId
    LEFT JOIN EmployeeOpportunity O (NOLOCK) ON O.RrId = R.Id
    LEFT JOIN EmployeeOpportunityStatus S (NOLOCK) ON O.StatusId = S.Id
	LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = r.CityId
	LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = r.CityId
    LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = r.CityId
	LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = r.CityId
WHERE
    rrm.RRStatus = 'Open'
    AND rrm.IsActive = 1
    AND CAST(O.CreatedOn AS DATE) BETWEEN CAST(@FromDate AS DATE) AND CAST(@ToDate AS DATE)
GROUP BY
    R.RRNumber,
    pm.ProjName,
    r.Role,
    r.RLSTechnology,
	r.Location,
    r.WorkLocation,
    r.YearsOfExp,
    r.StartDate,
	IC.CityName,
	UC.CityName,
	UKC.CityName,
	CMT.CityName
END

GO

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Withdraw Requested' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Withdraw Requested'
End

IF NOT EXISTS (SELECT id FROM EmployeeOpportunityStatus WHERE [Status] = 'AllocationRequested' )
INSERT INTO EmployeeOpportunityStatus ([Status])
SELECT 'AllocationRequested'
END
 
IF NOT EXISTS (SELECT id from EmployeeOpportunityStatus where [Status] = 'Dropped' )
insert into EmployeeOpportunityStatus ([Status])
SELECT 'Dropped'
END

GO

CREATE OR ALTER PROCEDURE[dbo].[Update_Employee_WriteUp_Bridge]  
@EmployeeId NVARCHAR(100), 
@EmployeeWriteup NVARCHAR(MAX)
AS       
BEGIN    
UPDATE EmployeeMaster    
SET EmpShortWriteUp = @EmployeeWriteup   
WHERE EmpeMidsID = @EmployeeId 
END

GO

CREATE OR ALTER PROCEDURE [dbo].[Upsert_EmployeeOpportunity_Bridge]
(
    @EmployeeId NVARCHAR(255),
    @RrId INT,
    @Status NVARCHAR(50),
    @ScheduledDate DATETIME = null,
    @Comments NVARCHAR(max) = null
)
AS
BEGIN
	DECLARE @Statusid int;
    SELECT @StatusId = id
    FROM EmployeeOpportunityStatus
    WHERE [Status] = @Status;
    IF EXISTS (SELECT 1 FROM EmployeeOpportunity WHERE EmployeeId = @EmployeeId AND RrId = @RrId)
    BEGIN
		IF @ScheduledDate is null or @ScheduledDate =''
		BEGIN
			UPDATE EmployeeOpportunity
			SET StatusId = @StatusId, Comments = @Comments, ModifiedOn = GETDATE()
			WHERE EmployeeId = @EmployeeId AND RrId = @RrId;
		END
		ELSE
		BEGIN
			UPDATE EmployeeOpportunity
			SET StatusId = @StatusId, Comments = @Comments, ScheduledDate = @ScheduledDate, ModifiedOn = GETDATE()
			WHERE EmployeeId = @EmployeeId AND RrId = @RrId;
		END
    END
    ELSE
    BEGIN
        INSERT INTO EmployeeOpportunity (EmployeeId, RrId, CreatedOn, StatusId, Comments, ScheduledDate)
        VALUES (@EmployeeId, @RrId, GETDATE(), @StatusId, @Comments, @ScheduledDate);
    END
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetResourceAllocationDetails]
AS
BEGIN
    SELECT DISTINCT 
		EO.EmployeeId,
		rr.RRNumber   As RRNumber,
		pm.ProjName	  As ProjectName,
		E.CommonName AS EmployeeName,
        RR.Location   As Location,
		ISNULL(RR.RLSTechnology, '')   AS MusttoHaveSkill,
		ISNULL(RR.SecondarySkills, '') AS SecondarySkills,
		ISNULL(RR.NicetoHaveSkill, '') AS NicetoHaveSkill,
		EO.AllocationPercentage,
		ISNULL(EO.AllocationStartDate, NULL) AS AllocationStartDate,
		RA.WFMSpoc,
		Em.CommonName AS RequesterName,
		ISNULL(EO.WfmAllocationPercentage, '') AS WfmAllocationPercentage,
		ISNULL(EO.WfmAllocationStartDate, NULL) AS WfmAllocationStartDate,
		EO.AdditionalComments,
		RR.Requester as RequesterID,
		Case When RR.Location='US' Then (CASE WHEN WorkLocation IS NOT NULL OR WorkLocation!='' then WorkLocation ELSE UC.CityName END)    
			 When RR.Location='INDIA' Then (CASE WHEN WorkLocation IS NOT NULL OR WorkLocation!='' then WorkLocation ELSE IC.CityName END) 
			 When RR.Location='UK'   Then (CASE WHEN WorkLocation IS NOT NULL OR WorkLocation!='' then WorkLocation ELSE UKC.CityName END) 
			 ELSE CMT.CityName END AS CityName,
		 EO.RrId
    FROM EmployeeOpportunity EO
		LEFT JOIN Employeemaster E ON EO.EmployeeId = E.EmpEmidsId
		LEFT JOIN RR_ResourceRequests RR ON EO.RrId = RR.Id
		LEFT JOIN ProjectMaster PM ON RR.ProjectId = PM.ProjId
		LEFT JOIN ResourceAvailability RA ON EO.EmployeeId = RA.EmployeeId
		LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = RR.CityId 
		LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = RR.CityId    
        LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = RR.CityId 
		LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = RR.CityId
		LEFT JOIN Employeemaster EM ON RR.Requester = EM.EmpEmidsId
		LEFT JOIN EmployeeOpportunityStatus EOS ON EO.StatusId = EOS.Id
    WHERE EOS.Status IN ('AllocationRequested')
END

GO
CREATE OR ALTER PROCEDURE [dbo].[GetAllLaunchpadEmployees]
    @EmployeeId varchar(100) Null,
    @LoginName varchar(100) Null
AS
BEGIN	     
    SELECT distinct
        E1.CommonName as [Employee Name],
        E1.EmpEmidsId as [Employee ID],
        E1.EmpAdSUserAcct +'@emids.com' as  EmpMailId,
        E1.EmpPersonalCellNo as [Telephone Mobile],
        ISNULL(d.Designation, '') as [Designation],
        ISNULL(E1.EmpManager, '') as [Reporting Manger Emp ID],
        ISNULL(E2.CommonName, '') as [Reporting Manager Name],
        ISNULL(E1.EmpLocation, '') as [Business Location],
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US, e1.EmpeMidsID), '') as [Business City],
        ISNULL(cast(E1.EmpExperience as float), 0.0) as [Past Experience],
        Case
            when
            (
                Year(E1.LastWorkingDate) = 1900
                or E1.LastWorkingDate IS NULL
            ) then
                ISNULL(cast(datediff(mm, E1.EmpDateofJoin, getdate()) as float), 0.0)
            else
                ISNULL(cast(datediff(mm, E1.EmpDateofJoin, E1.LastWorkingDate) as float), 0.0)
        end as [eMids Experience],
        case
            when E1.EmpGender = 'M' then
                'Male'
            When E1.EmpGender = 'F' then
                'Female'
            When E1.EmpGender = 'O' then
                'Other'
            else
                ''
        end as [Gender],
        ISNULL(
        (
            select dbo.fn_GetProjectsForEmployee(e1.EmpeMidsID)
        ),
        ''
              ) as [Project Name],
        ISNULL(
        (
            select [dbo].[fn_GetAccountForEmpId](e1.EmpeMidsID)
        ),
        ''
              ) as [Account Name],
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US, e1.EmpeMidsID), '') as WorkingCity,
        ISNULL(ER.Role, '') AS EmployeeRole,
        ISNULL(ER.PrimarySkill, '') AS PrimarySkill,
        ISNULL(ER.SecondarySkill, '') AS SecondarySkill,
        ISNULL(ra.WFMSpoc, '') AS WFMSpoc,
        ISNULL(ra.EffectiveTill, null) As EffectiveTill,
        ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,
        'AbsoultePath + EmpID' as Photo,
        E1.EmpShortWriteUp as 'EmployeeWriteup',
        E1.EmpAdSUserAcct,
        rs.AssignDate,
        rs.ReleaseDate,
        DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS Aging,	
		(Select Top 1 RR.RRNumber from EmployeeOpportunity  EOO  
		LEFT JOIN RR_ResourceRequests RR ON EOO.RrId = RR.Id
		LEFT JOIN EmployeeOpportunityStatus EOOS ON EOO.StatusId = EOOS.Id 
		WHERE  EOOS.Status = 'Earmarked'  
          AND EOO.EmployeeId = e1.EmpeMidsID      ORDER BY   EOO.ModifiedOn       DESC                
          ) AS RRNumber,

		(Select Top 1 RR.Id from EmployeeOpportunity  EOO  
		LEFT JOIN RR_ResourceRequests RR ON EOO.RrId = RR.Id
		LEFT JOIN EmployeeOpportunityStatus EOOS ON EOO.StatusId = EOOS.Id 
		WHERE  EOOS.Status = 'Earmarked'  
          AND EOO.EmployeeId = e1.EmpeMidsID     ORDER BY   EOO.ModifiedOn       DESC           
          ) AS RRId
		  
    from Employeemaster e1
        LEFT JOIN Employeemaster e2
            on e1.EmpManager = e2.EmpEmidsid
        left join FunctionMaster FM
            ON ISNULL(e1.EmpFunction, 0) = FM.FunctionId
               AND FM.IsActive = 1
        left join Designation d
            on E1.empdesignation = d.designationid
        left join Designation d1
            on E2.empdesignation = d1.designationid
        left join DeptMaster Dept
            on Dept.DeptId = E1.EmpDepartment
        left join Practiceareamaster p
            on E1.primarypracticearea = p.practiceareaid
        left join ResourceAssign RS
            on RS.EmpeMidsID = e1.EmpeMidsID
               and RS.ReleaseDate >= GETDATE()
               and ISDuplicate != 1
        left join ProjectMaster PM
            On RS.ProjId = PM.ProjId
        left join CustomerMaster CM
            On CM.CustomerID = PM.CustomerId
        left join MasterCustomer MC
            On MC.MastCustId = CM.MastCustId
        left join EmployeeRole ER
            on E1.EmpeMidsID = ER.EmpeMidsID
        left join ResourceAvailability ra
            on E1.EmpeMidsID = ra.EmployeeId
        left join ResourceAvailabilityStatus ras
            on ra.AvailableStatusID = ras.Id
		--left join CTERRNumber CT ON CT.EmployeeId=ER.EmpeMidsID
    where e1.isactive = 1
          AND (
                  @EmployeeId = '-1'
                  or E1.EmpeMidsID = @EmployeeId
              )
          AND (
                  @LoginName = '-1'
                  or E1.EmpAdSUserAcct = @LoginName
              )
          AND CM.CustomerId In (74, 553, 554, 555)
          and PM.IsActive = 1
    order by E1.commonname;		  
END

GO
CREATE OR ALTER PROCEDURE [dbo].[GetEmployeeDetails_For_WFM]
    @EmployeeId varchar(100) Null,
    @LoginName varchar(100) Null
AS
BEGIN
    SELECT distinct
        E1.CommonName as [Employee Name],
        E1.EmpEmidsId as [Employee ID],
        E1.EmpAdSUserAcct +'@emids.com' as  EmpMailId,
        E1.EmpPersonalCellNo as [Telephone Mobile],
        ISNULL(d.Designation, '') as [Designation],
        ISNULL(E1.EmpManager, '') as [Reporting Manger Emp ID],
        ISNULL(E2.CommonName, '') as [Reporting Manager Name],
        ISNULL(E1.EmpLocation, '') as [Business Location],
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US, e1.EmpeMidsID), '') as [Business City],
        ISNULL(cast(E1.EmpExperience as float), 0.0) as [Past Experience],
        Case
            when
            (
                Year(E1.LastWorkingDate) = 1900
                or E1.LastWorkingDate IS NULL
            ) then
                ISNULL(cast(datediff(mm, E1.EmpDateofJoin, getdate()) as float), 0.0)
            else
                ISNULL(cast(datediff(mm, E1.EmpDateofJoin, E1.LastWorkingDate) as float), 0.0)
        end as [eMids Experience],
        case
            when E1.EmpGender = 'M' then
                'Male'
            When E1.EmpGender = 'F' then
                'Female'
            When E1.EmpGender = 'O' then
                'Other'
            else
                ''
        end as [Gender],
        ISNULL(
        (
            select dbo.fn_GetProjectsForEmployee(e1.EmpeMidsID)
        ),
        ''
              ) as [Project Name],
        ISNULL(
        (
            select [dbo].[fn_GetAccountForEmpId](e1.EmpeMidsID)
        ),
        ''
              ) as [Account Name],
        isnull(dbo.Get_USWorkingCityName(E1.WorkingCity_US, e1.EmpeMidsID), '') as WorkingCity,
        ISNULL(ER.Role, '') AS EmployeeRole,
        ISNULL(ER.PrimarySkill, '') AS PrimarySkill,
        ISNULL(ER.SecondarySkill, '') AS SecondarySkill,
        'AbsoultePath + EmpID' as Photo,
        emw.EmployeeWriteup as 'EmployeeWriteup',
        E1.EmpAdSUserAcct,
        ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus
    from employeemaster e1
        LEFT JOIN employeemaster e2
            on e1.EmpManager = e2.EmpEmidsid
        left join FunctionMaster FM
            ON ISNULL(e1.EmpFunction, 0) = FM.FunctionId
               AND FM.IsActive = 1
        left join designation d
            on E1.empdesignation = d.designationid
        left join designation d1
            on E2.empdesignation = d1.designationid
        left join DeptMaster Dept
            on Dept.DeptId = E1.EmpDepartment
        left join practiceareamaster p
            on E1.primarypracticearea = p.practiceareaid
        left join ResourceAssign RS
            on RS.EmpeMidsID = e1.EmpeMidsID
               and RS.ReleaseDate >= GETDATE()
               and ISDuplicate != 1
        left join ProjectMaster PM
            On e1.ProficiencyCOE = PM.ProjId
        left join CustomerMaster CM
            On CM.CustomerID = PM.CustomerId
        left join MasterCustomer MC
            On MC.MastCustId = CM.MastCustId
               And MC.IsProficiency = 1
        left join EmployeeRole ER
            on E1.EmpeMidsID = ER.EmpeMidsID
        left join EmployeeMaster_WFM emw
            on E1.EmpeMidsID = emw.EmployeeId
        left join ResourceAvailability ra
            on E1.EmpeMidsID = ra.EmployeeId
        left join ResourceAvailabilityStatus ras
            on ra.AvailableStatusID = ras.Id
    where e1.isactive = 1
          AND (
                  @EmployeeId = '-1'
                  or E1.EmpeMidsID = @EmployeeId
              )
          AND (
                  @LoginName = '-1'
                  or E1.EmpAdSUserAcct = @LoginName
              )
    order by E1.commonname

END

GO
CREATE OR ALTER PROCEDURE [dbo].[GetLaunchpadEmployeeDetails_For_WFM]  --'-1', '-1'  
	@EmployeeId varchar(100) Null,
	@LoginName varchar(100) Null,
	@IsEarmarkedRequired bit = 0
AS
BEGIN
Select ActiveLaunchpad.* FROM(
	SELECT distinct E1.CommonName as [Employee Name],                                                        
	E1.EmpEmidsId as [Employee ID],                                                        
	E1.EmpAdSUserAcct +'@emids.com' as  EmpMailId,
	E1.EmpPersonalCellNo as [Telephone Mobile],
	ISNULL(d.Designation,'') as [Designation],                                                        
	ISNULL(E1.EmpManager,'') as [Reporting Manger Emp ID],                                                        
	ISNULL(E2.CommonName,'') as [Reporting Manager Name],                                       
	ISNULL(E1.EmpLocation,'') as [Business Location],                                                  
	ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as [Business City],                  
	ISNULL(cast(E1.EmpExperience as float),0.0) as [Past Experience], 
	Case when (Year(E1.LastWorkingDate)=1900 or E1.LastWorkingDate IS NULL) then ISNULL(cast(datediff(mm,E1.EmpDateofJoin,getdate()) as float),0.0)   
		else ISNULL(cast(datediff(mm,E1.EmpDateofJoin,E1.LastWorkingDate) as float),0.0) end as [eMids Experience],                                             
	case when E1.EmpGender='M' then 'Male' When E1.EmpGender='F' then 'Female' When E1.EmpGender='O' then 'Other' else ''  end as [Gender],                
	ISNULL((select dbo.fn_GetProjectsForEmployee(e1.EmpeMidsID)),'') as [Project Name],                                  
	ISNULL((select[dbo].[fn_GetAccountForEmpId](e1.EmpeMidsID)),'') as [Account Name],                            
	ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as WorkingCity,                  
	ISNULL(ER.Role,'') AS EmployeeRole,
	ISNULL(ER.PrimarySkill,'') AS PrimarySkill,
	ISNULL(ER.SecondarySkill,'') AS SecondarySkill,
	ISNULL(ra.WFMSpoc, '') AS WFMSpoc,
	ISNULL(ra.EffectiveTill, '') As EffectiveTill ,
	ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,
	'AbsoultePath + EmpID' as Photo,
	E1.EmpShortWriteUp as 'EmployeeWriteup',
	E1.EmpAdSUserAcct, rs.AssignDate, rs.ReleaseDate,DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS Aging
    FROM Employeemaster e1
    LEFT JOIN Employeemaster e2 on e1.EmpManager=e2.EmpEmidsid                                
    LEFT JOIN FunctionMaster FM ON ISNULL(e1.EmpFunction , 0) = FM.FunctionId AND FM.IsActive = 1                            
    LEFT JOIN Designation d on E1.empdesignation=d.designationid                                                         
    LEFT JOIN Designation d1 on E2.empdesignation=d1.designationid                       
    LEFT JOIN DeptMaster Dept on Dept.DeptId=E1.EmpDepartment                                                  
    LEFT JOIN Practiceareamaster p on E1.primarypracticearea=p.practiceareaid                                                         
    LEFT JOIN ResourceAssign RS on RS.EmpeMidsID = e1.EmpeMidsID and RS.ReleaseDate >= GETDATE() and ISDuplicate != 1                 
    LEFT JOIN ProjectMaster PM On RS.ProjId = PM.ProjId                
    LEFT JOIN CustomerMaster CM On CM.CustomerID = PM.CustomerId                
    LEFT JOIN MasterCustomer MC On MC.MastCustId = CM.MastCustId 
    LEFT JOIN EmployeeRole ER on E1.EmpeMidsID = ER.EmpeMidsID
	LEFT JOIN ResourceAvailability ra on E1.EmpeMidsID = ra.EmployeeId
	LEFT JOIN ResourceAvailabilityStatus ras on ra.AvailableStatusID = ras.Id
    WHERE e1.isactive = 1                                           
	AND (@EmployeeId='-1' or E1.EmpeMidsID = @EmployeeId) 
	AND (@LoginName ='-1' or E1.EmpAdSUserAcct = @LoginName) 
	AND CM.CustomerId In (74, 553, 554, 555) and PM.IsActive = 1
	AND pm.ProjName not like '%Un-available Pool%' 
	) ActiveLaunchpad
	Where (
	( @IsEarmarkedRequired = 1 AND (ActiveLaunchpad.AvailableStatus = 'AVAILABLE' OR ActiveLaunchpad.AvailableStatus = 'Earmarked'))
	OR
	( @IsEarmarkedRequired = 0 AND ActiveLaunchpad.AvailableStatus = 'AVAILABLE')
	)
END

GO
CREATE OR ALTER PROCEDURE [dbo].[USP_GetResourceRequestDetailsByID] @ResourceRequestId INT
AS
BEGIN
    Select Distinct
        r.Id,
        r.StartDate,
        pm.ProjName,
        r.YearsOfExp,
        pm.Allocation1,
        r.WorkLocation,
        r.MusttoHaveSkill,
        r.JobTitle,
        r.Requester,
        emp.EmpAdSUserAcct +'@emids.com' as RequesterMailID,
        emp.CommonName as RequesterName,
        pma.EmpeMidsID as ProjectManagerId,
        empl.EmpAdSUserAcct +'@emids.com' as ProjectManagerMailID,
        empl.CommonName as ProjectManagerName,
        r.Role,
        r.SecondarySkills,
        r.ProjectOverview,
        r.RoleOverview,
        r.RolesAndResponsibilities,
        r.ClosureDate,
        r.RRNumber,
        r.RLSTechnology,
        r.Requester AS RequesterId,
        r.ProjectDuration,
        r.CityId,
        Case
            When R.Location = 'US' Then
        (CASE
             WHEN WorkLocation is not null
                  or WorkLocation != '' then
                 WorkLocation
             ELSE
                 UC.CityName
         END
        )
            When R.Location = 'INDIA' Then
        (CASE
             WHEN WorkLocation is not null
                  or WorkLocation != '' then
                 WorkLocation
             ELSE
                 IC.CityName
         END
        )
            When R.Location = 'UK' Then
        (CASE
             WHEN WorkLocation is not null
                  or WorkLocation != '' then
                 WorkLocation
             ELSE
                 UKC.CityName
         END
        )
            ELSE
                CMT.CityName
        END AS CityName,
        r.Location
    FROM RR_ResourceRequests (Nolock) r
        INNER Join ProjectMaster (Nolock) pm
            on r.ProjectId = pm.ProjId
        LEFT JOIN ProjectmasterAccess PMA
            ON PMA.ProjID = Pm.ProjId
               AND PMA.RoleID = 1 AND (PMA.Enddate >= Getdate() OR Year(PMA.EndDate) = 1900)
        LEFT JOIN Tbl_INDIACitiesMaster (Nolock) IC
            ON IC.ID = r.CityId
        LEFT JOIN Tbl_USCitiesMaster (Nolock) UC
            ON UC.ID = r.CityId
        LEFT JOIN Tbl_UKCitiesMaster (Nolock) UKC
            ON UKC.ID = r.CityId
        LEFT JOIN tbl_CityMaster (Nolock) CMT
            ON CMT.ID = r.CityId
        LEFT JOIN Employeemaster (NoLock) emp
            on r.Requester = emp.EmpeMidsID
        LEFT JOIN Employeemaster (NoLock) empl
            on pma.EmpeMidsID = empl.EmpeMidsID
    Where r.Id = @ResourceRequestId

END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetAppliedCountForRRIds]
    @RrIdList NVARCHAR(MAX)
AS
BEGIN
	DECLARE @sql_xml XML = Cast('<root><U>'+ Replace(@RrIdList, ',', '</U><U>')+ '</U></root>' AS XML)
	SELECT f.x.value('.', 'BIGINT') AS RRId
	INTO #RRList
	FROM @sql_xml.nodes('/root/U') f(x)
 
	DECLARE @WfmLaunchpadtbl TABLE([Employee Name] nvarchar(max),[Employee ID] nvarchar(max),[EmpMailId] nvarchar(max),[Telephone Mobile] nvarchar(max),[Designation] nvarchar(max),
	[Reporting Manger Emp ID] nvarchar(max),[Reporting Manager Name] nvarchar(max),[Business Location] nvarchar(max),[Business City] nvarchar(max),[Past Experience] nvarchar(max),
	[eMids Experience] nvarchar(max),[Gender] nvarchar(max),[Project Name] nvarchar(max),[Account Name] nvarchar(max),[WorkingCity] nvarchar(max),[EmployeeRole] nvarchar(max),[PrimarySkill] nvarchar(max),[SecondarySkill] 
	nvarchar(max),[WFMSpoc] nvarchar(max),[EffectiveTill] nvarchar(max),[AvailableStatus] nvarchar(max),[Photo] nvarchar(max),[EmployeeWriteup] nvarchar(max)
	,[EmpAdSUserAcct] nvarchar(max),[AssignDate] nvarchar(max),[ReleaseDate] nvarchar(max),Aging int);
	INSERT INTO @WfmLaunchpadtbl
	EXEC GetLaunchpadEmployeeDetails_For_WFM '-1','-1', 1;
	SELECT O.RrId, COUNT(O.RrId) AS AppliedResourceRequestIdCount
	FROM EmployeeOpportunity (NOLOCK) O
	INNER JOIN #RRList R On O.RrId = R.RRId
	INNER JOIN @WfmLaunchpadtbl E On E.[Employee ID] = O.EmployeeId
	GROUP BY O.RrId
END