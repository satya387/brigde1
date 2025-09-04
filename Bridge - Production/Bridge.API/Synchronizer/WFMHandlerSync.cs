using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;

namespace Bridge.API.Synchronizer
{
    public class WFMHandlerSync : IWFMHandlerSync
    {
        private readonly IWFMHandlerDAO _handlerSync;

        public WFMHandlerSync(IWFMHandlerDAO handlerSync)
        {
            _handlerSync = handlerSync;
        }

        public async Task<List<WFMDetails>> GetWFMTeamList()
        {
            return await _handlerSync.GetWFMTeamList();
        }
        public async Task<int?> SaveResourceAvailability(ResourceAvailability resourceAvailability)
        {
            return await _handlerSync.SaveResourceAvailability(resourceAvailability);
        }

        public async Task<List<LaunchpadEmployee>> GetFutureAvailableResources()
        {
            return await _handlerSync.GetFutureAvailableResources();
        }

        public async Task<List<LaunchpadEmployee>> GetAllAvailableResources()
        {
            return await _handlerSync.GetAllAvailableResources();
        }
        public async Task<List<ReleasedEmployeeResponse>> GetReleasedEmployee()
        {
            return await _handlerSync.GetReleasedEmployee();
        }

        public async Task<List<ResourceAllocationDetails>> GetResourceAllocationDetails()
        {
            return await _handlerSync.GetResourceAllocationDetails();
        }
        /// <summary>
        /// SaveResourceRequestsComments 
        /// </summary>
        /// <param name="resourceRequestsComments">ResourceRequests Comments</param>
        /// <returns>0- Means not inserted , 1 means inserted </returns>
        public async Task<int> SaveResourceRequestsComments(ResourceRequestsComments resourceRequestsComments)
        {

            return await _handlerSync.SaveResourceRequestsComments(resourceRequestsComments);
        }

        public async Task<List<ResourceRequestsComments>> GetResourceComments(int rrid)
        {
            return await _handlerSync.GetResourceComments(rrid);
        }

        public async Task<List<CommentsDeatils>> GetDeclinedAndDroppedComments()
        {
            return await _handlerSync.GetDeclinedAndDroppedComments();
        }

        public async Task<List<DroppedApplications>> GetDroppedApplications()
        {
            return await _handlerSync.GetDroppedApplications();
        }
    }

}