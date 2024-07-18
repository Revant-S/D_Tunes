import mongoose from "mongoose";

export interface IReqPlayList {
  requestMadeBy: mongoose.Types.ObjectId | null | undefined;
  playListRequestedFor: mongoose.Types.ObjectId | null | undefined;
  requestStatus: "Pending" | "Accepted";
  timeMade: number;
}

export interface IReqPlayListDocument extends IReqPlayList, mongoose.Document { }

export interface IReqPlayListModel extends mongoose.Model<IReqPlayListDocument> { }