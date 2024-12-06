import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import applicants from "../models/applicants.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


const applyToJob = async (req, res) => {
   

    const { job_id } = req.body;
    if (!job_id) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Job ID is required!")
        );
    }

    if (!req.jobSeeker || !req.jobSeeker._id) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Unauthorized!")
        );
    }


    try {
        const jobDoc = await Job.findById(job_id);
        if (!jobDoc) {
            return res
            .status(400)
            .json(
                new HandleError(400, "Job not found!")
            );
        }

        const existingApplication = await Applicant.findOne({
            applicant_id: req.jobSeeker._id,
            job_id,
        });

        if (existingApplication) {
            return res
            .status(409)
            .json(
                new HandleError(409, "You have already applied for this job!")
            );
        }

        const jobApplication = await Applicant.create({
            applicant_name: req.jobSeeker?.name,
            applicant_id: req.jobSeeker._id,
            phone_no: req.jobSeeker.phone_no,
            email: req.jobSeeker.email,
            resume: req.jobSeeker.resume,
            job_id,
        });

        return res
        .status(201)
        .json(
            new HandleResponse(201, jobApplication, "Application submitted successfully!")
        );
    } catch (error) {
        console.error("Error in applyToJob:", error.message);
        return res
        .status(500)
        .json(
            new HandleError(500, "Internal Server Error!")
        );
    }
};


const getAllApplicationsByApplicantId = async (req, res) => {
  
    try {
        const applications = await Applicant.find();

        if (!applications.length === 0) {
            return res
            .status(400)
            .json(
                new HandleError(400, "No applications found!")
            );
        }

        return res
            .status(200)
            .json(
                new HandleResponse(200, applications, "Applications fetched successfully!")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new HandleError(500, error.message)
            );
    }
};

const getApplicationById = async (req, res) => {
  
    try {
        const { id } = req.params;
        const application = await Applicant.findById(id);

        if (!application) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Application not found!")
                );
        }

        return res
            .status(200)
            .json(
                new HandleResponse(200, application, "Application fetched successfully!")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new HandleError(500, error.message)
            );
    }
};

const deleteJobApplication = async (req, res) => {
 
    try {
        const { id } = req.params;

        const application = await Applicant.findById(id);

        if (!application) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "Application not found!")
                );
        }

        await application.deleteOne();

        return res
            .status(200)
            .json(
                new HandleResponse(200, null, "Application deleted successfully!")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new HandleError(500, error.message)
            );
    }
};

export {
    applyToJob,
    getAllApplicationsByApplicantId,
    getApplicationById,
    deleteJobApplication
};

