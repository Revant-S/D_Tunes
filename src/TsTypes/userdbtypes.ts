import mongoose, {Model} from "mongoose";

export interface IUserModel{
    userName : string,
    emailId : string,
    password : string,
    role : "Artist" | "NormalUser",
    musicPublished : string[],
    likedSongs:string[],
    friends : mongoose.Schema.Types.ObjectId[]
}


export interface IUserMethods{
    getAuthToken() : string
}

export type UserModel = Model<IUserModel, {}, IUserMethods>;