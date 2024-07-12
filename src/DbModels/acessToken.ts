import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    access_token : {
        type : String
    },
    time : {
        type : Number,
        default : (new Date()).getTime()
    },
    status : {
        type : String,
        enum : ["expired" , "current"]
    }
})


const Token = mongoose.model("Token" , tokenSchema)

export default Token