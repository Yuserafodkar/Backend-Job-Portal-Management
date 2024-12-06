import { Router } from "express";
import { createJob, listAllJobs, getJobById, updateJobById, deleteJobById} from "../controllers/job.controller.js";
import checkJob from "../middlewares/jobAuth.middleware.js"

const router = Router();

router.route("/create").post(createJob);

router.route("/list").get(listAllJobs);

router.route("/:id").get(checkJob, getJobById)  

router.route("/update/:id").patch(checkJob, updateJobById)  

router.route("/delete/:id").delete(checkJob, deleteJobById);  

export default router;

