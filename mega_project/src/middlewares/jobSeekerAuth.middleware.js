import HandleError from "../utils/HandleError.js";
import JobSeeker from "../models/jobSeeker.model.js";
import jwt from "jsonwebtoken"

const jobSeekerAuth = async(req,res,next) =>{


    try{
        const token = req.cookies?.accessToken 

        if(!token){
            return res
            .status(400)
            .json(
                new HandleError(400,"Token Expired!!")
            )
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const jobSeekerData = await JobSeeker.findById(decodedToken._id).select("-password")

        if(!jobSeekerData){
            return res
            .status(400)
            .json(
                new HandleError(400,"Invalid Token!")
            )
        }

        req.jobseeker = jobSeekerData    
        next()

    }catch(error){
        return res
        .status(400)
        .json(
            new HandleError(400,error?.message)
        )

    }
}

export default jobSeekerAuth