import HandleError from "../utils/HandleError.js";
import HandleResponse from "../utils/HandleResponse.js";
import Employer from "../models/employer.model.js";
import bcrypt from "bcrypt"

const signup = async (req, res) => {

    const { name, email, phone_no, address, status, password } = req.body

    if (!name || !email || !phone_no || !address || !status || !password) {
        return res
            .status(400)
            .json(
                new HandleError(400, "All fields are required!!")
            )
    }

    if (name.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Name should not be empty!!")
            )
    }


    if (!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid E-Mail!!")
            )
    }


    if (String(phone_no).length !== 10) {
        return res
            .status(400)
            .json(
                new HandleError(400, "phone no must be 10 digit long")
            )
    }


    if (address.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Address should not be empty!")
            )
    }

    if (status.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "status should not be empty")
            )
    }


    if (status !== "company" && status !== "individual") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Status shoulde be either company or individual!")
            )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should be 9 to 16 digit long!")
            )
    }

    const isExistiedEmployeer = await Employer.findOne({ $or: [{ email }, { phone_no }] })

    if (isExistiedEmployeer) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Already have an Account! Please go for signin!!")
            )
    }

    const employeer = await Employer.create(
        {
            name: name,
            email: email,
            phone_no: phone_no,
            address: address,
            status: status,
            password: password

        }

    )
    const createEmployer = await Employer.findById(employeer._id).select("-password")

    if (!createEmployer) {
        return res
            .status(500)
            .json(
                new HandleError(500, "something is went wrong while creating employer's account!")
            )
    }
    return res
        .status(201)
        .json(
            new HandleResponse(200, createEmployer, "Account created successfully!")
        )


}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res
            .status(400)
            .json(
                new HandleError(200, "All fields are required!!")
            )
    }

    if (email.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(200, "Email is required!!")
            )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
            .status(400)
            .json(
                new HandleError(200, "Passowrd must be 8 to 16 digit long!!")
            )
    }

    const employerData = await Employer.findOne({ email: email.trim() }).select()

    if (!employerData) {
        return res
            .status(400)
            .json(
                new HandleError(200, "Account not exists! Please create an account")
            )
    }
    const isCorrectPassword = await employerData.comparePassword(password, employerData.password)

    if (!isCorrectPassword) {
        return res
            .status(400)
            .json(
                new HandleError(200, "Invalid password!")
            )
    }
    const accessToken = employerData.generateAccessToken()

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new HandleResponse(200, {}, "Login successfully!!")
        )
}

const logout = async (req, res) => {
    if (!req?.employer) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You haven't logged in yet !")
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
            new HandleResponse(200, {}, "logged out successfully!")
        )

}

const currentEmployee = async (req, res) => {
    return res
        .status(200)
        .json(
            new HandleResponse(200, req?.employer, "Current employeer fetched successfully!")
        )
}

const updateDetails = async (req, res) => {
    const { name, email, phone_no, website} = req.body


    if (!name && !email && !phone_no && !website && !password) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You have to provide alteast 1 field!")
            )
    }

    if (name && name.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Name should not be empty !")
            )
    }

    if (email && !/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid E-Mail")
            )
    }

    if (phone_no && phone_no?.trim()?.length !== 10) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid Phone Number!")
            )
    }

    if (website && !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(website?.trim())) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid Website URL")
            )
    }


    const employeerData = await Employer.findById(req.employer._id)

    employeerData.name = name?.trim() === "" ? employeerData.name : name?.trim()
    employeerData.email = email?.trim() === "" ? employeerData.email : email?.trim()
    employeerData.phone_no = phone_no?.trim() === "" ? employeerData.phone_no : phone_no?.trim()
    employeerData.website = website?.trim() === "" ? employeerData.website : website?.trim()
   

    await employeerData.save({ validateBeforeSave: false })

    const updateData = await Employer.findById(req.employer._id)

    return res
        .status(200)
        .json(
            new HandleResponse(
                200,
                updateData,
                "Details updated successfully!"
            )
        )
}

const updatePassword = async (req, res) => {
    const { password } = req.body

    if (!password) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password requires!!")
            )
    }

    if (password.trim() === "") {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should not be empty!!")
            )
    }

    if (password.trim()?.length < 8 || password.trim()?.length > 16) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Password should be 8 to 16 digits long!!")
            )
    }

    const encryptedPassword = await bcrypt.hash(password?.trim(), 10)

    const data = await Employer.findByIdAndUpdate(
        req.employer._id,
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
            new HandleResponse(200, data, "Password updated successfully!!")
        )

}

const deleteAccount = async (req, res) => {
    if (!req?.employer) {
        return res
            .status(400)
            .json(
                new HandleError(400, "You have not logged in!!")
            )
    }

    const employerData = await Employer.findByIdAndDelete(req.employer._id)

    if (!employerData) {
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
    currentEmployee,
    updateDetails,
    updatePassword,
    deleteAccount
}


