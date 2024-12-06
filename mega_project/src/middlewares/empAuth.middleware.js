import HandleError from "../utils/HandleError.js"
import jwt from "jsonwebtoken"
import Employer from "../models/employer.model.js"



const empAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken //cookies name access token 

        if (!token){
            return res
                .status(400)
                .json(
                    new HandleError(400, "token expired!!")
                )

            }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const employeeData = await Employer.findById(decodedToken._id).select("-password")

        if (!employeeData) {
            return res
                .status(400)
                .json(
                    new HandleError(400, "invalid token")
                )
        }

        req.employer = employeeData
        next()
    }

    catch (error) {
        return res
            .status(400)
            .json(
                new HandleError(400, error?.message)
            )
    }
}


    export default empAuth