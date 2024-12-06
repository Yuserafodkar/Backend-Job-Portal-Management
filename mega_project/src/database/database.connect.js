import mongoose from "mongoose"
import DBName from "../constant.js"

const connectDB =async() => {
    
        try {
            const connectionValue = await mongoose.connect(`${process.env.MONGODB_URL}/${DBName}`)
            console.log(`MongoDB established:: ${connectionValue.connection.host}`)
            
        } catch (error) {
            console.log(`database.connect.js :: connectDB :: Error :: ${error?.message}`)
        }
       
    }
    


export default connectDB