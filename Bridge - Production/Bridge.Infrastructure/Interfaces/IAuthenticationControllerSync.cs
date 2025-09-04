using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IAuthenticationControllerSync
    {
        public Task<EmployeeAuthenticationDetails> GetEmployeeAuthenticationDetails(string userMailId);
    }
}
