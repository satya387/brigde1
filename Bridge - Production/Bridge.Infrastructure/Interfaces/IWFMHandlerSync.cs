using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IWFMHandlerSync
    {
        Task<List<WFMDetails>> GetWFMTeamList();
        Task<int?> SaveResourceAvailability(ResourceAvailability resourceAvailability);
        Task<List<LaunchpadEmployee>> GetFutureAvailableResources();
        Task<List<LaunchpadEmployee>> GetAllAvailableResources();
        Task<List<ResourceAllocationDetails>> GetResourceAllocationDetails();         
        Task<List<ReleasedEmployeeResponse>> GetReleasedEmployee();
        Task<int> SaveResourceRequestsComments(ResourceRequestsComments resourceAvailability);
        Task<List<ResourceRequestsComments>> GetResourceComments(int rrid);
        Task<List<CommentsDeatils>> GetDeclinedAndDroppedComments();
        Task<List<DroppedApplications>> GetDroppedApplications();
    }
}
