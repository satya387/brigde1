using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface IManagerSync
    {
        Task<List<ManagerResources>> GetManagerResources(string employeeId);
        Task<EmployeeSummaryResponse> GetEmployeeSummary(string employeeId);
        Task<int?> UpsertSelfSummary(SelfSummary selfSummary);
    }
}