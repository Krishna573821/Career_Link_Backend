import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Cron Automation");

    const jobs = await Job.find({ newsLettersSent: false });

    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });

        for (const user of filteredUsers) {
          try {
            const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
            const message = `
🌟 Exciting New Job Opportunity in Your Niche: ${job.jobNiche} 🌟

--- 

Job Title: ${job.title}  
Company: ${job.companyName}  
Location: ${job.location}  
Job Type: ${job.jobType}  
Salary: ${job.salary}  
${
  job.hiringMultipleCandidates === "Yes"
    ? "📌 This role is hiring multiple candidates!"
    : ""
}

--- 

  
${job.introduction || "An exciting opportunity awaits you!"}

💼 Responsibilities:  
${job.responsibilities}

🎓 Qualifications:  
${job.qualifications}

✨ Perks and Offers:  
${job.offers || "Additional benefits may apply."}

--- 

🔗 Apply Now: If this opportunity aligns with your career goals, don't miss out! Visit the company website or reach out directly to apply.

${
  job.personalWebsite?.url
    ? `🔗 **Company Website**: [${job.personalWebsite.title}](${job.personalWebsite.url})`
    : ""
}

📆 Posted On: ${new Date(job.jobPostedOn).toDateString()}

--- 

We look forward to seeing your application and wish you the best of luck in your job search! 🚀

--- 
*This is an automated job alert based on your niche preferences.*
`;

            await sendEmail({
              email: user.email,
              subject,
              message,
            });
          } catch (emailError) {
            console.error(`Failed to send email to ${user.email}:`, emailError);
          }
        }

        job.newsLettersSent = true;
        await job.save();
      } catch (error) {
        console.log("ERROR IN NODE CRON CATCH BLOCK");
        console.error(error || "Some error in Cron.");
      }
    }
  });
};
