using System.Data;

namespace Bridge.Infrastructure.Entities
{
    public class QueryParameters
    {
        public string Value { get; set; }
        public string ValueName { get; set; }
        public DbType ValueType { get; set; }
        public ParameterDirection ValueDirection { get; set; }
    }
}
