import { Request, Response } from "express";
import { UserRequest } from "../Middlewares/aurhMiddlewares";

import User from "../DbModels/userModel";
import { userPayload } from "./trackControllers";
import PlayList from "../DbModels/playListModel";
import { FileRequest } from "../Middlewares/uploadService";

export async function getPlayLists(req : Request,res : Response) {
    res.render("playList")
}

export async function createPlayList(req : Request , res : Response) {
    const user = (req as UserRequest).userToken
    const UserInDb = await User.findById((user as userPayload)._id)
    const newPlayList = await PlayList.create({
        playListName: req.body.playListName,
        createdBy : UserInDb?._id,
        status : req.body.Acess,
        thumbNailPath : `/public/uploads/${(req as FileRequest).savedFileName}`
    });
    res.send({
        id : newPlayList._id,
        thumbNailURL : newPlayList.thumbNailPath,
        playListName : newPlayList.playListName
    })
}


export async function getTracksOfPlayList(req : Request , res : Response) {
    const playList = await PlayList.findById(req.params.playListId , {trackList : 1 , _id : 0});
    if (!playList) return res.json({found : false , playlist :{}});
    const populatedPlayList = playList.populate("trackList") 
    res.json({
        found: true,
        playList :populatedPlayList
    })
}