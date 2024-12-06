import {Router} from "express"
import {signup,login,logout,currentJobSeeker,deleteAccount, updateDetails, updatePassword, updateResume} from "../controllers/jobSeeker.controller.js"
import upload from "../middlewares/multer.middleware.js"
import jobSeekerAuth from "../middlewares/jobSeekerAuth.middleware.js"

const router = Router()

router.route("/signup").post(upload.single("resume"),signup)

router.route("/login").post(login)

router.route("/logout").get(jobSeekerAuth,logout)

router.route("/current-jobSeeker").get(jobSeekerAuth,currentJobSeeker)

router.route("/update").patch(jobSeekerAuth,updateDetails)

router.route("/update/password").patch(jobSeekerAuth,updatePassword)

router.route("/update-Resume").patch(upload.single("resume"),jobSeekerAuth,updateResume)

router.route("/delete").delete(jobSeekerAuth,deleteAccount)

export default router