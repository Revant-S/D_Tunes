import  {Model, Types} from "mongoose";

export interface IUserModel{
    userName : string,
    emailId : string,
    password : string,
    role : "Artist" | "NormalUser",
    musicPublished : Types.ObjectId[],
    likedSongs:Types.ObjectId[],
    dislikedSongs : Types.ObjectId[]
    friends : Types.ObjectId[]
    friendRequestToMe : Types.ObjectId[]
    friendRequestMade : Types.ObjectId[]
}


export interface IUserMethods{
    getAuthToken() : string
}

export type UserModel = Model<IUserModel, {}, IUserMethods>;