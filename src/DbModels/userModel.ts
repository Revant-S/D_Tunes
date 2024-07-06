import mongoose from "mongoose";
import { IUserMethods, IUserModel, UserModel } from "../TsTypes/userdbtypes";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
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
        type : [String],
        default : []
    },
    musicPublished : {
        type : [String],
        default : []
    },
    friends : {
        type : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}],
        default : []
    }
})


userSchema.pre("save",async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password , salt)
})

userSchema.methods.getAuthToken = function getAuthToken() :string {
    const payload = {
        _id : this._id,
        role : this.role,
    }
    const token = jwt.sign(payload , "THESECRETKEY")
    return token
}



const User = mongoose.model<IUserModel , UserModel>("User" , userSchema)

export default User