import connectDB from "./database/database.connect.js";
import dotenv from 'dotenv'
import app from "./app.js"


dotenv.config({ path: "./.env" });


connectDB()
.then(() => {
    console.log('MongoDB Conncted !!!')

    app.listen(process.env.PORT || 3004, () =>{
        console.log(`Server is listining on port ${process.env.PORT || 3004}`)
    })
})
.catch((error) => {
        console.log(error?.message)
    })