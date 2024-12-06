import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const employerSchmea = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    phone_no: {
        type: String,
        required: true,
        maxLength: 10,
        minLength: 10,
        index: true
    },
    website: {
        type: String
    },

    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["company", "individual"],
        required: true
    },
    userType: {
        type: String,
        defualt: "employer"
    },

    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 16
    }

}, { timestamps: true })

employerSchmea.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    } else {
        next()
    }
})

employerSchmea.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

employerSchmea.methods.generateAccessToken = function(){
    return jwt.sign(
        {
           _id: this._id,
           email: this.email,
           phone_no: this.phone_no
        },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )

}

const Employer = mongoose.model("Employer", employerSchmea)

export default Employer