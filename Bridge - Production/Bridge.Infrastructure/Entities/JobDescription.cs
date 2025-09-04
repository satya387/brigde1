namespace Bridge.Infrastructure.Entities
{
    public class JobDescription
    {
        public int ID { get; set; }
        public string JobTitle { get; set; }
        public string About { get; set; }
        public string JobSummary { get; set; }
        public string RolesandResponsibilities { get; set; }
        public string MustHaveSkills { get; set; }
        public string NiceToHaveSkills { get; set; }
        public int ExperienceInMonths { get; set; }
        public string PrimarySkill { get; set; }
        public string SecondarySkill { get; set; }
        public DateTime OpenTill { get; set; }
    }
}
