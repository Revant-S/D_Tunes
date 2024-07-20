import mongoose from "mongoose";
import { ArtistMethods, ArtistModel, IArtistModel } from "../TsTypes/ArtistTypes";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"
const artistSchema = new mongoose.Schema<IArtistModel, ArtistModel, ArtistMethods>({
    profileImage: {
        type: String
    },
    artistName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    songsPublished: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tracks"
        }],
        default: []
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }
})


artistSchema.pre("save" ,async function () {
    if (!this.isModified("password")) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
})


artistSchema.methods.getAuthToken = function (): string {
    const artistPlayLoad = {
        artistId : this._id,
        artistName : this.artistName,
    }
    return jwt.sign(artistPlayLoad ,config.get("jwtKey") )
}



const Artist = mongoose.model<IArtistModel, ArtistModel>("Artist", artistSchema);

export default Artist