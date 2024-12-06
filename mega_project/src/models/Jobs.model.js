import mongoose,{Schema} from "mongoose";

const JobsSchema = new Schema({
    
    title: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    skills: [
        {
            type: String
        }
    ],
    job_location: {
        type: String,
        enum: ["remote", "hybrid", "onsite"]
    },
    description: {
        type: String,
        required: true
    },
    vacancy: {
        type: Number,
        required: true
    },
    date_of_post: {
        type: Date,
        required: true
    },
    company_details: {
        type: String,
        required: true
    }
})

const Job = mongoose.model("Job",JobsSchema)

export default Job