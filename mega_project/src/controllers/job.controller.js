import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import Job from "../models/Jobs.model.js";

const createJob = async (req, res) => {
    try {
      
        const { title, experience, salary, skills, job_location, description, vacancy, company_details } = req.body;

        if (!title || !experience || !salary || !description || !vacancy) {
            return res
            .status(400)
            .json(
                new HandleError(400, "All required fields are required")
            );
        }

        const newJob = new Job({
            title,
            experience,
            salary,
            skills,
            job_location,
            description,
            vacancy,
            company_details,
            date_of_post: new Date()
        });

        await newJob.save();

        return res
        .status(201)
        .json(
            new HandleResponse(201, newJob, "Job post created successfully")
        );

    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, error.message)
        );
    }
};

const listAllJobs = async (req, res) => {
    try {
      
        const jobs = await Job.find();
        
        if (jobs.length === 0) {
            return res
            .status(400)
            .json(
                new HandleError(400, "No jobs found!")
            );
        }

        return res
        .status(200)
        .json(
            new HandleResponse(200, jobs, "Jobs fetched successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

const getJobById = async (req, res) => {
    try {
      
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        return res
        .status(200)
        .json(
            new HandleResponse(200, job, "Job fetched successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

const updateJobById = async (req, res) => {
    try {
      
        const { title, experience, salary, skills, job_location, description, vacancy, company_details } = req.body;

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found")
            );
        }

        job.title = title || job.title;
        job.experience = experience || job.experience;
        job.salary = salary || job.salary;
        job.skills = skills || job.skills;
        job.job_location = job_location || job.job_location;
        job.description = description || job.description;
        job.vacancy = vacancy || job.vacancy;
        job.company_details = company_details || job.company_details;

        await job.save();

        return res
        .status(200)
        .json(
            new HandleResponse(200, job, "Job updated successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

const deleteJobById = async (req, res) => {
    try {
       
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        return res
        .status(200)
        .json(
            new HandleResponse(200, null, "Job deleted successfully!")
        );
    } catch (error) {
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};

export {
    createJob,
    listAllJobs,
    getJobById,
    updateJobById,
    deleteJobById
};
