using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class ReportParameters
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class DynamicReportParameter
    {
        
        public   string ReportName { get; set; }
       
        public string Parameter { get; set; }
        
        public string ReportType { get; set; } = "Excel";
    }
}
