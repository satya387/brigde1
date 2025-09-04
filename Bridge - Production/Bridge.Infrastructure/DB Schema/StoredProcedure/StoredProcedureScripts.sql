IF EXISTS (SELECT * FROM sys.objects WHERE name = 'Update_ResourceAssign_RoleAndResponsibility_Bridge' AND type = 'P')
	DROP PROCEDURE Update_ResourceAssign_RoleAndResponsibility_Bridge
GO

CREATE PROCEDURE Update_ResourceAssign_RoleAndResponsibility_Bridge 
(
	@EmployeeId NVARCHAR(100),
    @ProjectId NUMERIC(10, 0),
    @ProjectRole NVARCHAR(200),
    @ProjectKeyResponsibilities NVARCHAR(1000),
    @ProjectSkills NVARCHAR(500) 
)
 AS
    UPDATE ResourceAssign
	SET ProjectRole = @ProjectRole,
		Responsibility = @ProjectKeyResponsibilities,
		ProjectSkills = @ProjectSkills
	WHERE EmpeMidsID = @EmployeeId
	AND ProjId = @ProjectId

GO

IF EXISTS (SELECT * FROM sys.objects WHERE name = 'Update_Employee_WriteUp_Bridge' AND type = 'P')
	DROP PROCEDURE Update_Employee_WriteUp_Bridge
GO

CREATE PROCEDURE Update_Employee_WriteUp_Bridge 
(
	@EmployeeId NVARCHAR(100)
	,@EmployeeWriteup NVARCHAR(MAX)
)
AS    
  UPDATE EmployeeMaster_WFM
  SET EmployeeWriteup = @EmployeeWriteup
  WHERE EmployeeId = @EmployeeId 

GO