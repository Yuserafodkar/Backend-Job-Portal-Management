import HandleError from "../utils/HandleError.js";
import applicants from "../models/applicants.model.js";
import jwt from "jsonwebtoken"

const ApplicantsAuth = async(req,res,next) =>{


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

        const ApplicantsData = await applicants.findById(decodedToken._id)

        if(!ApplicantsData){
            return res
            .status(400)
            .json(
                new HandleError(400,"Invalid Token!")
            )
        }

        req.applicants = ApplicantsData  
        next()

    }catch(error){
        return res
        .status(400)
        .json(
            new HandleError(400,error?.message)
        )

    }
}

export default ApplicantsAuth