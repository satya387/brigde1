IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ResourceAvailabilityStatus')
Begin

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Available' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Available'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Unavailable Pool' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Unavailable Pool'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Maternity Leave' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Maternity Leave'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Earmarked' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Earmarked'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'PIP' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'PIP'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Customer interview' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Customer interview'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Resigned' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Resigned'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus]  = 'Release Requested' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Release Requested'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Withdrawn' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Withdrawn'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Released' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Released'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Furlough' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Furlough'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Undergoing Training' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Undergoing Training'

IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Partial allocation' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Partial allocation'
End


go

IF  EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'EmployeeOpportunityStatus')
Begin

IF NOT EXISTS (SELECT id FROM EmployeeOpportunityStatus WHERE [Status] = 'Earmarked' )
INSERT INTO EmployeeOpportunityStatus ([Status])
SELECT 'Earmarked'


IF NOT EXISTS (SELECT id from EmployeeOpportunityStatus where [Status] = 'L2Discussion' )
insert into EmployeeOpportunityStatus ([Status])
SELECT 'L2Discussion'

Update EmployeeOpportunityStatus SET Status = 'AllocationRequested' Where ID = 5;
Update EmployeeOpportunityStatus SET Status = 'Earmarked' Where ID = 7;

End
Go

go