import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import JobSeeker from "../models/jobSeeker.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import bcrypt from "bcrypt"

const signup = async (req, res) => {

    const { name, email, phone_no, gender, education, experience, location, password } = req.body

    if (!name || !email || !phone_no || !gender || !education || !experience || !location || !password) {
        return res
            .status(400)
            .json(
                new HandleError(400, "All filds are required!!")
            )
    }

    if (name.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Name should not be empty!!")
            )
    }

    if (email.trim() === " ") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Email should not be empty!!")
            )
    }

    if (String(phone_no).length !== 10) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Phone no must be 10 digit long!!")
            )
    }

    if (gender.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Gender should not be empty!!")
            )
    }

    if (education.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Education should not be empty!! ")
            )

    }

    if (!experience || String(experience).trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Experience should not be empty!!")
            )
    }

    if (location.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Location should not be empty!!")
            )
    }

    if (password.trim().length < 8 || password.trim().length > 16) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should be 8 to 156 digit long!!")
            )
    }


    const resume = req.file

    console.log(resume)

    const response = await uploadOnCloudinary(resume.path)

    console.log(response)

    if (!response) {
        return res
            .status(500)
            .json(
                new HandleError(500, "Something went wrong while uploading resume!!")
            )
    }

    const isExistedJobSeeker = await JobSeeker.findOne({ $or: [{ email }, { phone_no }] })

    if (isExistedJobSeeker) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Already have an account! Please go for signin!!")
            )
    }

    const jobeeker = await JobSeeker.create(
        {
            name: name,
            email: email,
            phone_no: phone_no,
            gender: gender,
            education: education,
            experience: experience,
            location: location,
            password: password,
            resume: response.secure_url
        }
    )
    const isCreated = await JobSeeker.findById(jobeeker._id).select("-password")

    if (!isCreated) {
        return res
            .status(500)
            .json(
                new HandleError(400, "Something went wrong while creating account!!")
            )
    }

    return res
        .status(201)
        .json(
            new HandleResponse(200, isCreated, "Profile created successfully!!")
        )
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res
            .status(400)
            .json(
                new HandleError(400, "All fiels are required")
            )
    }

    if (email.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Email is required")
            )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should be 8 to 16 digits long!!")
            )
    }

    const jobseekerData = await JobSeeker.findOne({ email: email.trim() })

    if (!jobseekerData) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Account not exist!Please create an account!")
            )
    }

    const isCorrectPassword = await jobseekerData.comparePassword(password, jobseekerData.password)

    if (!isCorrectPassword) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid password!")
            )
    }

    const accessToken = jobseekerData.generateAccessToken()

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new HandleResponse(200, {}, "login Sucessfully!")
        )
}

const logout = async (req, res) => {
    if (!req?.jobseeker) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You Haven't logged in yet")
            )
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(
            new HandleResponse(200, {}, "Logged out sucessfully!!")
        )
}

const updateDetails = async (req, res) => {
    const { name, email, phone_no, education, experience, location } = req.body

    if (!name && !email && !phone_no && !education && !experience && !location) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You have to provide alteast on 1 field!!")
            )
    }

    if (name && name.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Name should not be empty!!")
            )
    }

    if (email && !/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email?.trim())) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid Email")
            )
    }

    if (phone_no && phone_no?.trim()?.length !== 10) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Inavlid Phone Number!!")
            )
    }

    if (education && education.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Education should not be empty!!")
            )
    }

    if (experience && String(experience).trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Experience Should not be empty!!")
            )
    }

    if (location && location.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Location should not be empty!!")
            )
    }

    const jobseekerData = await JobSeeker.findById(req.jobseeker._id)

    jobseekerData.name = name?.trim() === "" ? jobseekerData.name : name?.trim()
    jobseekerData.email = email?.trim() === "" ? jobseekerData.email : email?.trim()
    jobseekerData.phone_no = phone_no?.trim() === "" ? jobseekerData.phone_no : phone_no?.trim()
    jobseekerData.experience = experience?.trim() === "" ? jobseekerData.experience : experience?.trim()
    jobseekerData.education = education?.trim() === "" ? jobseekerData.education : education?.trim()
    jobseekerData.location = location?.trim() === "" ? jobseekerData.location : location?.trim()


    await jobseekerData.save({ validateBeforeSave: false })

    const updateData = await JobSeeker.findById(req.jobseeker._id)

    return res
        .status(200)
        .json(
            new HandleResponse(200, updateData, "Details updated successfully!")
        )
}

const updatePassword = async (req, res) => {
    const { password } = req.body

    if (!password) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password Required!!")
            )
    }

    if (password?.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should not be empty!!")
            )
    }

    if (password?.trim().length < 8 || password?.trim().length > 10) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should be 8 to 10 digit long!!")
            )
    }

    const encryptedPassword = await bcrypt.hash(password?.trim(), 10)

    const data = await JobSeeker.findByIdAndUpdate(
        req.jobseeker._id,
        {
            $set: {
                password: encryptedPassword
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new HandleResponse(200, data, "Password updated successfully")
        )
}

const updateResume = async (req, res) => {
    const resume = req.file
    console.log(resume)

    const response = await uploadOnCloudinary(resume.path);
     
    console.log(resume)
    if (!response) {
        return res
            .status(500)
            .json(
                new HandleError(500, "Something went wrong while uploading resume!")
            )
    }

    const Resumeupdate = await JobSeeker.findByIdAndUpdate(
        req.jobseeker._id,
        {
            $set: {
                resume: response.secure_url
            }
        },
        {
            new: true
        }
    )

    if (!Resumeupdate) {
        return res
            .status(404)
            .json(
                new HandleError(404, "Job seeker not found!!")
            )
    }

    return res
        .status(200)
        .json(
            new HandleResponse(200, updateResume, "Resume updated successfully")
        )

}


const currentJobSeeker = async (req, res) => {
    return res
        .status(200)
        .json(
            new HandleError(200, req?.jobseeker, "Current jobseeker fetch successfully!!")
        )
}

const deleteAccount = async (req, res) => {
    if (!req?.jobseeker) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You have not logged in!!")
            )
    }

    const jobseekerData = await JobSeeker.findByIdAndDelete(req.jobseeker._id)

    console.log(jobseekerData)
    if (!jobseekerData) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Account not found or already deleted!!")
            )
    }


    return res
        .status(200)
        .json(
            new HandleResponse(200, "Account deleted successfully!!")
        )
}

export {
    signup,
    login,
    logout,
    currentJobSeeker,
    updateDetails,
    updatePassword,
    updateResume,
    deleteAccount
}