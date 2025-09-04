using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bridge.API.Synchronizer
{
    public class AuthenticationControllerSync : IAuthenticationControllerSync
    {
        private readonly IEmployeeDAO _IEmployeeDAO;
        public AuthenticationControllerSync(IEmployeeDAO iEmployeeDAO)
        {
            _IEmployeeDAO = iEmployeeDAO;
        }
        public async Task<EmployeeAuthenticationDetails> GetEmployeeAuthenticationDetails(string userMailId)
        {
            var getEmployeeAuthenticationDetails = await _IEmployeeDAO.GetEmployeeAuthenticationDetails(userMailId);
            return getEmployeeAuthenticationDetails;
        }
    }
}