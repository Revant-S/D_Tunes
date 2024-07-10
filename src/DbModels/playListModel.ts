import mongoose from "mongoose";



const playListSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    trackList: {
        type: [String]
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
    }
}
)

const PlayList = mongoose.model("PlayList", playListSchema)

export default PlayList