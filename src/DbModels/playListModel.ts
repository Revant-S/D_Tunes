import mongoose from "mongoose";


const playListSchema = new mongoose.Schema({
    playListName : {
        type : String,
        required : true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    trackList: {
        type: [{type : mongoose.Schema.Types.ObjectId , ref : "Track"}],
        default : []
    },
    status: {
        type: String,
        enum: ["Private", "Public"]
    },
    genere: {
        type: String,
        default: "UserDefined"
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0
    },
    thumbNailPath : {
        type : String,
        default : "/public/appImages/headphone.jpeg"
    }
})

const PlayList = mongoose.model("PlayList", playListSchema)

export default PlayList