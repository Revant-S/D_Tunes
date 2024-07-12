import mongoose, { Schema } from "mongoose";
import { PlayListDocument, PlayListModel } from "../TsTypes/playListTypes";

const playListSchema = new Schema<PlayListDocument>({
  playListName: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  trackList: [{
    type: Schema.Types.ObjectId,
    ref: "Track"
  }],
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
  thumbNailPath: {
    type: String,
    default: "/public/appImages/headphone.jpeg"
  }
});

const PlayList = mongoose.model<PlayListDocument, PlayListModel>("PlayList", playListSchema);

export default PlayList;