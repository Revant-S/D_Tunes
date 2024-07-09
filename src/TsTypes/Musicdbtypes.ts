import { Types } from "mongoose";

export interface IPlayListModel {
    createdBy : Types.ObjectId,
    trackList : string[],
    status : "Private"|"Public",
    genere? : string,
    likes : number,
    dislikes : number
}