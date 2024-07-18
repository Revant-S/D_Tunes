import mongoose from "mongoose";
const reqSchema = new mongoose.Schema({
    requestMadeBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    playListRequestedFor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PlayList"
    },
    requestStatus : {
        type : String,
        enum : ["Pending" , "Accepted"],
        default : "Pending"
    },

    expiresAt: { type: Date, default: Date.now, index: { expires: '1h' } }

})


const ReqPlayList = mongoose.model("ReqPlayList", reqSchema)

export default ReqPlayList