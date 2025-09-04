using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class SkillsResponse
    {
        public string Skills { get; set; }
        public int SkillCount { get; set; }
        public List<AnalysisResponse> SkillWiseListofEmployee { get; set; }

    }
}
