using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IWFMHandlerDAO
    {
        Task<List<WFMDetails>> GetWFMTeamList();
        Task<int?> SaveResourceAvailability(ResourceAvailability resourceAvailability);
        Task<List<LaunchpadEmployee>> GetFutureAvailableResources();
        Task<List<LaunchpadEmployee>> GetAllAvailableResources(string employeeId = "-1", string loginName = "-1");
        Task<List<ResourceAllocationDetails>> GetResourceAllocationDetails();
        Task<List<ReleasedEmployeeResponse>> GetReleasedEmployee();
        Task<int> SaveResourceRequestsComments(ResourceRequestsComments resourceRequestsComments);
        Task<List<ResourceRequestsComments>> GetResourceComments(int rrid);
        Task<List<CommentsDeatils>> GetDeclinedAndDroppedComments();
        Task<List<DroppedApplications>> GetDroppedApplications();
    }
}