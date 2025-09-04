GO
CREATE OR ALTER PROCEDURE [dbo].[USP_GetActiveRRsProjectDetails]
AS
BEGIN
    SELECT 
        rr.ProjectId
        ,MAX(pm.ProjName) AS ProjectName
        ,count(RRNUmber) AS ProjectRRCount
    FROM RR_ResourceRequests (Nolock) rr
		INNER JOIN ProjectMaster (Nolock) pm ON rr.ProjectId = pm.projid
		INNER Join RR_RequestStatusMaster(Nolock) rrm on rr.StatusId = rrm.StatusId 
    WHERE rrm.RRStatus = 'Open' And rrm.IsActive = 1
    GROUP BY rr.ProjectId, pm.projname
	ORDER BY pm.ProjName
END

GO
 
CREATE OR ALTER   PROCEDURE [dbo].[Upsert_ResourceRequestsComments]
(
	@RrID int,
    
    @RRComment NVARCHAR(max) = null,
    @WFMCreatedDate DATETIME = null,
    @WFMCreatedBy NVARCHAR(max) = null
)
AS
BEGIN
        INSERT INTO [dbo].[RR_ResourceRequestsComments]  (RRID, RRComment, WFMCreatedDate, WFMCreatedBy)
        VALUES (@RrID, @RRComment, GETDATE(), @WFMCreatedBy);

 
	/* Make an entry to RR_ResourceRequestsCommentsLog table */
	INSERT INTO [dbo].[RR_ResourceRequestsCommentsLog] (RRID, RRComment, WFMCreatedDate, WFMCreatedBy)
	SELECT RRID, 
	 RRComment, WFMCreatedDate, WFMCreatedBy
	FROM RR_ResourceRequestsCommentsLog (NOLOCK)
	WHERE RRID = @RrID
END
 

  GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GET_ResourceRequestsComments]
(
    @RRID NVARCHAR(25)
)
AS
BEGIN
Select  RR.RRNumber, RC.* from [dbo].[RR_ResourceRequestsComments] RC
INNER JOIN [dbo].[RR_ResourceRequests] RR ON  RC.RRID=RR.Id
  


where RRID=@RRID 

ORDER BY [WFMCreatedDate] ASC
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
		ISNULL(RR.RLSTechnology, '') AS MusttoHaveSkill,
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
		 EO.RrId,
		 RR.CreatedDate as RRCreatedDate,
		 RS.Allocation As AvailableAllocationPercentage
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
		LEFT JOIN ResourceAssign RS ON RS.EmpeMidsID = E.EmpeMidsID AND RS.ReleaseDate >= GETDATE() AND ISDuplicate != 1
    WHERE EOS.Status IN ('AllocationRequested')
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetEarMarkedRRId]
AS
BEGIN
   SELECT RrId as ResourceRequestId 
   FROM EmployeeOpportunity(Nolock) EO 
   LEFT JOIN EmployeeOpportunitystatus EOS on EO.StatusId = EOS.Id 
   WHERE EOS.Status = 'Earmarked'
END
GO


CREATE OR ALTER PROCEDURE [dbo].[USP_GetRRIdsForAppliedAndEarMarked]
   @EmployeeId VARCHAR(100) Null
	AS
BEGIN
    SELECT RrId AS ResourceRequestId 
	FROM EmployeeOpportunity(Nolock) EO  
	LEFT JOIN EmployeeOpportunitystatus EOS on EO.StatusId = EOS.Id 
	WHERE EmployeeId = @EmployeeId OR EOS.Status = 'Earmarked' 
END
GO

CREATE OR ALTER   PROCEDURE [dbo].[Upsert_EmployeeOpportunity_Bridge]
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

        INSERT INTO EmployeeOpportunity (EmployeeId, RrId, CreatedOn, StatusId, Comments)

        VALUES (@EmployeeId, @RrId, GETDATE(), @StatusId, @Comments);

    END
 
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */

	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus)

	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus FROM EMPLOYEEOPPORTUNITY (NOLOCK)

	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID

END
GO
CREATE OR ALTER PROCEDURE [dbo].[USP_INSERT_EMPLOYEEOPPORTUNITY_ACTIVE]
(
	@EMPLOYEEID NVARCHAR(25)
	,@RRID	INT
	,@STATUSID INT
	,@CREATEDBY Nvarchar(100) =''
)
AS
BEGIN
 
	INSERT INTO EMPLOYEEOPPORTUNITY (EMPLOYEEID, RRID, CREATEDON, STATUSID,CreatedBy) VALUES (@EMPLOYEEID, @RRID,  GETDATE(), @STATUSID,@CREATEDBY)
 
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID;
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_UPDATE_EMPLOYEEOPPORTUNITY_ACTIVE]
(
	@ID INT
	,@STATUSID INT
)
AS
BEGIN
 
	UPDATE EMPLOYEEOPPORTUNITY SET DISAPPROVEDBY = '', STATUSID = @STATUSID, MODIFIEDON = GETDATE() WHERE ID = @ID
 
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE ID = @ID
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW]
(
	@EMPLOYEEID NVARCHAR(25)
	,@RRID	INT
	,@DISAPPROVEDBY NVARCHAR(100)
	,@COMMENTS NVARCHAR(MAX)
	,@STATUSID INT
	,@ADDITIONALCOMMENTS  NVARCHAR(500)
)
AS
BEGIN
 
	UPDATE EMPLOYEEOPPORTUNITY SET MODIFIEDON = GETDATE(), DISAPPROVEDBY = @DISAPPROVEDBY, COMMENTS = @COMMENTS, STATUSID = @STATUSID, ADDITIONALCOMMENTS = @ADDITIONALCOMMENTS WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID
 
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, IsRampUpProject, RRStatus FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID
END
GO
 

CREATE OR ALTER PROCEDURE [dbo].[Approve_EmployeeOpportunity]
(
    @EmployeeId NVARCHAR(25),
    @RrId INT,
    @StatusId INT,
    @AllocationPercentage INT,
	@AllocationStartDate DATETIME,
    @AdditionalComments NVARCHAR(max),
	@WfmAllocationPercentage INT = NULL,
	@WfmAllocationStartDate DATETIME  = NULL,
	@RequesterID NVARCHAR(25),
	@IsRampUpProject bit = 0
)
AS
BEGIN
	DECLARE @EmpRecordExists int;
	SELECT @EmpRecordExists  = count(*) FROM EmployeeOpportunity WHERE employeeid = @EmployeeId AND RrId = @RrId;
    IF @EmpRecordExists  > 0  
	BEGIN
		UPDATE EmployeeOpportunity
		SET StatusId = @StatusId, AdditionalComments = @AdditionalComments, AllocationPercentage = @AllocationPercentage, AllocationStartDate = @AllocationStartDate, ModifiedOn = GETDATE(), 
		WfmAllocationPercentage = @WfmAllocationPercentage, WfmAllocationStartDate = @WfmAllocationStartDate, ManagerId = @RequesterID, IsRampUpProject = @IsRampUpProject
		WHERE EmployeeId = @EmployeeId AND RrId = @RrId;
	END
	ELSE
	BEGIN
		INSERT INTO EmployeeOpportunity (EmployeeId, RrId, StatusId, AllocationPercentage, AllocationStartDate, AdditionalComments, WfmAllocationPercentage, WfmAllocationStartDate, ManagerId, CreatedOn, IsRampUpProject)
		VALUES (@EmployeeId, @RrId, @StatusId, @AllocationPercentage, @AllocationStartDate, @AdditionalComments, @WfmAllocationPercentage, @WfmAllocationStartDate, @RequesterID, GETDATE(), @IsRampUpProject)
	END

	DECLARE @RecordExists int;
	IF @StatusId = 7
	BEGIN

	UPDATE EmployeeOpportunity
	SET RRStatus = 1
	WHERE RrId = @RrId

	select @RecordExists = count(*) FROM resourceavailability WHERE employeeid = @EmployeeId;
    IF @RecordExists > 0  
	BEGIN
	UPDATE ResourceAvailability
	SET  AvailableStatusID= 4, EffectiveTill = @WfmAllocationStartDate, WFMEmployeeId = @RequesterID
	WHERE EmployeeId = @EmployeeId
	END
	ELSE
	BEGIN
	INSERT INTO [dbo].[ResourceAvailability]
           ([EmployeeId]
           ,[EffectiveTill]
           ,[WFMSpoc]
           ,[ModifiedOn]
           ,[AvailableStatusID]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedBy]
           ,[WFMEmployeeId]
           ,[ManagerApproveOrWithdrawDate]
           ,[ReleaseReason]
           ,[InformedEmployee]
           ,[WfmSuggestedDate]
           ,[EmployeeSummary]
           ,[ManagerSummary]
           ,[ManagerId])
     VALUES
           (@EmployeeId
           ,@WfmAllocationStartDate
           ,null
           ,null
           ,4
           ,null
           ,null
           ,null
           ,null
           ,null
           ,null
           ,null
           ,null
           ,null
           ,null
           ,null
		   )	
	END
	END
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, MANAGERID, WFMALLOCATIONSTARTDATE, WFMALLOCATIONPERCENTAGE, IsRampUpProject, RRStatus)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, MANAGERID, WFMALLOCATIONSTARTDATE, WFMALLOCATIONPERCENTAGE, IsRampUpProject, RRStatus FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID;

END
GO
 
 CREATE OR ALTER     PROCEDURE [dbo].[UpsertResourceAvailability] (
@EmployeeId NVARCHAR(25),
@AvailableStatus                                                  NVARCHAR(50)= null,
@EffectiveTill                                                    datetime  = null,
@WFMSpoc                                                          NVARCHAR(40)  = null, 
@CreatedBy                                                        NVARCHAR(40)  = null, 
@ModifiedBy                                                       NVARCHAR(40)  = null, 
@WFMEmployeeId                                                    NVARCHAR(40)  = null, 
@ManagerApproveOrWithdrawDate 									  datetime  = null,
@ReleaseReason 													  NVARCHAR(300) NULL,
@InformedEmployee  												  NVARCHAR(40) NULL,
@WfmSuggestedDate 									              datetime  = null,
@ManagerId														  NVARCHAR(25) = null,
@WfmRejectComment												  NVARCHAR(300) = null,
@Comments												          NVARCHAR(300) = null
)
AS
  BEGIN
    SET NOCOUNT ON;
    SET NOCOUNT ON;
	 
    DECLARE @Statusid int;
    SELECT @StatusId = id
    FROM   resourceavailabilitystatus
    WHERE  availablestatus = @AvailableStatus;

    DECLARE @RecordExists int;
    SELECT @RecordExists = count(*)
    FROM   resourceavailability (NOLOCK)
    WHERE  employeeid = @EmployeeId;

	DECLARE @EmpEarMarkRecordId int;
    SELECT @EmpEarMarkRecordId = E.Id 
    FROM   EmployeeOpportunity (NOLOCK) E
	INNER JOIN EmployeeOpportunityStatus S on E.StatusId = s.Id
    WHERE  employeeid = @EmployeeId and S.[Status] = 'Earmarked';
 
	IF @AvailableStatus = 'Available' AND @EmpEarMarkRecordId > 0
	BEGIN
 
	UPDATE EmployeeOpportunity
	SET StatusId =  (SELECT Id FROM EmployeeOpportunityStatus (NOLOCK) WHERE [Status] = 'Active')
	WHERE Id = @EmpEarMarkRecordId
	END
    
    IF @RecordExists > 0
    BEGIN
 
      UPDATE resourceavailability
      SET    availablestatusid = @StatusId,
             effectivetill = @EffectiveTill,
             wfmspoc = @WFMSpoc,
             modifiedon = getdate(),
			 ModifiedBy=@ModifiedBy,
			 WFMEmployeeId=@WFMEmployeeId,
			 ManagerApproveOrWithdrawDate=@ManagerApproveOrWithdrawDate,
			 ReleaseReason=@ReleaseReason,
			 InformedEmployee=@InformedEmployee,
			 WfmSuggestedDate=@WfmSuggestedDate,
             ManagerId=@ManagerId,
			 WfmRejectComment=@WfmRejectComment,
			 Comments=@Comments
      WHERE  employeeid = @Employeeid;   
     
    END
    ELSE
    BEGIN
      INSERT INTO resourceavailability
                  (
                              employeeid,
                              availablestatusid,
                              effectivetill,
                              wfmspoc,
                              CreatedOn,
							  CreatedBy,
							  WFMEmployeeId,
							  ManagerApproveOrWithdrawDate,
							  ReleaseReason,
							  InformedEmployee,
							  WfmSuggestedDate,
                              ManagerId ,
							  WfmRejectComment,
							  Comments
                  )
                  VALUES
                  (
                              @EmployeeId,
                              @StatusId,
                              @EffectiveTill,
                              @WFMSpoc,
                              getdate(),
							  @CreatedBy,
							  @WFMEmployeeId,
							  @ManagerApproveOrWithdrawDate,
							  @ReleaseReason,
							  @InformedEmployee,
							  @WfmSuggestedDate,
                              @ManagerId,
							  @WfmRejectComment,
							  @Comments
                  );      
    END
 
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE ID = @EmpEarMarkRecordId

	INSERT INTO RESOURCEAVAILABILITYLOG (employeeid, availablestatusid, effectivetill, wfmspoc, CreatedOn, CreatedBy, WFMEmployeeId, ManagerApproveOrWithdrawDate, ReleaseReason, InformedEmployee, WfmSuggestedDate, ManagerId,WfmRejectComment,Comments ) 
	SELECT  EmployeeId, AvailableStatusID, EffectiveTill, WFMSpoc, getdate(), CreatedBy, WFMEmployeeId, ManagerApproveOrWithdrawDate, ReleaseReason, InformedEmployee, WfmSuggestedDate, ManagerId,WfmRejectComment,Comments FROM ResourceAvailabilityLog (NOLOCK)
	WHERE EmployeeId = @EmployeeId

  END

   
 GO
  
GO
CREATE OR ALTER   PROCEDURE [dbo].[USP_GetResourcesByWFM] 
AS
BEGIN
   SELECT DISTINCT E1.CommonName as [Employee Name],                                                        
		E1.EmpEmidsId as [Employee ID],                                                        
		E1.EmpMailId,  
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
		ISNULL(ra.InformedEmployee,'False') AS InformedEmployee,
		ra.WfmRejectComment,
		ra.Comments,
		ra.CreatedOn
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
	WHERE ras.AvailableStatus in ('Release Requested', 'Withdraw Requested','Release Rejected')  
  
END

 GO


GO
CREATE OR ALTER    PROCEDURE [dbo].[USP_RRActivityAgingReport] 
AS
BEGIN
Select * From(
	SELECT EmployeeId
		,RrId
		,Active
		,Withdrawn
		,Declined
		,Scheduled
		,L2Discussion
		,AllocationRequested
		,Dropped
		,Earmarked
		,COALESCE(DATEDIFF(DAY, Active, AllocationRequested),
				DATEDIFF(DAY, Active, Dropped),
				DATEDIFF(DAY, Active, L2Discussion),
				DATEDIFF(DAY, Active, Scheduled),
				DATEDIFF(DAY, Active, Declined),
				DATEDIFF(DAY, Active, Withdrawn),
				0) AS ActivityAging
	FROM (
		SELECT EL.EmployeeId, ES.[Status], COALESCE(WfmAllocationStartDate, ScheduledDate, ModifiedOn, CreatedOn) AS UpdatedTimestamp, RRID
		FROM EmployeeOpportunityLog(NoLock) EL
		INNER JOIN EmployeeOpportunityStatus(NoLock) ES
		ON EL.StatusId = ES.Id
	) AS SourceTable
	PIVOT (
		Max(UpdatedTimestamp)
		FOR [Status] IN (Active
		,Withdrawn
		,Declined
		,Scheduled
		,L2Discussion
		,Dropped
		,AllocationRequested
		,Earmarked)
	) AS PivotTable) as V1
	Inner Join(
	SELECT
		r.Id,
		r.RRNumber AS [RR_Number],
		pm.ProjName AS [RR_ProjectName],
		r.Role AS [RR_RoleRequested],
		r.RLSTechnology AS [RR_PrimarySkills],
		Case When R.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END)
			When R.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) When R.Location='UK' Then (CASE WHEN WorkLocation is not null
			or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) ELSE CMT.CityName END AS [RR_WorkLocation],
		r.YearsOfExp AS [RR_Experience],
		r.StartDate AS [RR_PostedOn],
		r.BillingStartDate AS [RR_CCDDate],
		Emp.*
	FROM
		RR_ResourceRequests R (NOLOCK)
		INNER JOIN ProjectMaster pm (NOLOCK) ON r.ProjectId = pm.ProjId
		INNER JOIN RR_RequestStatusMaster rrm (NOLOCK) ON r.StatusId = rrm.StatusId
		INNER JOIN EmployeeOpportunity O (NOLOCK) ON O.RrId = R.Id
		INNER JOIN EmployeeOpportunityStatus S (NOLOCK) ON O.StatusId = S.Id
		LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = r.CityId
		LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = r.CityId
		LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = r.CityId
		LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = r.CityId

		LEFT JOIN (
		Select 
			E1.CommonName as [EMP_Name],
			E1.EmpEmidsId as [EMP_ID],
			ISNULL(d.Designation, '') as [EMP_Role],
			Case
				when
				( Year(E1.LastWorkingDate) = 1900 or E1.LastWorkingDate IS NULL )
				then
					ISNULL(cast(datediff(mm, E1.EmpDateofJoin, getdate()) as float), 0.0)
				else
					ISNULL(cast(datediff(mm, E1.EmpDateofJoin, E1.LastWorkingDate) as float), 0.0)
			end as [EMP_eMidsExperience],
			ISNULL(cast(E1.EmpExperience as float), 0.0) as [EMP_PastExperience],
			ISNULL((select dbo.fn_GetProjectsForEmployee(e1.EmpeMidsID)), '') as [EMP_ProjectName],
			ISNULL(ER.PrimarySkill, '') AS [EMP_PrimarySkill]
		FROM employeemaster e1
			left join FunctionMaster FM ON ISNULL(e1.EmpFunction, 0) = FM.FunctionId AND FM.IsActive = 1
			left join designation d on E1.empdesignation = d.designationid
			left join practiceareamaster p on E1.primarypracticearea = p.practiceareaid
			left join ResourceAssign RS on RS.EmpeMidsID = e1.EmpeMidsID and RS.ReleaseDate >= GETDATE() and ISDuplicate != 1
			left join ProjectMaster PM On e1.ProficiencyCOE = PM.ProjId
			left join CustomerMaster CM On CM.CustomerID = PM.CustomerId
			left join MasterCustomer MC On MC.MastCustId = CM.MastCustId And MC.IsProficiency = 1
			left join EmployeeRole ER on E1.EmpeMidsID = ER.EmpeMidsID
			left join EmployeeMaster_WFM emw on E1.EmpeMidsID = emw.EmployeeId
			left join ResourceAvailability ra on E1.EmpeMidsID = ra.EmployeeId
			left join ResourceAvailabilityStatus ras on ra.AvailableStatusID = ras.Id
			where e1.isactive = 1
		) AS Emp ON Emp.[EMP_ID] = O.EmployeeId
	WHERE
		rrm.RRStatus = 'Open'
		AND rrm.IsActive = 1
		)as V2 On V1.EmployeeId = V2.[EMP_ID] And V1.RrId = V2.Id
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetBridgeConfigSettings]
AS
BEGIN
    SELECT 
		[Name]
		,[Value]
		,IsEnabled
    FROM dbo.BridgeConfigSettings
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
        E1.EmpMailId,
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
        ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,

		ISNULL(
            (
                SELECT COUNT(*)
                FROM EmployeeOpportunity EO
                LEFT JOIN EmployeeOpportunityStatus(NOLOCK) EOS ON EO.StatusId = EOS.Id
                WHERE EOS.Status IN ('Active', 'Scheduled', 'AllocationRequested', 'L2Discussion') AND EO.EmployeeId = E1.EmpeMidsID
            ),
            0
        ) AS AplliedOpportunityCount,
		RS.allocation as AvailableAllocationPercentage,
		DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS Aging,
        ER.Studio 
    FROM employeemaster e1
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

 CREATE OR ALTER   PROCEDURE [dbo].[USP_GetProjectResources] (@EmpeMidsID NVARCHAR(50))
AS
  BEGIN
      SELECT Distinct
			 ra.empemidsid,
             E1.commonname                                AS EmployeeName,
             Isnull(d.designation, '')                    AS [Designation],
             ra.skill,
             ra.projid,
             pm.projname                                  AS ProjectName,
             ra.allocation,
             ra.assigndate,
             ra.releasedate,
             CASE
               WHEN ra.resourcetype = 0 THEN 'Billable'
               WHEN ra.resourcetype = 1 THEN 'Non-Billable'
               ELSE 'Ramp-up'
             END                                          BillingType,
             ra.isactive,
             CASE
               WHEN RAS.availablestatus = 'Release Requested' THEN RAS.availablestatus
               WHEN RAS.availablestatus = 'Released' THEN RAS.availablestatus
			   WHEN RAS.availablestatus = 'Withdraw Requested' THEN RAS.availablestatus
			   WHEN RAS.availablestatus = 'Withdrawn' THEN 'Active'
               ELSE 'Active'
             END                                          AS Status,
             Isnull(ER.role, '')                          AS EmployeeRole,
             Isnull(ER.primaryskill, '')                  AS PrimarySkill,
             Isnull(ER.secondaryskill, '')                AS SecondarySkill,
             Isnull(Cast(E1.empexperience AS FLOAT), 0.0) AS [Past Experience],
             CASE
               WHEN ( Year(E1.lastworkingdate) = 1900
                       OR E1.lastworkingdate IS NULL ) THEN Isnull(Cast(
               Datediff(mm, E1.empdateofjoin, Getdate()) AS FLOAT), 0.0
               )
               ELSE Isnull(Cast(
                    Datediff(mm, E1.empdateofjoin, E1.lastworkingdate)
                    AS
                    FLOAT),
                    0.0)
             END                                          AS [eMids Experience],
             RAY.createdby,
             RAY.modifiedby,
             RAY.wfmemployeeid,
             RAY.managerapproveorwithdrawdate,
             RAY.releasereason,
             RAY.informedemployee,
             RAY.wfmsuggesteddate,
			 RAY.EffectiveTill,
			 RAY.Comments
      FROM   resourceassign ra
             INNER JOIN projectmaster pm
                     ON ra.projid = pm.projid
             INNER JOIN projectmasteraccess pma
                     ON ra.projid = pma.projid
             LEFT JOIN employeerole ER
                    ON ra.empemidsid = ER.empemidsid
             LEFT JOIN employeemaster e1
                    ON ra.empemidsid = e1.empemidsid
             LEFT JOIN designation d
                    ON E1.empdesignation = d.designationid
             LEFT JOIN resourceavailability RAY
                    ON RAY.employeeid = ra.empemidsid
             LEFT JOIN resourceavailabilitystatus RAS
                    ON RAY.availablestatusid = RAS.id
                       AND RAS.availablestatus IN ( 'Release Requested','Released', 'Available', 'Withdraw Requested', 'Withdrawn')
      WHERE  pma.empemidsid = @EmpeMidsID
             AND ( CONVERT(DATE, PMA.enddate) >= CONVERT(DATE, Getdate())
                    OR Year(PMA.enddate) = 1900
                    OR PMA.enddate IS NULL )
             AND ( Ra.releasedate IS NULL
                    OR CONVERT(DATE, Ra.releasedate) >= CONVERT(DATE, Getdate())
                    OR Year(Ra.releasedate) = 1900 )
	 ORDER BY E1.commonname;
  END 

  GO
 CREATE OR ALTER PROCEDURE [dbo].[USP_GET_EmployeeOpportunity_BY_RRIds] @RRID nvarchar(MAX) AS BEGIN DECLARE @sql_xml XML = Cast(
  '<root><U>' + Replace(@RRID, ',', '</U><U>')+ '</U></root>' AS XML
) 
SELECT 
  f.x.value('.', 'BIGINT') AS RRIds INTO #RRIDTable
FROM 
  @sql_xml.nodes('/root/U') f(x) DECLARE @WfmLaunchpadtbl TABLE(
    [Employee Name] nvarchar(max), 
    [Employee ID] nvarchar(max), 
    [EmpMailId] nvarchar(max), 
    [Telephone Mobile] nvarchar(max), 
    [Designation] nvarchar(max), 
    [Reporting Manger Emp ID] nvarchar(max), 
    [Reporting Manager Name] nvarchar(max), 
    [Business Location] nvarchar(max), 
    [Business City] nvarchar(max), 
    [Past Experience] nvarchar(max), 
    [eMids Experience] nvarchar(max), 
    [Gender] nvarchar(max), 
    [Project Name] nvarchar(max), 
    [Account Name] nvarchar(max), 
    [WorkingCity] nvarchar(max), 
    [EmployeeRole] nvarchar(max), 
    [PrimarySkill] nvarchar(max), 
    [SecondarySkill] nvarchar(max), 
    [WFMSpoc] nvarchar(max), 
    [EffectiveTill] nvarchar(max), 
    [AvailableStatus] nvarchar(max), 
    [Photo] nvarchar(max), 
    [EmployeeWriteup] nvarchar(max), 
    [EmpAdSUserAcct] nvarchar(max), 
    [AssignDate] nvarchar(max), 
    [ReleaseDate] nvarchar(max), 
    Aging int, 
    AplliedOpportunityCount int,
	AvailableAllocationPercentage int,
	Studio nvarchar(max)
  );
INSERT INTO @WfmLaunchpadtbl EXEC GetLaunchpadEmployeeDetails_For_WFM '-1','-1';

SELECT 
  EmployeeId, 
  RrId, 
  CreatedOn, 
  StatusId, 
  EOS.Status, 
  Comments, 
  ScheduledDate, 
  EO.AdditionalComments 
FROM 
  EmployeeOpportunity(Nolock) EO 
  INNER JOIN EmployeeOpportunityStatus(Nolock) EOS on EO.StatusId = EOS.Id 
  INNER JOIN #RRIDTable b11 on  EO.RrId  =b11.RRIds
 END;

GO

  
  
CREATE OR ALTER   PROCEDURE [dbo].[USP_GetRRHistoryLog]
(
  @RrId INT 
  )
AS
BEGIN
   SELECT    O.EmployeeId, S.[status],  
	   CASE 
				WHEN S.[status] ='Active' THEN 
 					REPLACE(S.RRLookUpValue, '@TalentName',ISNULL(E1.CommonName,'')  )   
				WHEN S.[status] ='Withdrawn' THEN 
 					REPLACE(S.RRLookUpValue, '@TalentName', ISNULL(E1.CommonName,'') )   
				WHEN S.[status] ='Declined' THEN 
 					REPLACE(REPLACE(S.RRLookUpValue, '@TalentName',ISNULL(E1.CommonName,'')  )   , '@ManagerName', ISNULL(E2.CommonName,'')   )  
				WHEN S.[status] ='Scheduled' THEN 
 					REPLACE(
					REPLACE(REPLACE(S.RRLookUpValue, '@ScheduledDate',ISNULL(O.WfmAllocationStartDate,'')  ), '@TalentName',ISNULL(E1.CommonName,'')  )
					, '@ManagerName',  ISNULL(E2.CommonName,'') )   
				WHEN S.[status] ='AllocationRequested' THEN 
 					REPLACE(REPLACE(	REPLACE(S.RRLookUpValue, '@AllocationRequestedDate',ISNULL(O.AllocationStartDate,'')  )   , '@TalentName',ISNULL(E1.CommonName,'')  ) , '@ManagerName',     ISNULL(E2.CommonName,'') )   

				WHEN S.[status] ='Dropped' THEN 
 					REPLACE(	REPLACE(S.RRLookUpValue, '@TalentName',ISNULL(E1.CommonName,'')  )   , '@ManagerName',  ISNULL(E2.CommonName,'')  )   


				WHEN S.[status] ='Earmarked' THEN 
 					REPLACE(
							REPLACE(
										REPLACE(S.RRLookUpValue,'@EarmarkedDate', ISNULL( O.WfmAllocationStartDate ,''))   ,
									'@TalentName',   ISNULL(E1.CommonName,'')  
									) 
					 , '@WFMName',  ISNULL(E3.CommonName,'')  )   
				 
				WHEN S.[status] ='L2Discussion' THEN 
 					REPLACE(REPLACE(
										REPLACE(S.RRLookUpValue,'@EarmarkedDate', ISNULL( O.AllocationStartDate,'') )   ,
									'@TalentName',    ISNULL(E1.CommonName,'') 
									) , '@ManagerName',    ISNULL(E2.CommonName,'')   )   
				ELSE
					REPLACE(S.RRLookUpValue, '@TalentName',  ISNULL(E1.CommonName,'')  )   -- ACTIVE CASE
		END 
  AS ActualMessage,
 

 CASE WHEN S.[status] ='Active' THEN 
 					O.CreatedOn 
				WHEN S.[status] ='Withdrawn' THEN
 				 IIF  (O.DisapprovedBy='Manager',	O.ScheduledDate,O.ModifiedOn)
				WHEN S.[status] ='Declined' THEN 
 					 IIF  ((O.Comments !='' OR O.Comments !=null) ,	O.ModifiedOn,O.ScheduledDate)
				WHEN S.[status] ='Scheduled' THEN 
 					 IIF  ((O.ScheduledDate !='' OR O.ScheduledDate !=null) ,	O.ScheduledDate,O.ModifiedOn)
				WHEN S.[status] ='AllocationRequested' THEN 
 					 O.AllocationStartDate
				WHEN S.[status] ='Dropped' THEN  				 
				 O.ScheduledDate
				WHEN S.[status] ='Earmarked' THEN 
 					 O.WfmAllocationStartDate			 
				WHEN S.[status] ='L2Discussion' THEN 
 					O.ScheduledDate
				ELSE
				O.CreatedOn     -- ACTIVE CASE
		END  
		AS ActionPerformedDate,
   E1.CommonName as [EmployeeName],
   E2.CommonName as [ManagerName],
   E3.CommonName as [WFMName],
   O.Comments,
   O.AdditionalComments
    
   
   FROM EmployeeOpportunityLog O 
   INNER JOIN EmployeeOpportunityStatus S ON O.StatusId=S.Id 
   Left JOIN   EmployeeMaster E1 ON O.EmployeeId = E1.EmpEmidsId
   Left JOIN   EmployeeMaster E2 ON O.ManagerId = E2.EmpEmidsId
   Left JOIN   EmployeeMaster E3 ON O.CreatedBy = E3.EmpEmidsId
   
   WHERE RrId=@RrId
  ORDER BY O.ModifiedOn   ;
 
END;
 
 
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
	,[EmpAdSUserAcct] nvarchar(max),[AssignDate] nvarchar(max),[ReleaseDate] nvarchar(max),Aging int, AplliedOpportunityCount int, AvailableAllocationPercentage int, Studio nvarchar(max));
 
	INSERT INTO @WfmLaunchpadtbl
	EXEC GetLaunchpadEmployeeDetails_For_WFM '-1','-1', 1;
 
	SELECT O.RrId, COUNT(O.RrId) AS AppliedResourceRequestIdCount
	FROM EmployeeOpportunity (NOLOCK) O
	INNER JOIN #RRList R On O.RrId = R.RRId
	INNER JOIN @WfmLaunchpadtbl E On E.[Employee ID] = O.EmployeeId
	GROUP BY O.RrId
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetScheduledOpportunities]
AS
BEGIN
SELECT 
	EO.RrId
	,RR.ProjectId
	,RR.Requester
	,EM.EmployeeName AS RequesterName
	,EM.EmpMailId AS RequesterMailId
	,PM.ProjName
	,EO.ScheduledDate
	,EOS.[Status]
	,EM1.EmployeeName As EmployeeName
	,RR.RRNumber
	,RR.[Role]
FROM dbo.EmployeeOpportunity(NOLOCK) EO
	LEFT JOIN dbo.EmployeeOpportunityStatus(NOLOCK) EOS on EO.StatusId = EOS.Id
	LEFT JOIN dbo.RR_ResourceRequests(NOLOCK)		RR on EO.RrId = RR.Id
	LEFT JOIN dbo.EmployeeMaster_WFM(NOLOCK)		EM ON RR.Requester = Em.EmployeeID
	LEFT JOIN ProjectMaster (Nolock)				PM ON RR.ProjectId = PM.projid
	INNER Join RR_RequestStatusMaster(Nolock)		rrm on rr.StatusId = rrm.StatusId
	LEFT JOIN dbo.EmployeeMaster_WFM(NOLOCK)		EM1 ON EO.EmployeeId = EM1.EmployeeID
WHERE EOS.[Status] IN ('Scheduled', 'L2Discussion') 
	AND EO.ScheduledDate < GETDATE()
	AND rrm.RRStatus = 'Open' 
	AND rrm.IsActive = 1
END
GO

CREATE OR ALTER PROCEDURE [dbo].[GetLaunchpadEmployeeDetails_For_WFM]  
	@EmployeeId varchar(100) Null,
	@LoginName varchar(100) Null,
	@IsEarmarkedRequired bit = 0
AS
BEGIN
Select ActiveLaunchpad.* FROM(
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
	Case when (Year(E1.LastWorkingDate)=1900 or E1.LastWorkingDate IS NULL) then ISNULL(cast(datediff(mm,E1.EmpDateofJoin,getdate()) as float),0.0)   
		else ISNULL(cast(datediff(mm,E1.EmpDateofJoin,E1.LastWorkingDate) as float),0.0) end as [eMids Experience],                                             
	case when E1.EmpGender='M' then 'Male' When E1.EmpGender='F' then 'Female' When E1.EmpGender='O' then 'Other' else ''  end as [Gender],                
	ISNULL((select dbo.fn_GetProjectsForEmployee(e1.EmpeMidsID)),'') as [Project Name],                                  
	ISNULL((select[dbo].[fn_GetAccountForEmpId](e1.EmpeMidsID)),'') as [Account Name],                            
	isnull(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as WorkingCity,                  
	--isnull((select dbo.fn_GetBUForEmployee(e1.EmpeMidsID)),'') AS BU,
	--isnull((select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID,'Account')),'') AS PrimaryAccount,
	--isnull((select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID,'Project')),'') AS PrimaryProject,
	--isnull((select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID,'BU')),'') AS PrimaryBU,
	ISNULL(ER.Role,'') AS EmployeeRole,
	ISNULL(ER.PrimarySkill,'') AS PrimarySkill,
	ISNULL(ER.SecondarySkill,'') AS SecondarySkill,
	ISNULL(ra.WFMSpoc, '') AS WFMSpoc,
	ISNULL(ra.EffectiveTill, '') As EffectiveTill ,
	ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,
	'AbsoultePath + EmpID' as Photo,
	E1.EmpShortWriteUp as 'EmployeeWriteup',
	E1.EmpAdSUserAcct, rs.AssignDate, rs.ReleaseDate,DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS Aging,
	ISNULL(
    (
        SELECT COUNT(*)
        FROM EmployeeOpportunity EO
        LEFT JOIN EmployeeOpportunityStatus(NOLOCK) EOS ON EO.StatusId = EOS.Id
        WHERE EOS.Status IN ('Active', 'Scheduled', 'AllocationRequested', 'L2Discussion') AND EO.EmployeeId = E1.EmpeMidsID
    ),
    0
	) AS AplliedOpportunityCount,
	RS.allocation AS AvailableAllocationPercentage,
	ER.Studio
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

 GO
CREATE OR ALTER   PROCEDURE [USP_GetEmployeeHistoryLog]
(
  @EmployeeId varchar(100)  
  )
AS
BEGIN
   SELECT    S.[status],  
	   CASE 
				WHEN S.[status] ='Active' THEN 
 					REPLACE(S.TalentLookUpValue, '@TalentName',ISNULL(E1.CommonName,'')  )   
				WHEN S.[status] ='Withdrawn' THEN 
 					REPLACE(S.TalentLookUpValue, '@TalentName', ISNULL(E1.CommonName,'') )   
				WHEN S.[status] ='Declined' THEN 
 					REPLACE(REPLACE(S.TalentLookUpValue, '@TalentName',ISNULL(E1.CommonName,'')  )   , '@ManagerName', ISNULL(E2.CommonName,'')   )  
				WHEN S.[status] ='Scheduled' THEN 
 					REPLACE(
					REPLACE(REPLACE(S.TalentLookUpValue, '@ScheduledDate',ISNULL(O.WfmAllocationStartDate,'')  ), '@TalentName',ISNULL(E1.CommonName,'')  )
					, '@ManagerName',  ISNULL(E2.CommonName,'') )   
				WHEN S.[status] ='AllocationRequested' THEN 
 					REPLACE(REPLACE(	REPLACE(S.TalentLookUpValue, '@AllocationRequestedDate',ISNULL(O.AllocationStartDate,'')  )   , '@TalentName',ISNULL(E1.CommonName,'')  ) , '@ManagerName',     ISNULL(E2.CommonName,'') )   

				WHEN S.[status] ='Dropped' THEN 
 					REPLACE(	REPLACE(S.TalentLookUpValue, '@TalentName',ISNULL(E1.CommonName,'')  )   , '@ManagerName',  ISNULL(E2.CommonName,'')  )   


				WHEN S.[status] ='Earmarked' THEN 
 					REPLACE(
							REPLACE(
										REPLACE(S.TalentLookUpValue,'@EarmarkedDate', ISNULL( O.WfmAllocationStartDate ,''))   ,
									'@TalentName',   ISNULL(E1.CommonName,'')  
									) 
					 , '@WFMName',  ISNULL(E3.CommonName,'')  )   
				 
				WHEN S.[status] ='L2Discussion' THEN 
 					REPLACE(REPLACE(
										REPLACE(S.TalentLookUpValue,'@EarmarkedDate', ISNULL( O.AllocationStartDate,'') )   ,
									'@TalentName',    ISNULL(E1.CommonName,'') 
									) , '@ManagerName',    ISNULL(E2.CommonName,'')   )   
				ELSE
					REPLACE(S.TalentLookUpValue, '@TalentName',  ISNULL(E1.CommonName,'')  )   -- ACTIVE CASE
		END 
  AS ActualMessage,
 

 CASE WHEN S.[status] ='Active' THEN 
 					O.CreatedOn 
				WHEN S.[status] ='Withdrawn' THEN 
 				 	O.ScheduledDate
				WHEN S.[status] ='Declined' THEN 
 						O.ScheduledDate
				WHEN S.[status] ='Scheduled' THEN 
 					O.ScheduledDate
				WHEN S.[status] ='AllocationRequested' THEN 
 					 O.AllocationStartDate
				WHEN S.[status] ='Dropped' THEN  				 
				 O.ScheduledDate
				WHEN S.[status] ='Earmarked' THEN 
 					 O.WfmAllocationStartDate			 
				WHEN S.[status] ='L2Discussion' THEN 
 					O.ScheduledDate
				ELSE
				O.CreatedOn     -- ACTIVE CASE
		END  
		AS ActionPerformedDate,
   E1.CommonName as [EmployeeName],
   E2.CommonName as [ManagerName],
   E3.CommonName as [WFMName],
   O.Comments,
   O.AdditionalComments
    
   
   FROM EmployeeOpportunityLog O 
   INNER JOIN EmployeeOpportunityStatus S ON O.StatusId=S.Id 
   Left JOIN   EmployeeMaster E1 ON O.EmployeeId = E1.EmpEmidsId
   Left JOIN   EmployeeMaster E2 ON O.ManagerId = E2.EmpEmidsId
   Left JOIN   EmployeeMaster E3 ON O.CreatedBy = E3.EmpEmidsId
   
   WHERE EmployeeId=@EmployeeId
  ORDER BY O.ModifiedOn   ;
 
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetDeclinedAndDroppedComments]
AS
BEGIN
 
SELECT 
	Comments
	,COUNT(Comments) AS CommentsCount
FROM EmployeeOpportunity EO
	INNER JOIN EmployeeOpportunityStatus(NOLOCK) EOS ON EO.StatusId = EOS.Id
WHERE EOS.[Status] In ('Declined', 'Dropped')
GROUP BY Comments
ORDER BY Comments
END

GO

CREATE OR ALTER   PROCEDURE [dbo].[USP_Get_RRAgeing] 
AS
BEGIN
SELECT RR_Id, RR_Number, RR_ProjectName, RR_RoleRequested, RR_PostedOn, RRAgeing  from
		(select r.Id AS [RR_Id],
		r.RRNumber AS [RR_Number],
		pm.ProjName AS [RR_ProjectName],
		r.Role AS [RR_RoleRequested],
		r.StartDate AS [RR_PostedOn],
		DATEDIFF(DD, r.StartDate, getdate()) as RRAgeing,
		count(*) as [Count]
	FROM
		RR_ResourceRequests R (NOLOCK)
		INNER JOIN ProjectMaster pm (NOLOCK) ON r.ProjectId = pm.ProjId
		INNER JOIN RR_RequestStatusMaster rrm (NOLOCK) ON r.StatusId = rrm.StatusId
	WHERE
		rrm.RRStatus = 'Open'
		AND rrm.IsActive = 1 
		group by r.Id ,pm.ProjName,r.Role,r.StartDate,DATEDIFF(DD, r.StartDate, getdate()),r.RRNumber)X
		 ORDER BY RRAgeing DESC
END;

GO
  
CREATE OR ALTER PROCEDURE [dbo].[USP_Get_TalentDataReport]
AS
BEGIN

DECLARE @WfmLaunchpadtbl TABLE(
    [Employee Name] nvarchar(max), 
    [Employee ID] nvarchar(max), 
    [EmpMailId] nvarchar(max), 
    [Telephone Mobile] nvarchar(max), 
    [Designation] nvarchar(max), 
    [Reporting Manger Emp ID] nvarchar(max), 
    [Reporting Manager Name] nvarchar(max), 
    [Business Location] nvarchar(max), 
    [Business City] nvarchar(max), 
    [Past Experience] nvarchar(max), 
    [eMids Experience] nvarchar(max), 
    [Gender] nvarchar(max), 
    [Project Name] nvarchar(max), 
    [Account Name] nvarchar(max), 
    [WorkingCity] nvarchar(max), 
    [EmployeeRole] nvarchar(max), 
    [PrimarySkill] nvarchar(max), 
    [SecondarySkill] nvarchar(max), 
    [WFMSpoc] nvarchar(max), 
    [EffectiveTill] nvarchar(max), 
    [AvailableStatus] nvarchar(max), 
    [Photo] nvarchar(max), 
    [EmployeeWriteup] nvarchar(max), 
    [EmpAdSUserAcct] nvarchar(max), 
    [AssignDate] nvarchar(max), 
    [ReleaseDate] nvarchar(max), 
    Aging int, 
    AplliedOpportunityCount int,
	AvailableAllocationPercentage int,
	Studio nvarchar(max)
  );
INSERT INTO @WfmLaunchpadtbl EXEC GetLaunchpadEmployeeDetails_For_WFM '-1', 
'-1';
 
SELECT
    distinct
	r.RRNumber,
	pm.ProjName,
	r.[Role] AS RoleRequested,
	r.RLSTechnology  AS PrimarySkills,
	r.ProposedDate as PostedOn,
	r.CreatedDate as CCDDate,
	r.WorkLocation,r.YearsOfExp,
	EmployeeId, 
	E.[Employee Name],
	E.EmployeeRole,
	E.[eMids Experience],
	E.[Past Experience],
	(E.[eMids Experience]+E.[Past Experience]) AS OverAllExperience,
	E.PrimarySkill, --CHECK
	 CASE WHEN COUNT(*) OVER(PARTITION BY RR.EmpeMidsID) = 1 THEN PM.ProjName 
                 ELSE LAG(PM.ProjName) OVER(PARTITION BY RR.EmpeMidsID ORDER BY RR.ReleaseDate) END AS PreviousProjectName,
	 
	EOS.[Status],   
	ScheduledDate AS ActionDate
 
FROM 
  EmployeeOpportunity(Nolock) EO 
  INNER JOIN EmployeeOpportunityStatus(Nolock) EOS on EO.StatusId = EOS.Id  
  INNER JOIN @WfmLaunchpadtbl E On E.[Employee ID] = EO.EmployeeId 
  INNER JOIN RR_ResourceRequests(Nolock) r ON r.Id=EO.RrId 
  INNER Join ProjectMaster(Nolock)	pm On r.ProjectId = pm.ProjId
  LEFT JOIN   ResourceAssign RR    ON RR.ProjId=pm.ProjId
  AND RR.EmpeMidsID=EO.EmployeeId 
  INNER Join RR_RequestStatusMaster(Nolock) rrm on r.StatusId = rrm.StatusId
  WHERE rrm.RRStatus = 'Open' And rrm.IsActive = 1
  END;						

 GO
 CREATE OR ALTER PROCEDURE [dbo].[USP_LaunchPad_TalentExitReport]
AS
BEGIN
    SELECT EmployeeId AS [Employee ID],
           E1.CommonName AS [Employee Name],
           d.Designation,
        CONVERT(varchar, E1.EmidsDateOfJoin,6)   AS [Date Of Joining],
           pm.ProjName AS [Project Name],
           ISNULL(
           (
               select [dbo].[fn_GetAccountForEmpId](E1.EmpeMidsID)
           ),
           ''
                 ) as [Account Name],
           E1.EmpManager AS [Emp ManagerID],
           IIF(E1.EmpExitDateNew = '', NULL, E1.EmpExitDateNew) AS [Resignation Date],
           IIF(cast(E1.LastWorkingDate AS DATE) = '1900-01-01', NULL, cast(E1.LastWorkingDate AS DATE)) AS [Last Working Date],
           E1.ResignationComments AS [Exit Comment],
           IIF(E1.EmpExitDateNew = NULL, 'YES', 'NO') AS [Exit Without Confirm]
    FROM EmployeeOpportunity (Nolock) EO
        INNER JOIN EmployeeOpportunityStatus (Nolock) EOS
            on EO.StatusId = EOS.Id
        INNER JOIN RR_ResourceRequests (Nolock) r
            ON r.Id = EO.RrId
        INNER Join RR_RequestStatusMaster (Nolock) rrm
            on r.StatusId = rrm.StatusId
        INNER JOIN Employeemaster E1
            ON E1.EmpEmidsid = EO.EmployeeId
        INNER JOIN ProjectMaster pm (NOLOCK)
            ON r.ProjectId = pm.ProjId
        LEFT JOIN Designation d
            on E1.empdesignation = d.designationid
    Where rrm.RRStatus = 'Open'
          And rrm.IsActive = 1
          and eos.Status = 'Earmarked';
END

GO

CREATE OR ALTER PROCEDURE [dbo].[USP_LaunchPad_TalentReport]
AS
BEGIN

    SELECT distinct
        ROW_NUMBER() OVER (ORDER BY E1.EmpEmidsId) row_num,
        ISNULL(E1.EmpLocation, '') as [Location],
        '' as Initiative,
        CASE
            WHEN COUNT(*) OVER (PARTITION BY RS.EmpeMidsID) = 1 THEN
                PM.ProjName
            ELSE
                LAG(PM.ProjName) OVER (PARTITION BY RS.EmpeMidsID ORDER BY RS.ReleaseDate)
        END as [Previous Project],
        CASE
            WHEN CHARINDEX('azure', LOWER(RS.ProjectSkills)) = 0 then
                'TRUE'
            WHEN CHARINDEX('aws', LOWER(RS.ProjectSkills)) = 0 then
                'TRUE'
            WHEN CHARINDEX('GCP', LOWER(RS.ProjectSkills)) = 0 then
                'TRUE'
            else
                'False'
        end as [Talent Cloud Project],
        E1.CommonName as [Employee Name],
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
        ISNULL(ra.WFMSpoc, '') AS [New WFM Manager],
        E1.EmpEmidsId as [Employee ID],
        ISNULL(d.Designation, '') as [Designation],
        ISNULL(cast(E1.EmpExperience as float), 0.0) as [Past Experience],
        CONVERT(varchar, E1.EmidsDateOfJoin, 6) AS [Emids DOJ],
        DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) as [Bench Aging],
        CASE
            WHEN DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) > 120 THEN
                '> 120 Days'
            WHEN
            (
                DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) <= 90
                and DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) >= 60
            ) THEN
                '60-90 Days'
            WHEN
            (
                DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) <= 60
                and DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) >= 30
            ) THEN
                '30-60 Days'
            ELSE
                '0-30 Days'
        END as [Aging Bucket],
        ras.AvailableStatus as [Deployment Status],
        EmployeeOpportunityCnt.cnt AS [No. Of Opportunities],
        ra.WfmRejectComment as [WFM Recommendation],
        ra.Comments as [Additional comment],
        CASE
            WHEN ras.AvailableStatus = 'Customer interview' Then
                'True'
            else
                'False'
        END as [Client Interview],
        ra.ReleaseReason as [Result],
        ra.WfmSuggestedDate as [Proposed Date],
        CONVERT(varchar, E1.EmidsDateOfJoin, 6) AS [Aging(Followup)],
        CONVERT(varchar, E1.EmidsDateOfJoin, 6) as [Followup Aging Bucket],
        ra.WfmSuggestedDate as [Response date],
        ISNULL(
        (
            select dbo.[fn_GetPrimaryAccountProjectBUForEmployee](e1.EmpeMidsID, 'BU')
        ),
        '#N/A'
              ) as [BU]
    --,

    --	EmployeeOpportunityTb.WfmAllocationStartDate as [Response Date]





    FROM Employeemaster e1
        LEFT JOIN Employeemaster e2
            on e1.EmpManager = e2.EmpEmidsid
        LEFT JOIN FunctionMaster FM
            ON ISNULL(e1.EmpFunction, 0) = FM.FunctionId
               AND FM.IsActive = 1
        LEFT JOIN Designation d
            on E1.empdesignation = d.designationid
        LEFT JOIN Designation d1
            on E2.empdesignation = d1.designationid
        LEFT JOIN DeptMaster Dept
            on Dept.DeptId = E1.EmpDepartment
        LEFT JOIN Practiceareamaster p
            on E1.primarypracticearea = p.practiceareaid
        LEFT JOIN ResourceAssign RS
            on RS.EmpeMidsID = e1.EmpeMidsID
               and RS.ReleaseDate >= GETDATE()
               and ISDuplicate != 1
        LEFT JOIN ProjectMaster PM
            On RS.ProjId = PM.ProjId
        LEFT JOIN CustomerMaster CM
            On CM.CustomerID = PM.CustomerId
        LEFT JOIN MasterCustomer MC
            On MC.MastCustId = CM.MastCustId
        LEFT JOIN EmployeeRole ER
            on E1.EmpeMidsID = ER.EmpeMidsID
        LEFT JOIN ResourceAvailability ra
            on E1.EmpeMidsID = ra.EmployeeId
        LEFT JOIN ResourceAvailabilityStatus ras
            on ra.AvailableStatusID = ras.Id
        INNER JOIN
        (
            Select Count(*) cnt,
                   EmployeeId
            from EmployeeOpportunity
            group by EmployeeId
        ) EmployeeOpportunityCnt
            ON EmployeeOpportunityCnt.EmployeeId = ra.EmployeeId
    WHERE ras.AvailableStatus not in ( 'Earmarked' )
END

GO

Create OR ALTER PROCEDURE  [dbo].[USP_All_ActiveRR_BY_Status]
	@status nvarchar(50)
	 	
AS
BEGIN
    
	DECLARE @sql_xml XML = Cast('<root><U>'+ Replace(@status, ',', '</U><U>')+ '</U></root>' AS XML)
    
SELECT
    r.RRNumber,
    pm.ProjName , 
    r.RLSTechnology AS [Skills],
    Case When R.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END)
		When R.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) When R.Location='UK' Then (CASE WHEN WorkLocation is not null
		or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) ELSE CMT.CityName END AS [Location],
    r.YearsOfExp AS [Experience],
    r.StartDate AS [AppliedOn],
    DATEDIFF(DD, r.StartDate, getdate()) as RRAgeing,
	O.ScheduledDate,
	E1.CommonName AS [EmployeeName],
	O.EmployeeId,
	O.RrId,
	DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS EmployeeAgeing,
	O.Comments,
	o.AdditionalComments
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
	INNER JOIN Employeemaster E1 ON E1.EmpEmidsid = O.EmployeeId
	LEFT JOIN ResourceAssign RS on RS.EmpeMidsID = E1.EmpeMidsID and RS.ReleaseDate >= GETDATE() and ISDuplicate != 1 
WHERE
    rrm.RRStatus = 'Open'
    AND rrm.IsActive = 1
	AND s.Status IN( SELECT f.x.value('.', 'nvarchar(100)')
FROM @sql_xml.nodes('/root/U') f(x))  
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetFutureReleaseEmployeeIds]
AS
BEGIN
	
SELECT * FROM (
    SELECT 
        ra.EmpeMidsID as EmployeeId, 
        ROW_NUMBER() OVER(PARTITION BY ra.EmpeMidsID ORDER BY ra.ReleaseDate DESC) AS RowNum
    FROM 
        ResourceAssign ra 
        INNER JOIN Projectmaster pm ON ra.ProjID = pm.ProjID  
        INNER JOIN ProjectmasterAccess pma ON ra.ProjID = pma.ProjID  
        LEFT JOIN ResourceAvailability rav on ra.EmpeMidsID = rav.EmployeeId
        LEFT JOIN ResourceAvailabilityStatus ras on rav.AvailableStatusID = ras.Id
    WHERE 
        CONVERT(DATE, GETDATE()) between CONVERT(DATE, AssignDate) And CONVERT(DATE, ReleaseDate)
		AND ((
			UPPER(pm.ProjName) NOT LIKE '%LAUNCHPAD%'
            AND CONVERT(DATE, RA.ReleaseDate) <= DATEADD(WEEK,3, CONVERT(DATE, GETDATE()))
        )
        OR (
            RAS.AvailableStatus = 'Released'
            AND CONVERT(DATE, rav.ManagerApproveOrWithdrawDate) <= DATEADD(WEEK,3, CONVERT(DATE, GETDATE()))
        ))
        AND (
            CONVERT(Date,PMA.EndDate) >= CONVERT(Date,GETDATE()) 
            OR YEAR(PMA.EndDate) = 1900 
            OR PMA.EndDate IS NULL
        )
) AS SubQuery
WHERE RowNum = 1
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetLaunchpadAndFutureEmployeeDetails]
AS
BEGIN

DECLARE @FutureAvailableEmployeetbl TABLE(EmployeeId nvarchar(max), RowNum nvarchar(max) );
 
	INSERT INTO @FutureAvailableEmployeetbl
	EXEC [USP_GetFutureReleaseEmployeeIds];

SELECT DISTINCT E1.CommonName as [Employee Name],                                                        
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
	ISNULL(ER.Role,'') AS EmployeeRole,
	ISNULL(ER.PrimarySkill,'') AS PrimarySkill,
	ISNULL(ER.SecondarySkill,'') AS SecondarySkill,
	ISNULL(ra.WFMSpoc, '') AS WFMSpoc,
	ISNULL(ra.EffectiveTill, '') As EffectiveTill ,
	ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,
	'AbsoultePath + EmpID' as Photo,
	E1.EmpShortWriteUp as 'EmployeeWriteup',
	E1.EmpAdSUserAcct, 
	rs.AssignDate, 
	rs.ReleaseDate,
	DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS Aging,
	ISNULL(
    (
        SELECT COUNT(*)
        FROM EmployeeOpportunity EO
        LEFT JOIN EmployeeOpportunityStatus(NOLOCK) EOS ON EO.StatusId = EOS.Id
        WHERE EOS.Status IN ('Active', 'Scheduled', 'AllocationRequested', 'L2Discussion') AND EO.EmployeeId = E1.EmpeMidsID
    ),
    0
	) AS AplliedOpportunityCount,
	RS.allocation AS AvailableAllocationPercentage
	,ER.Studio
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
		LEFT JOIN @FutureAvailableEmployeetbl FAV ON e1.EmpEmidsId = FAV.EmployeeId
		LEFT JOIN EmployeeOpportunity EOY on e1.EmpEmidsId = EOY.EmployeeId
		LEFT JOIN EmployeeOpportunityStatus EOS on EOY.StatusId = EOS.Id
    WHERE e1.isactive = 1 
		AND (((CM.CustomerId in (74, 553, 554, 555)) AND PM.IsActive = 1) OR FAV.EmployeeId IS NOT NULL OR EOS.Status = 'Earmarked' )
		AND pm.ProjName not like '%Un-available Pool%'
		ORDER BY E1.CommonName
	END

    GO

     
Create OR ALTER PROCEDURE [dbo].[USP_LaunchPad_ResourceAnalysisReport]
AS
BEGIN
    SELECT 
	r.RLSTechnology As PrimarySkill,
	r.SecondarySkills,
	r.Role	,
	 r.YearsOfExp,
	  r.Location,
	      EmployeeId AS [EmployeeID],
           E1.CommonName AS [EmployeeName],
           d.Designation,   
           E1.EmpManager AS [ManagerID]
       
    FROM EmployeeOpportunity (Nolock) EO
        INNER JOIN EmployeeOpportunityStatus (Nolock) EOS
            on EO.StatusId = EOS.Id
        INNER JOIN RR_ResourceRequests (Nolock) r
            ON r.Id = EO.RrId
        INNER Join RR_RequestStatusMaster (Nolock) rrm
            on r.StatusId = rrm.StatusId
        INNER JOIN Employeemaster E1
            ON E1.EmpEmidsid = EO.EmployeeId
        INNER JOIN ProjectMaster pm (NOLOCK)
            ON r.ProjectId = pm.ProjId
        LEFT JOIN Designation d
            on E1.empdesignation = d.designationid
    Where rrm.RRStatus = 'Open'
          And rrm.IsActive = 1
          and eos.Status = 'Earmarked';
END
GO

CREATE OR ALTER   PROCEDURE [dbo].[USP_Get_FutureAvailableresources]
AS
BEGIN
SELECT * FROM (
    SELECT 
        ra.EmpeMidsID, 
        E1.CommonName AS EmployeeName,  
        ISNULL(d.Designation,'') AS [Designation], 
        ra.Skill, 
        ra.ProjId, 
        pm.ProjName AS ProjectName, 
        ra.Allocation, 
        ra.AssignDate, 
        ra.ReleaseDate,
        ISNULL(ER.Role,'') AS EmployeeRole,   
		ISNULL(E1.EmpMailID,'') AS EmpEmailID,		
        ISNULL(ER.PrimarySkill,'') AS PrimarySkill,       
        ISNULL(ER.SecondarySkill,'') AS SecondarySkill,
        ISNULL(E1.EmpLocation,'') as [Business Location],  
        ISNULL(cast(E1.EmpExperience AS FLOAT),0.0) AS [Past Experience],
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as WorkingCity,
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US,e1.EmpeMidsID),'') as [Business City],
        CASE 
            WHEN (Year(E1.LastWorkingDate)=1900 OR E1.LastWorkingDate IS NULL) THEN ISNULL(cast(datediff(mm,E1.EmpDateofJoin,GETDATE()) AS FLOAT),0.0)          
            ELSE ISNULL(cast(datediff(mm,E1.EmpDateofJoin,E1.LastWorkingDate) AS FLOAT),0.0) 
        END as [eMids Experience],
        E2.CommonName as ManagerName,
        ISNULL(rav.WFMSpoc, '') AS WFMSpoc,
        ISNULL(rav.EffectiveTill, '') As EffectiveTill,
        ISNULL(ras.AvailableStatus, '') AS AvailableStatus,
        ROW_NUMBER() OVER(PARTITION BY ra.EmpeMidsID ORDER BY ra.ReleaseDate DESC) AS RowNum,
		CASE
			WHEN ras.AvailableStatus = 'Released' THEN 'Confirmed'
			ELSE 'Unconfirmed' END AS ReleaseStatus
    FROM 
        ResourceAssign ra 
        INNER JOIN Projectmaster pm ON ra.ProjID = pm.ProjID  
        INNER JOIN ProjectmasterAccess pma ON ra.ProjID = pma.ProjID  
        LEFT JOIN EmployeeRole ER ON ra.EmpeMidsID = ER.EmpeMidsID  
        LEFT JOIN Employeemaster e1 ON ra.EmpeMidsID = e1.EmpeMidsID  
        LEFT JOIN Designation d ON E1.empdesignation = d.designationid
        LEFT JOIN Employeemaster E2 ON e1.EmpManager = E2.EmpeMidsID 
        LEFT JOIN ResourceAvailability rav on ra.EmpeMidsID = rav.EmployeeId
        LEFT JOIN ResourceAvailabilityStatus ras on rav.AvailableStatusID = ras.Id
    WHERE 
        CONVERT(DATE, GETDATE()) between CONVERT(DATE, AssignDate) And CONVERT(DATE, ReleaseDate)
		AND ((
			UPPER(pm.ProjName) NOT LIKE '%LAUNCHPAD%'
            AND CONVERT(DATE, RA.ReleaseDate) <= DATEADD(WEEK,3, CONVERT(DATE, GETDATE()))
        )
        OR (
            RAS.AvailableStatus = 'Released'
            AND CONVERT(DATE, rav.ManagerApproveOrWithdrawDate) <= DATEADD(WEEK,3, CONVERT(DATE, GETDATE()))
        ))
        AND (
            CONVERT(Date,PMA.EndDate) >= CONVERT(Date,GETDATE()) 
            OR YEAR(PMA.EndDate) = 1900 
            OR PMA.EndDate IS NULL
        )
) AS SubQuery
WHERE RowNum = 1
END
GO

CREATE OR ALTER PROCEDURE [dbo].[USP_GetDroppedApplications]
AS
BEGIN
SELECT
  EO.RrId, 
  rr.RRNumber,
  pm.projName AS ProjectName,
  DATEDIFF(DAY, CAST(rr.StartDate AS DATE), CAST(GETDATE() AS DATE)) AS RRAging,
  EmployeeId,
  em.CommonName AS EmployeeName,
  rr.RLSTechnology AS RRSkills,
  rr.Location,
  rr.YearsOfExp AS YearsOfExperience,
  rr.RLSExperience,
  EO.CreatedOn As AppliedOn,
  EOS.Status, 
  EO.Comments, 
  ScheduledDate, 
  EO.AdditionalComments,
  Case When rr.Location='US' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UC.CityName END)    
             When rr.Location='INDIA' Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE IC.CityName END) 
             When rr.Location='UK'  Then (CASE WHEN WorkLocation is not null or WorkLocation!='' then WorkLocation ELSE UKC.CityName END) 
             ELSE CMT.CityName END AS CityName 
FROM 
  EmployeeOpportunity(Nolock) EO 
  INNER JOIN EmployeeOpportunityStatus(Nolock) EOS on EO.StatusId = EOS.Id
  INNER JOIN RR_ResourceRequests(NOLOCK) rr on EO.RrId = rr.Id
  INNER JOIN Employeemaster(NOLOCK) em ON EO.EmployeeId = em.EmpEmidsid
  INNER Join ProjectMaster(Nolock) pm on rr.ProjectId = pm.ProjId 
  --INNER JOIN ProjectmasterAccess PMA ON PMA.ProjID = Pm.ProjId AND PMA.RoleID = 1    
  LEFT JOIN Tbl_INDIACitiesMaster(Nolock) IC ON IC.ID = rr.CityId 
  LEFT JOIN Tbl_USCitiesMaster(Nolock) UC ON UC.ID = rr.CityId    
  LEFT JOIN Tbl_UKCitiesMaster(Nolock) UKC ON UKC.ID = rr.CityId 
  LEFT JOIN tbl_CityMaster(Nolock) CMT ON CMT.ID = rr.CityId   
Where EOS.Status = 'Dropped'
END
GO

CREATE OR ALTER PROCEDURE [dbo].[GetAllLaunchpadEmployees]
    @EmployeeId varchar(100) Null,
    @LoginName varchar(100) Null
AS
BEGIN
    -- Temporary table to store profile completeness
    DECLARE @ProfileCompleteness TABLE (
        EmpeMidsID VARCHAR(50),
        AboutPercentage INT,
        PrimarySkillsPercentage INT,
        SecondarySkillsPercentage INT,
        CertificationsPercentage INT,
        EmidsProjectPercentage FLOAT,
        PrevProjectPercentage FLOAT,
        TotalProfileCompletenessPercentage FLOAT
    );

    -- Fetch data for profile completeness calculation
    INSERT INTO @ProfileCompleteness
    SELECT 
        E1.EmpeMidsID,
        CASE WHEN LEN(E1.EmpShortWriteUp) > 0 THEN 10 ELSE 0 END AS AboutPercentage,
        CASE WHEN LEN(ER.PrimarySkill) > 0 THEN 5 ELSE 0 END AS PrimarySkillsPercentage,
        CASE WHEN LEN(ER.SecondarySkill) > 0 THEN 5 ELSE 0 END AS SecondarySkillsPercentage,
        CASE WHEN LEN(C.Certifications) > 0 THEN 10 ELSE 0 END AS CertificationsPercentage,
        CASE 
            WHEN COUNT_RA.Total > 0 
            THEN 40.0 * (COUNT_RA.WithResponsibilities * 1.0 / COUNT_RA.Total) 
            ELSE 0 
        END AS EmidsProjectPercentage,
        CASE 
            WHEN COUNT_POA.Total > 0 
            THEN 30.0 * (COUNT_POA.WithResponsibilities * 1.0 / COUNT_POA.Total) 
            ELSE 0 
        END AS PrevProjectPercentage,
        CASE
            WHEN LEN(E1.EmpShortWriteUp) > 0 THEN 10 ELSE 0 END +
            CASE WHEN LEN(ER.PrimarySkill) > 0 THEN 5 ELSE 0 END +
            CASE WHEN LEN(ER.SecondarySkill) > 0 THEN 5 ELSE 0 END +
            CASE WHEN LEN(C.Certifications) > 0 THEN 10 ELSE 0 END +
            CASE 
                WHEN COUNT_RA.Total > 0 
                THEN 40.0 * (COUNT_RA.WithResponsibilities * 1.0 / COUNT_RA.Total) 
                ELSE 0 
            END +
            CASE 
                WHEN COUNT_POA.Total > 0 
                THEN 30.0 * (COUNT_POA.WithResponsibilities * 1.0 / COUNT_POA.Total) 
                ELSE 0 
            END AS TotalProfileCompletenessPercentage
    FROM EmployeeMaster E1
    LEFT JOIN EmployeeRole ER ON E1.EmpeMidsID = ER.EmpeMidsID
    LEFT JOIN (
        SELECT 
            EM.EmpeMidsID,
            (
                SELECT sm.Skill + ',' AS [text()]
                FROM tbl_EmployeeSkillDetails ST1
                INNER JOIN tbl_SkillMaster sm ON ST1.SkillId = sm.skilliD
                WHERE sm.CategoryId = 4 
                AND EmpEmidsId = EM.EmpeMidsID 
                AND ST1.IsAtive = 1 
                AND ST1.ApprovedDate IS NOT NULL
                FOR XML PATH ('')
            ) AS Certifications
        FROM EmployeeMaster EM
    ) AS C ON E1.EmpeMidsID = C.EmpeMidsID
    LEFT JOIN (
        SELECT 
            R.EmpeMidsID,
            COUNT(*) AS Total,
            SUM(CASE WHEN LEN(R.ProjectKeyResponsibilities) > 0 THEN 1 ELSE 0 END) AS WithResponsibilities
        FROM ResourceAssign R 
        INNER JOIN ProjectMaster PM ON PM.ProjId = R.ProjId
        WHERE R.IsDuplicate = 0
        AND (
            UPPER(PM.ProjName) NOT LIKE '%LAUNCHPAD%' 
            AND UPPER(PM.ProjName) NOT LIKE '%UN-AVAILABLE POOL%' 
            AND UPPER(PM.ProjName) NOT LIKE '%RAMP UP%' 
            AND UPPER(PM.ProjName) NOT LIKE '%RAMP DOWN%'
        )
        GROUP BY R.EmpeMidsID
    ) AS COUNT_RA ON E1.EmpeMidsID = COUNT_RA.EmpeMidsID
    LEFT JOIN (
        SELECT 
            EmployeeId,
            COUNT(*) AS Total,
            SUM(CASE WHEN LEN(keyResponsibilities) > 0 THEN 1 ELSE 0 END) AS WithResponsibilities
        FROM PreviousOrgAssignments
        GROUP BY EmployeeId
    ) AS COUNT_POA ON E1.EmpeMidsID = COUNT_POA.EmployeeId
	LEFT JOIN ResourceAssign RS ON RS.EmpeMidsID = E1.EmpeMidsID AND RS.ReleaseDate >= GETDATE() AND ISDuplicate != 1
	LEFT JOIN ProjectMaster PM ON RS.ProjId = PM.ProjId
    LEFT JOIN CustomerMaster CM ON CM.CustomerID = PM.CustomerId
    WHERE E1.EmpeMidsID IS NOT NULL
	      AND E1.IsActive = 1
          AND CM.CustomerId IN (74, 553, 554, 555)
          AND PM.IsActive = 1;

    SELECT DISTINCT
        E1.CommonName AS [Employee Name],
        E1.EmpEmidsId AS [Employee ID],
        E1.EmpAdSUserAcct + '@emids.com' AS EmpMailId,
        E1.EmpPersonalCellNo AS [Telephone Mobile],
        ISNULL(d.Designation, '') AS [Designation],
        ISNULL(E1.EmpManager, '') AS [Reporting Manager Emp ID],
        ISNULL(E2.CommonName, '') AS [Reporting Manager Name],
        ISNULL(E1.EmpLocation, '') AS [Business Location],
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US, E1.EmpeMidsID), '') AS [Business City],
        ISNULL(CAST(E1.EmpExperience AS FLOAT), 0.0) AS [Past Experience],
        CASE
            WHEN YEAR(E1.LastWorkingDate) = 1900 OR E1.LastWorkingDate IS NULL
            THEN ISNULL(CAST(DATEDIFF(mm, E1.EmpDateofJoin, GETDATE()) AS FLOAT), 0.0)
            ELSE ISNULL(CAST(DATEDIFF(mm, E1.EmpDateofJoin, E1.LastWorkingDate) AS FLOAT), 0.0)
        END AS [eMids Experience],
        CASE
            WHEN E1.EmpGender = 'M' THEN 'Male'
            WHEN E1.EmpGender = 'F' THEN 'Female'
            WHEN E1.EmpGender = 'O' THEN 'Other'
            ELSE ''
        END AS [Gender],
        ISNULL(
            (SELECT dbo.fn_GetProjectsForEmployee(E1.EmpeMidsID)),
            ''
        ) AS [Project Name],
        ISNULL(
            (SELECT [dbo].[fn_GetAccountForEmpId](E1.EmpeMidsID)),
            ''
        ) AS [Account Name],
        ISNULL(dbo.Get_USWorkingCityName(E1.WorkingCity_US, E1.EmpeMidsID), '') AS WorkingCity,
        ISNULL(ER.Role, '') AS EmployeeRole,
        ISNULL(ER.PrimarySkill, '') AS PrimarySkill,
        ISNULL(ER.SecondarySkill, '') AS SecondarySkill,
        ISNULL(ra.WFMSpoc, '') AS WFMSpoc,
        ISNULL(ra.EffectiveTill, NULL) AS EffectiveTill,
        ISNULL(ras.AvailableStatus, 'Available') AS AvailableStatus,
        'AbsoultePath + EmpID' AS Photo,
        E1.EmpShortWriteUp AS 'EmployeeWriteup',
        E1.EmpAdSUserAcct,
        rs.AssignDate,
        rs.ReleaseDate,
        DATEDIFF(DAY, CAST(rs.AssignDate AS DATE), CAST(GETDATE() AS DATE)) AS Aging,
        (SELECT TOP 1 RR.RRNumber
         FROM EmployeeOpportunity EOO
         LEFT JOIN RR_ResourceRequests RR ON EOO.RrId = RR.Id
         LEFT JOIN EmployeeOpportunityStatus EOOS ON EOO.StatusId = EOOS.Id
         WHERE EOOS.Status = 'Earmarked'  
           AND EOO.EmployeeId = E1.EmpeMidsID
         ORDER BY EOO.ModifiedOn DESC
        ) AS RRNumber,
        (SELECT TOP 1 RR.Id
         FROM EmployeeOpportunity EOO
         LEFT JOIN RR_ResourceRequests RR ON EOO.RrId = RR.Id
         LEFT JOIN EmployeeOpportunityStatus EOOS ON EOO.StatusId = EOOS.Id
         WHERE EOOS.Status = 'Earmarked'  
           AND EOO.EmployeeId = E1.EmpeMidsID
         ORDER BY EOO.ModifiedOn DESC
        ) AS RRId,
        (SELECT TOP 1 PM.ProjName
         FROM EmployeeOpportunity EOO
         LEFT JOIN RR_ResourceRequests RR ON EOO.RrId = RR.Id
         LEFT JOIN EmployeeOpportunityStatus EOOS ON EOO.StatusId = EOOS.Id
         LEFT JOIN ProjectMaster PM ON RR.ProjectId = PM.ProjId
         WHERE EOOS.Status = 'Earmarked'  
           AND EOO.EmployeeId = E1.EmpeMidsID
         ORDER BY EOO.ModifiedOn DESC
        ) AS ProjectName,
        PC.AboutPercentage,
        PC.PrimarySkillsPercentage,
        PC.SecondarySkillsPercentage,
        PC.CertificationsPercentage,
        PC.EmidsProjectPercentage,
        PC.PrevProjectPercentage,
        ROUND(PC.TotalProfileCompletenessPercentage, 0) as TotalProfileCompletenessPercentage
    FROM EmployeeMaster E1
    LEFT JOIN EmployeeMaster E2 ON E1.EmpManager = E2.EmpEmidsId
    LEFT JOIN FunctionMaster FM ON ISNULL(E1.EmpFunction, 0) = FM.FunctionId AND FM.IsActive = 1
    LEFT JOIN Designation D ON E1.EmpDesignation = D.DesignationId
    LEFT JOIN Designation D1 ON E2.EmpDesignation = D1.DesignationId
    LEFT JOIN DeptMaster Dept ON Dept.DeptId = E1.EmpDepartment
    LEFT JOIN PracticeAreaMaster P ON E1.PrimaryPracticeArea = P.PracticeAreaId
    LEFT JOIN ResourceAssign RS ON RS.EmpeMidsID = E1.EmpeMidsID AND RS.ReleaseDate >= GETDATE() AND ISDuplicate != 1
    LEFT JOIN ProjectMaster PM ON RS.ProjId = PM.ProjId
    LEFT JOIN CustomerMaster CM ON CM.CustomerID = PM.CustomerId
    LEFT JOIN MasterCustomer MC ON MC.MastCustId = CM.MastCustId
    LEFT JOIN EmployeeRole ER ON E1.EmpeMidsID = ER.EmpeMidsID
    LEFT JOIN ResourceAvailability RA ON E1.EmpeMidsID = RA.EmployeeId
    LEFT JOIN ResourceAvailabilityStatus RAS ON RA.AvailableStatusID = RAS.Id
    LEFT JOIN @ProfileCompleteness PC ON E1.EmpeMidsID = PC.EmpeMidsID
    WHERE E1.IsActive = 1
          AND (@EmployeeId = '-1' OR E1.EmpeMidsID = @EmployeeId)
          AND (@LoginName = '-1' OR E1.EmpAdSUserAcct = @LoginName)
          AND CM.CustomerId IN (74, 553, 554, 555)
          AND PM.IsActive = 1
    ORDER BY E1.CommonName;
END;


