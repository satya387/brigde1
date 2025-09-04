using Bridge.Infrastructure.Entities;

namespace Bridge.Infrastructure.Interfaces
{
    public interface ISearchSync
    {
        public Task<SearchResult> GlobalSearch(string searchElement, bool isManager, string employeeId);
    }
}
