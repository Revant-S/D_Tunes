import { Model, Types } from "mongoose";

export interface IArtistModel {
    profileImage: string,
    email: string,
    password: string,
    artistName: string,
    songsPublished: Types.ObjectId[],
    followers: Types.ObjectId[]
}

export interface ArtistMethods{
    getAuthToken() : string
}

export type ArtistModel = Model<IArtistModel, {} , ArtistMethods>;


export interface uploadSongBody{
    trackName : string
}