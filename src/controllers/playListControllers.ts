import { Request, Response } from "express";
import { UserRequest } from "../Middlewares/aurhMiddlewares";
import User from "../DbModels/userModel";
import { userPayload } from "./trackControllers";
import PlayList from "../DbModels/playListModel";
import { FileRequest } from "../Middlewares/uploadService";
import Track from "../DbModels/tracksModel";
import { Types } from "mongoose";


export interface playListBody {
    playListName: Types.ObjectId[],
    SongToBeAdded: string
}




export async function getPlayLists(req: Request, res: Response) {
    res.render("playList")
}

export async function createPlayList(req: Request, res: Response) {
    const user = (req as UserRequest).userToken
    const UserInDb = await User.findById((user as userPayload)._id)
    const newPlayList = await PlayList.create({
        playListName: req.body.playListName,
        createdBy: UserInDb?._id,
        status: req.body.Acess,
        thumbNailPath: `/public/uploads/${(req as FileRequest).savedFileName}`
    });
    res.send({
        id: newPlayList._id,
        thumbNailURL: newPlayList.thumbNailPath,
        playListName: newPlayList.playListName
    })
}


export async function getTracksOfPlayList(req: Request, res: Response) {
    const playList = await PlayList.findById(req.params.playListId, { trackList: 1, _id: 0 });
    if (!playList) return res.json({ found: false, playlist: {} });
    const populatedPlayList = playList.populate("trackList")
    res.json({
        found: true,
        playList: populatedPlayList
    })
}


export async function getPlayListNames(req: Request, res: Response) {
    const playLists = await PlayList.find({ createdBy: (((req as UserRequest).userToken as userPayload))._id }, { playListName: 1 })
    return res.send(playLists)
}

export async function updatePlayLists(req: Request, res: Response) {
    console.log(typeof req.body.playListName);
    
    const songCard = JSON.parse(req.body.SongToBeAdded);
    console.log(req.body);
    
    const body: playListBody = req.body
    const trackIDb = await Track.findOne({ id: songCard.id })

    if (!trackIDb) return res.send("Song Not Found in Db");
    console.log(body.playListName);
    if ((typeof req.body.playListName)=== "string") {
        await PlayList.findByIdAndUpdate(body.playListName, { $push: { trackList: trackIDb._id } });
    }
    else{
        body.playListName.forEach(async (playLIstName) => {
            await PlayList.findByIdAndUpdate(playLIstName, { $push: { trackList: trackIDb._id } });
        })
    }

    res.send({ sucess: true, msg: "Song Added to PlayList" })

}