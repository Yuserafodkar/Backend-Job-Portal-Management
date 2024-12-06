import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

       
       const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"raw"})
       console.log("Uploaded to Cloudinary:", response);
       fs.unlinkSync(localFilePath) //not string in disk directly on cloudinary
       return response
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        fs.unlinkSync(localFilePath)
        return error?.message
    }
}

export default uploadOnCloudinary