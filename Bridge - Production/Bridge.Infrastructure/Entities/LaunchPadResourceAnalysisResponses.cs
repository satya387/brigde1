using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bridge.Infrastructure.Entities
{
    public class LaunchPadResourceAnalysisResponses
    {
        public int PrimarySkillCount { get; set; }
        public int ScendarySkillCount { get; set; }
        
        public int RoleCount { get; set; }
        public int ExperienceCount { get; set; }
        public List<LaunchPadResourceAnalysisResponse> PrimarySkillsWiseResponsess { get; set; }
        public List<LaunchPadResourceAnalysisResponse> SecWiseResponsess { get; set; }
        public List<LaunchPadResourceAnalysisResponse> RoleWiseResponsess { get; set; }
        public List<LaunchPadResourceAnalysisResponse> ExperienceResponsess { get; set; }
        public int LocationwiseCount { get; set; }
        public List<LaunchPadResourceAnalysisResponse> LocationResponsess { get; set; }
    }

}
