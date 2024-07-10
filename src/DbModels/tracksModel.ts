import mongoose from "mongoose";
import { TracksModel } from "../TsTypes/Musicdbtypes";
const trackSchema = new mongoose.Schema<TracksModel>({
    trackName:{
        type: String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    },
    likes : {
        type : Number,
        default : 0
    },
    dislikes : {
        type : Number,
        default : 0
    },
    imageUrl : {
        type : String
    },
})




const Track = mongoose.model("Track" , trackSchema)

export default Track