import mongoose from "mongoose";
import { IUserMethods, IUserModel, UserModel } from "../TsTypes/userdbtypes";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import config  from "config";

const userSchema = new mongoose.Schema<IUserModel, UserModel, IUserMethods>({
    userName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    emailId: {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : String,
        enum : ["Artist" , "NormalUser"],
        default : "NormalUser"
    },
    likedSongs : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Track"
        }],
        default : []
    },
    dislikedSongs: {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Track"
        }],
        default : []
    },

    musicPublished : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Track"
        }],
        default : []
    },
    friends : {
        type : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}],
        default : []
    },
    friendRequestToMe : {
        type : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}],
        default : []
    },
    friendRequestMade : {
        type : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}],
        default : []
    },
    profileImageUrl :{
        type : String,
        default : "/public/appImages/headphone.jpeg"
    }

})


userSchema.pre("save",async function () {
    if (!this.isModified('password')) return  ;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
})

userSchema.methods.getAuthToken = function getAuthToken() :string {
    const payload = {
        _id : this._id,
        role : this.role,
    }
    const token = jwt.sign(payload , config.get("jwtKey"))
    return token
}



const User = mongoose.model<IUserModel , UserModel>("User" , userSchema)

export default User