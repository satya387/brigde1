class Model {
  constructor(job) {
    this.job = job;
  }

  getFormattedDate() {
    const startDate = new Date(this.job.startDate || this.job.projectStartDate);
    const options = { month: "short", day: "numeric" };
    return startDate.toLocaleString(undefined, options);
  }


  getFormattedDate() {
    const startDate = new Date(this.job.startDate || this.job.projectStartDate);
    const options = { month: "short", year: "numeric", day: "numeric" };
    return startDate.toLocaleString(undefined, options);
  }
  getExperienceInYears() {
    return Math.round(this.job.experience / 12);
  }

  getProjectNameAbbreviation() {
    return this.job.projectName || this.job.project || "NA";
  }

  getFirstTwoLetters() {
    return this.getProjectNameAbbreviation().substring(0, 2);
  }

  getPrimarySkills() {
    return this.job.primarySkill ? this.job.primarySkill.split(",") : [];
  }

  getSecondarySkills() {
    return this.job.secondarySkill ? this.job.secondarySkill.split(",") : [];
  }

  getAging() {
    const startDate = new Date(
      this.job?.startDate || this.job?.projectStartDate
    );
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = currentDate - startDate;

    // Convert milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
  }
}

export default Model;
