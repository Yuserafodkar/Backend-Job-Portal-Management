import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()

app.use(express.json()) // for handling JSON data
app.use(express.urlencoded())
app.use(express.static("public/temp"))

app.use(cors({origin: process.env.CORS_ORIGIN}))

app.use(cookieParser())

import employerRouter from "./routes/employer.router.js"
import jobSeekerRouter from "./routes/jobSeeker.router.js"
import applicants  from "./routes/applicants.router.js"
import job from "./routes/job.router.js"


app.use("/api/v1/employer",employerRouter)
app.use("/api/v1/jobseeker",jobSeekerRouter)
app.use("/api/v1/applicants",applicants)
app.use("/api/v1/job",job)



export default app