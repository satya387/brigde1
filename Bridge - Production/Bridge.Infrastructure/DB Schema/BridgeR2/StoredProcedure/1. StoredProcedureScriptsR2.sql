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
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID
END

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetCities' AND type = 'P')
	DROP PROCEDURE USP_GetCities
GO

CREATE PROCEDURE [dbo].[USP_GetCities]   
AS    
BEGIN  
  select Id, CityName, 'IN' as Country from Tbl_INDIACitiesMaster union all
  select Id, CityName, 'UK' as Country from Tbl_UKCitiesMaster union all
  select Id, CityName, 'US' as Country from Tbl_USCitiesMaster union all
  select Id, CityName, case when LocationId = 4 then 'CA' when LocationId = 5 then 'RO' when LocationId = 6 then 'AR' when LocationId = 8 then 'ARG' when LocationId = 9 then 'MX' else '' end as Country from tbl_CityMaster;
END

GO
GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetAppliedCountForRRIds' AND type = 'P')
	DROP PROCEDURE USP_GetAppliedCountForRRIds 
GO

CREATE PROCEDURE USP_GetAppliedCountForRRIds
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
	EXEC GetLaunchpadEmployeeDetails_For_WFM '-1','-1';

	SELECT O.RrId, COUNT(O.RrId) AS AppliedResourceRequestIdCount
	FROM EmployeeOpportunity (NOLOCK) O
	INNER JOIN #RRList R On O.RrId = R.RRId
	INNER JOIN @WfmLaunchpadtbl E On E.[Employee ID] = O.EmployeeId
	GROUP BY O.RrId
END

Go


IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_InsertBridgeAppAnalytics' AND type = 'P')
	DROP PROCEDURE USP_InsertBridgeAppAnalytics
GO
CREATE PROCEDURE [dbo].[USP_InsertBridgeAppAnalytics]
(
	@EmployeeId NVARCHAR(25)
	,@EmployeeName	NVARCHAR(100)
	,@IsProfileUpdated BIT
	,@MachineName NVARCHAR(100)
	,@MachineIP	NVARCHAR(100)
	,@BrowserType NVARCHAR(50)
	,@City NVARCHAR(100)
	,@Country NVARCHAR(100)
	,@Latitude NVARCHAR(10)
	,@Longitude NVARCHAR(10)
)
AS
BEGIN

	Declare @TimesLoggedIn AS INT,
			@LastProfileUpdated AS DATETIME = NULL;
	SET @TimesLoggedIn = (Select Count(*)+1 From [BRIDGEAPPANALYTICS](NOLOCK) Where EmployeeId = @EmployeeId);
	
	IF @IsProfileUpdated = 1
	BEGIN
		SET @LastProfileUpdated = GETDATE()
	End
	
	INSERT INTO [BRIDGEAPPANALYTICS] (EmployeeId, EmployeeName, TimesLoggedIn, LastLogin, LastProfileUpdated, MachineName, MachineIP, BrowserType, City, Country, Latitude, Longitude, CreatedOn)
	VALUES (@EmployeeId, @EmployeeName, @TimesLoggedIn, GETDATE(), @LastProfileUpdated, @MachineName, @MachineIP, @BrowserType, @City, @Country, @Latitude, @Longitude, GETDATE())
END

GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_InsertEmployeeOpportunityLog' AND type = 'P')
	DROP PROCEDURE USP_InsertEmployeeOpportunityLog
GO
CREATE PROCEDURE [dbo].[USP_InsertEmployeeOpportunityLog]
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
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
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
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE ID = @ID
END
 

GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW' AND type = 'P')
	DROP PROCEDURE USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW
GO
CREATE PROCEDURE [dbo].[USP_UPDATE_EMPLOYEEOPPORTUNITY_WITHDRAW]
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
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
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
	@RequesterID NVARCHAR(25)
)
AS
BEGIN
	DECLARE @EmpRecordExists int;
	SELECT @EmpRecordExists  = count(*) FROM EmployeeOpportunity WHERE employeeid = @EmployeeId AND RrId = @RrId;
    IF @EmpRecordExists  > 0  
	BEGIN
		UPDATE EmployeeOpportunity
		SET StatusId = @StatusId, AdditionalComments = @AdditionalComments, AllocationPercentage = @AllocationPercentage, AllocationStartDate = @AllocationStartDate, ModifiedOn = GETDATE(), 
		WfmAllocationPercentage = @WfmAllocationPercentage, WfmAllocationStartDate = @WfmAllocationStartDate, ManagerId = @RequesterID
		WHERE EmployeeId = @EmployeeId AND RrId = @RrId;
	END
	ELSE
	BEGIN
		INSERT INTO EmployeeOpportunity (EmployeeId, RrId, StatusId, AllocationPercentage, AllocationStartDate, AdditionalComments, WfmAllocationPercentage, WfmAllocationStartDate, ManagerId, CreatedOn)
		VALUES (@EmployeeId, @RrId, @StatusId, @AllocationPercentage, @AllocationStartDate, @AdditionalComments, @WfmAllocationPercentage, @WfmAllocationStartDate, @RequesterID, GETDATE())
	END
 
	DECLARE @RecordExists int;
	IF @StatusId = 7
	BEGIN
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
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, MANAGERID, WFMALLOCATIONSTARTDATE, WFMALLOCATIONPERCENTAGE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE, MANAGERID, WFMALLOCATIONSTARTDATE, WFMALLOCATIONPERCENTAGE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE EMPLOYEEID = @EMPLOYEEID AND RRID = @RRID;
 
END
 
GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetProjectResources' AND type = 'P')
	DROP PROCEDURE USP_GetProjectResources
GO

CREATE OR ALTER PROCEDURE [dbo].[Usp_getprojectresources] (@EmpeMidsID NVARCHAR(50))
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
             RAY.wfmsuggesteddate
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
  
GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetResourceAllocationDetails' AND type = 'P')
	DROP PROCEDURE USP_GetResourceAllocationDetails
GO
Create PROCEDURE [dbo].[USP_GetResourceAllocationDetails]
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
    WHERE EOS.Status IN ('AllocationRequested', 'Earmarked')
END
 

GO
 
CREATE OR ALTER   PROCEDURE [dbo].[UpsertResourceAvailability] (
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
@ManagerId														  NVARCHAR(25) = null
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
             ManagerId=@ManagerId
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
                              ManagerId 
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
                              @ManagerId
                  );      
    END
 
	/* Make an entry to EMPLOYEEOPPORTUNITYLOG table */
	INSERT INTO EMPLOYEEOPPORTUNITYLOG(EMPLOYEEOPPORTUNITYID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE)
	SELECT ID, EMPLOYEEID, RRID, CREATEDON, CREATEDBY, MODIFIEDON, MODIFIEDBY, DISAPPROVEDBY, STATUSID, COMMENTS, SCHEDULEDDATE, ADDITIONALCOMMENTS, ALLOCATIONPERCENTAGE, ALLOCATIONSTARTDATE FROM EMPLOYEEOPPORTUNITY (NOLOCK)
	WHERE ID = @EmpEarMarkRecordId

	INSERT INTO RESOURCEAVAILABILITYLOG (employeeid, availablestatusid, effectivetill, wfmspoc, CreatedOn, CreatedBy, WFMEmployeeId, ManagerApproveOrWithdrawDate, ReleaseReason, InformedEmployee, WfmSuggestedDate, ManagerId ) 
	SELECT  EmployeeId, AvailableStatusID, EffectiveTill, WFMSpoc, getdate(), CreatedBy, WFMEmployeeId, ManagerApproveOrWithdrawDate, ReleaseReason, InformedEmployee, WfmSuggestedDate, ManagerId FROM ResourceAvailabilityLog (NOLOCK)
	WHERE EmployeeId = @EmployeeId

  END

 
  GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'Upsert_SelfSummaryDeatils' AND type = 'P')
	DROP PROCEDURE Upsert_SelfSummaryDeatils
GO

  Create PROCEDURE Upsert_SelfSummaryDeatils
(
    @EmployeeId NVARCHAR(25) = null,
    @EmployeeSummary NVARCHAR(MAX) = null,
    @ManagerSummary NVARCHAR(MAX) = null,
    @ManagerID NVARCHAR(25) = null
)
AS
BEGIN
    DECLARE @RecordExists INT;

    SELECT @RecordExists = COUNT(*) FROM ResourceAvailability WHERE EmployeeId = @EmployeeId;

    IF @RecordExists > 0
    BEGIN
        IF @ManagerID IS NOT NULL
        BEGIN
            UPDATE ResourceAvailability
            SET ManagerSummary = (@ManagerSummary),
                ModifiedOn = GETDATE(),
				ManagerID = @ManagerID
            WHERE EmployeeId = @EmployeeId;
        END
        ELSE
        BEGIN
            UPDATE ResourceAvailability
            SET EmployeeSummary = (@EmployeeSummary),
                ModifiedOn = GETDATE()
            WHERE EmployeeId = @EmployeeId;
        END
    END
    ELSE
    BEGIN
		INSERT INTO ResourceAvailability (EmployeeId, AvailableStatusID, ModifiedOn, ManagerSummary, EmployeeSummary)
		VALUES (@EmployeeId, 1, GETDATE(), @ManagerSummary, @EmployeeSummary);
    END	
	INSERT INTO ResourceAvailabilityLog (EmployeeId, EffectiveTill, WFMSpoc, ModifiedOn, AvailableStatusID, CreatedOn, CreatedBy, ModifiedBy, WFMEmployeeId, ManagerApproveOrWithdrawDate, ReleaseReason, InformedEmployee, WfmSuggestedDate, EmployeeSummary, ManagerSummary)
    SELECT EmployeeId, EffectiveTill, WFMSpoc, ModifiedOn, AvailableStatusID, CreatedOn, CreatedBy, ModifiedBy, WFMEmployeeId, ManagerApproveOrWithdrawDate, ReleaseReason, InformedEmployee, WfmSuggestedDate, EmployeeSummary, ManagerSummary
    FROM ResourceAvailability
	WHERE EMPLOYEEID = @EMPLOYEEID;
END;
Go

CREATE OR ALTER PROCEDURE [dbo].[USP_GetEmployeeSummary] ( 
@EmployeeId NVARCHAR(25)
)
AS
  BEGIN
     SELECT EmployeeSummary,ManagerSummary FROM [dbo].[ResourceAvailability] WHERE EmployeeID=@EmployeeId
   
  END
Go

 
CREATE OR ALTER PROCEDURE[dbo].[GetEmployeeAssigments] 
	@EmpEmidsID NVARCHAR(100) = NULL,
	@SearchText NVARCHAR(50) = NULL
AS  
BEGIN


DECLARE @pos INT
DECLARE @len INT
DECLARE @value varchar(8000)
set @pos = 0
set @len = 0

	IF @EmpEmidsID IS NOT NULL AND @EmpEmidsID != ''
	BEGIN
		SELECT R.ResAssignId, Em.EmpeMidsID, EM.CommonName, PM.ProjID, Pm.ProjName, Allocation, AssignDate, ReleaseDate, ProjectRole, ProjectSkills, ProjectKeyResponsibilities 
		FROM ResourceAssign R 
		INNER JOIN EmployeeMaster EM ON R.EmpeMidsID = EM.EmpeMidsID 
		INNER JOIN ProjectMaster PM ON PM.ProjId = R.ProjId 
		WHERE IsDuplicate = 0 AND R.EmpeMidsID = @EmpEmidsID 
		AND (upper(ProjName) NOT LIKE '%LAUNCHPAD%' AND upper(ProjName) NOT LIKE '%UN-AVAILABLE POOL%' 
		AND upper(ProjName) NOT LIKE '%RAMP UP%' AND upper(ProjName) NOT LIKE '%RAMP DOWN%')
		ORDER BY ReleaseDate Desc-- (ReleaseDate = GetDate() OR Year(ReleaseDate) = 1900) 
	END
	ELSE IF @SearchText IS NOT NULL AND @SearchText <> ''
	BEGIN
		SET @SearchText = @SearchText+'+'
		 SELECT R.ResAssignId, Em.EmpeMidsID, EM.CommonName, PM.ProjID, Pm.ProjName, Allocation, AssignDate, ReleaseDate, ProjectRole, ProjectSkills, ProjectKeyResponsibilities 
			 into #tmp FROM ResourceAssign R 
			INNER JOIN EmployeeMaster EM ON R.EmpeMidsID = EM.EmpeMidsID 
			INNER JOIN ProjectMaster PM ON PM.ProjId = R.ProjId 
			WHERE 1 =2
		WHILE CHARINDEX('+', @SearchText, @pos+1)>0
		BEGIN
			set @len = CHARINDEX('+', @SearchText, @pos+1) - @pos
			set @value = SUBSTRING(@SearchText, @pos, @len)
			insert into #tmp 
			SELECT R.ResAssignId, Em.EmpeMidsID, EM.CommonName, PM.ProjID, Pm.ProjName, Allocation, AssignDate, ReleaseDate, ProjectRole, ProjectSkills, ProjectKeyResponsibilities 
			FROM ResourceAssign R 
			INNER JOIN EmployeeMaster EM ON R.EmpeMidsID = EM.EmpeMidsID 
			INNER JOIN ProjectMaster PM ON PM.ProjId = R.ProjId 
            INNER JOIN tbl_EmployeeSkillDetails sk ON sk.EmpEmidsID=EM.EmpeMidsID 
			INNER JOIN tbl_SkillMaster sm ON sk.skillId = sm.skilliD
			WHERE IsDuplicate = 0 
            AND PM.IsActive=1 
            AND EM.ResignationType IS NULL 
            AND sk.IsAtive=1 
            AND sk.ApprovedDate IS NOT NULL
            AND	 CONVERT(DATE, R.ReleaseDate) <= DATEADD(WEEK, 3, CONVERT(DATE, GETDATE()+1))
			AND CONVERT(DATE, R.ReleaseDate) >=      GETDATE() 
			AND (R.ProjectKeyResponsibilities LIKE '%'+@value+'%'
			 OR  EM.EmpPermanentAddressPhone LIKE '%'+@value+'%'  OR EM.EmpPersonalCellNo LIKE '%'+@value+'%'  OR EM.EmpCurrentResidencePhone LIKE '%'+@value+'%'  
			 OR EM.EmpShortWriteUp LIKE '%'+@value+'%'
             OR sm.skill LIKE '%'+@value+'%'
			OR R.ProjectRole LIKE '%'+@value+'%' or R.ProjectSkills LIKE '%'+@value+'%' or Pm.ProjName LIKE '%'+@value+'%')
			AND (upper(ProjName) NOT LIKE '%LAUNCHPAD%' AND upper(ProjName) NOT LIKE '%UN-AVAILABLE POOL%' 
			AND upper(ProjName) NOT LIKE '%RAMP UP%' AND upper(ProjName) NOT LIKE '%RAMP DOWN%')

			set @pos = CHARINDEX('+', @SearchText, @pos+@len) +1
		END
		select distinct EmpeMidsID from #tmp 

	END
END
 
GO


CREATE OR ALTER PROCEDURE [dbo].[USP_Get_FutureAvailableresources]
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
        ROW_NUMBER() OVER(PARTITION BY ra.EmpeMidsID ORDER BY ra.ReleaseDate DESC) AS RowNum
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

Go

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetEmployeProjectDetails' AND type = 'P')
	DROP PROCEDURE USP_GetEmployeProjectDetails
GO

CREATE PROCEDURE [dbo].[USP_GetEmployeProjectDetails]
@EmployeeIdList NVARCHAR(MAX) 
AS
BEGIN
IF(@EmployeeIdList !='')
   BEGIN
    DECLARE @SQL NVARCHAR(MAX);

    SET @SQL = '
    WITH LatestRecords AS (
        SELECT 
            R.ResAssignId,
			R.EmpeMidsID,
            PM.ProjID,
            CASE WHEN COUNT(*) OVER(PARTITION BY R.EmpeMidsID) = 1 THEN PM.ProjName 
                 ELSE LAG(PM.ProjName) OVER(PARTITION BY R.EmpeMidsID ORDER BY ReleaseDate) END AS ProjName, 
            AssignDate, 
            ReleaseDate, 
            ProjectRole, 
            ROW_NUMBER() OVER(PARTITION BY R.EmpeMidsID ORDER BY ReleaseDate DESC) AS RowNum
        FROM ResourceAssign R 
        INNER JOIN ProjectMaster PM ON PM.ProjId = R.ProjId 
        WHERE IsDuplicate = 0 
        AND R.EmpeMidsID IN (' + @EmployeeIdList + ')
        AND (UPPER(ProjName) NOT LIKE ''%UN-AVAILABLE POOL%'' 
            AND UPPER(ProjName) NOT LIKE ''%RAMP UP%'' AND UPPER(ProjName) NOT LIKE ''%RAMP DOWN%'')
        GROUP BY R.ResAssignId, R.EmpeMidsID, PM.ProjID, PM.ProjName, AssignDate, ReleaseDate, ProjectRole
    )
    SELECT * 
    FROM LatestRecords 
    WHERE RowNum = 1
    ORDER BY ReleaseDate DESC;';

    EXEC sp_executesql @SQL;
	END
END;

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetResourcesByWFM' AND type = 'P')
	DROP PROCEDURE USP_GetResourcesByWFM
GO

CREATE PROCEDURE [dbo].[USP_GetResourcesByWFM] 
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

 
GO
 
Create OR ALTER PROCEDURE [dbo].[USP_GetActiveResourceRequestsForManagerByManagerID]
    @managerid NVARCHAR(MAX)
 
AS
BEGIN
     Select Distinct
    r.Id,
    r.RRNumber,
    pm.ProjName,
    r.JobTitle,
    r.MusttoHaveSkill,
    r.SecondarySkills,
    pm.Allocation1,
    r.StartDate,
    r.YearsOfExp,
    r.Location,
    r.Role,
    r.RLSTechnology,
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
	EAR.Comments
FROM RR_ResourceRequests (Nolock) r
    INNER Join ProjectMaster (Nolock) pm
        On r.ProjectId = pm.ProjId
    INNER Join RR_RequestStatusMaster (Nolock) rrm
        On r.StatusId = rrm.StatusId
    INNER JOIN ProjectmasterAccess PMA
        ON PMA.ProjID = Pm.ProjId
    LEFT join [EmployeeOpportunity] EAR
        ON EAR.Id = r.Id
    LEFT JOIN [EmployeeOpportunityStatus] ERS
        on EAR.StatusId = ERS.Id
           AND ERS.Status != 'Earmarked'
           AND PMA.RoleID IN ( 1, 2, 3, 4, 5, 6, 7, 8, 10 )
    LEFT JOIN Tbl_INDIACitiesMaster (Nolock) IC
        ON IC.ID = r.CityId
    LEFT JOIN Tbl_USCitiesMaster (Nolock) UC
        ON UC.ID = r.CityId
    LEFT JOIN Tbl_UKCitiesMaster (Nolock) UKC
        ON UKC.ID = r.CityId
    LEFT JOIN tbl_CityMaster (Nolock) CMT
        ON CMT.ID = r.CityId
Where rrm.RRStatus = 'Open'
      And rrm.IsActive = 1
      AND (
              PMA.Enddate >= Getdate()
              OR Year(PMA.EndDate) = 1900
          )
      And (
              pma.EmpeMidsID = @managerid
              OR '-1' = @managerid
          )
 
 print 'Query'
END
 
Go

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'USP_GetResourceRequestDetailsByID' AND type = 'P')
	DROP PROCEDURE USP_GetResourceRequestDetailsByID 
GO

CREATE PROCEDURE [dbo].[USP_GetResourceRequestDetailsByID] @ResourceRequestId INT
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
        emp.EmpMailId as RequesterMailID,
        emp.CommonName as RequesterName,
        pma.EmpeMidsID as ProjectManagerId,
        empl.EmpMailId as ProjectManagerMailID,
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

 
CREATE OR ALTER PROCEDURE [dbo].[USP_GET_RESOURCE_STATUS]
(
    @EmployeeId NVARCHAR(25)
 
)
AS
BEGIN
   IF  EXISTS (SELECT 1 FROM   resourceavailability RA  
		WHERE  RA.EmployeeId = @EmployeeId )
	BEGIN
		SELECT RS.*
		FROM   resourceavailability RA INNER JOIN ResourceAvailabilityStatus RS 
		ON  RA.AvailableStatusID=RS.Id 

		WHERE  RA.EmployeeId = @EmployeeId and RS.AvailableStatus NOT IN( 'Available','Release Requested','Withdrawn','Released','Withdraw Requested')
		
		 
     END
END

 
GO


 GO
  
  
CREATE OR ALTER   PROCEDURE [dbo].[GetAllLaunchpadEmployees]-- '-1', '-1'  

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
          AND CM.CustomerId = 74
          and PM.IsActive = 1
    order by E1.commonname;		  
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
	AND CM.CustomerId = 74 and PM.IsActive = 1
	AND pm.ProjName not like '%Un-available Pool%' 
	) ActiveLaunchpad
	Where (
	( @IsEarmarkedRequired = 1 AND (ActiveLaunchpad.AvailableStatus = 'AVAILABLE' OR ActiveLaunchpad.AvailableStatus = 'Earmarked'))
	OR
	( @IsEarmarkedRequired = 0 AND ActiveLaunchpad.AvailableStatus = 'AVAILABLE')
	)
END
GO