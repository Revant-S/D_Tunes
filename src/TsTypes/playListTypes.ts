import { Types, Document, Model } from "mongoose";

export interface IPlayList {
  playListName: string;
  createdBy: Types.ObjectId;
  trackList: Types.ObjectId[];
  status: "Public" | "Private";
  genere: string;
  likes?: number;
  dislikes?: number;
  thumbNailPath: string;
  requestsForMerge : Types.ObjectId[]
}

export interface PlayListDocument extends IPlayList, Document {}

export interface PlayListModel extends Model<PlayListDocument> {
}