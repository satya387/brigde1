using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Interfaces;

namespace Bridge.API.Synchronizer
{
    /// <summary>
    /// ManagerSync
    /// </summary>
    public class ManagerSync : IManagerSync
    {
        private readonly IManagerDAO _managerResourceDAO;
        public ManagerSync(IManagerDAO managerDAO)
        {
            _managerResourceDAO = managerDAO;
        }

        /// <summary>
        /// GetManagerResources
        /// </summary>
        /// <param name="employeeId">EmployeeId</param>
        /// <returns></returns>
        public async Task<List<ManagerResources>> GetManagerResources(string employeeId)
        {
            return await _managerResourceDAO.GetManagerResources(employeeId);
        }

        /// <summary>
        /// Get Employee Summary
        /// </summary>
        /// <param name="employeeId">Resource Release Request</param>
        /// <returns>EmployeeSummaryResponse</returns>
        public async Task<EmployeeSummaryResponse> GetEmployeeSummary(string employeeId)
        {
            return await _managerResourceDAO.GetEmployeeSummary(employeeId);
        }

        public async Task<int?> UpsertSelfSummary(SelfSummary selfSummary)
        {
            return await _managerResourceDAO.UpsertSelfSummary(selfSummary);
        }
    }
}