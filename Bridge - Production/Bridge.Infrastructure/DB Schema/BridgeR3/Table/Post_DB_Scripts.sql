IF NOT EXISTS (SELECT id FROM ResourceAvailabilityStatus WHERE [AvailableStatus] = 'Release Rejected' )
INSERT INTO ResourceAvailabilityStatus ([AvailableStatus])
SELECT 'Release Rejected'

INSERT INTO BridgeConfigSettings (Name, Value)
VALUES ('MaxAppliedOpportunityNumber', '3');

INSERT INTO BridgeConfigSettings (Name, Value)
VALUES ('CacheExpiryInMinutes', '1440');