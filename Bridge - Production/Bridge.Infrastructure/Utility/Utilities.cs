using Bridge.Infrastructure.Entities;
using Bridge.Infrastructure.Entities.Constant;
using System.Data;
using System.Diagnostics.CodeAnalysis;

namespace Bridge.Infrastructure.Utility
{
    [ExcludeFromCodeCoverage]
    public class Utilities
    {

        public static bool SearchInCommaSeparatedValues(string skills, string searchElement)
        {
            if (string.IsNullOrEmpty(skills))
                return false;

            string[] skillArray = skills.Split(',');

            foreach (var skill in skillArray)
            {
                if (skill.ToLower().Contains(searchElement))
                    return true;
            }

            return false;
        }
        public static string Base64Encode(string text)
        {
            var textBytes = System.Text.Encoding.UTF8.GetBytes(text);
            return System.Convert.ToBase64String(textBytes);
        }
        public static string Base64Decode(string base64)
        {
            var base64Bytes = System.Convert.FromBase64String(base64);
            return System.Text.Encoding.UTF8.GetString(base64Bytes);
        }

        public static string CheckDBNullForString(DataRow row, string value)
        {
            return row.Table.Columns.Contains(value) && row[value] != null && row[value] is not DBNull ? row[value].ToString() : String.Empty;
        }
        public static bool CheckDBNullForBool(DataRow row, string value)
        {
            return row.Table.Columns.Contains(value) && row[value] != null && row[value] is not DBNull ? Convert.ToBoolean(row[value]) : false;
        }
        public static int? CheckDBNullForInt(DataRow row, string value)
        {
            return row.Table.Columns.Contains(value) && row[value] != null && row[value] is not DBNull ? Convert.ToInt32(row[value].ToString()) : null;
        }
        public static DateTime? CheckDBNullForDate(DataRow row, string value)
        {
            return row.Table.Columns.Contains(value) && row[value] != null && row[value] is not DBNull ? Convert.ToDateTime(row[value].ToString()) : null;
        }

        public static bool GetMatchIndicator(ResourceRequest resourceRequest, Employee employee)
        {
            string matchCriteria = "No Matching Criteria Found!";
            int matchPercentage = 0;
            var reqExp = resourceRequest.Experience != null && resourceRequest.Experience > 0 ? resourceRequest.Experience.Value : 0;
            var empExp = (employee.EmidsExperience + employee.PastExperience) / 12;
            if (CompareCriterias(resourceRequest.PrimarySkill, employee.PrimarySkills))
            {
                matchPercentage = 50;
                matchCriteria = UtilityConstant.PrimarySkill;

                if (!string.IsNullOrEmpty(resourceRequest.SecondarySkill) && !string.IsNullOrEmpty(employee.SecondarySkills))
                {
                    var requestSkills = resourceRequest.SecondarySkill.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(skill => skill.Trim().ToLower()).ToArray();
                    var employeeSkills = employee.SecondarySkills.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(skill => skill.Trim().ToLower()).ToArray();
                    var equalElements = requestSkills.Zip(employeeSkills, (i, j) => i == j).Count(eq => eq);
                    if (equalElements > 1)
                    {
                        matchPercentage += 15;
                        matchCriteria += "," + UtilityConstant.SecondarySkill;
                    }
                }
                if (CompareCriterias(resourceRequest.Designation, employee.Designation))
                {
                    matchPercentage += 10;
                    matchCriteria += "," + UtilityConstant.Designation;
                }
                if (CompareCriterias(resourceRequest.Location, employee.Location))
                {
                    matchPercentage += 10;
                    matchCriteria += "," + UtilityConstant.Location;
                }
                if (empExp >= reqExp - 12 && empExp <= reqExp + 12)
                {
                    matchPercentage += 15;
                    matchCriteria += "," + UtilityConstant.Experience;
                }
                employee.MatchPercentage = matchPercentage;
                employee.MatchCriteria = matchCriteria;
                resourceRequest.MatchPercentage = matchPercentage;
                resourceRequest.MatchCriteria = matchCriteria;
                return true;
            }
            return false;
        }

        private static bool CompareCriterias(string resource, string employee)
        {
            if (!string.IsNullOrWhiteSpace(resource) && resource.ToLower() == employee.ToLower())
                return true;
            return false;
        }
    }
}
