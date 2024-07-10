import { Types } from "mongoose";

export interface PlayListModel {
    createdBy : Types.ObjectId,
    trackList : string[],
    status : "Private"|"Public",
    genere? : string,
    likes : number,
    dislikes : number
}

export interface TracksModel{
    url : string,
    id : string,
    likes? : number,
    dislikes? : number,
    imageUrl? : string,
    trackName : string
}