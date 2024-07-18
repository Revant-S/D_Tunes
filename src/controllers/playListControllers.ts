import { Request, Response } from "express";
import { UserRequest } from "../Middlewares/authMiddlewares";
import User from "../DbModels/userModel";
import { userPayload } from "./trackControllers";
import PlayList from "../DbModels/playListModel";
import { FileRequest } from "../Middlewares/uploadService";
import Track from "../DbModels/tracksModel";
import { Types } from "mongoose";
import { UserDocument, getUser } from "./userControllers";
import ReqPlayList from "../DbModels/partyModeReqModel";

export interface playListBody {
    playListName: Types.ObjectId[],
    SongToBeAdded: string
}

export async function getPlayLists(req: Request, res: Response) {
    const playLists = await PlayList.find({ $or: [{ createdBy: ((req as UserRequest).userToken as userPayload)._id }, { status: "Public" }] })
    console.log(playLists);

    res.render("playList", {
        playLists
    })
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
    res.redirect(`/playlists/playListPage/${req.params.playListId}`)
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
    if ((typeof req.body.playListName) === "string") {
        await PlayList.findByIdAndUpdate(body.playListName, { $push: { trackList: trackIDb._id } });
    }
    else {
        body.playListName.forEach(async (playLIstName) => {
            await PlayList.findByIdAndUpdate(playLIstName, { $push: { trackList: trackIDb._id } });
        })
    }

    res.send({ sucess: true, msg: "Song Added to PlayList" })

}
export async function getPLayListPage(req: Request, res: Response) {
    const playListId = req.params.id;
    const playListData: any = await PlayList.findById(playListId); // USED ANY TYPE RECTIFY IT
    if (!playListData) return res.send("Play List Not Found")
    const populatedPlayList = await playListData.populate({
        path: "trackList",
        select: "imageUrl , likes , dislikes , url , id , trackName"
    })
    const user = await User.findById(((req as UserRequest).userToken as userPayload)._id);
    const likedSongs = user?.likedSongs;
    const dislikedSongs = user?.dislikedSongs
    let playListToRender: any = [];
    populatedPlayList.trackList.forEach(async (element: any) => {  // Used ANY RECTIFY IT
        let likedByUser = false;
        let dislikedByUser = false;
        if (likedSongs?.includes(element._id)) likedByUser = true;
        if (dislikedSongs?.includes(element._id)) dislikedByUser = true;
        const obj = {
            id: element.id,
            url: element.url,
            imageUrl: element.imageUrl,
            trackName: element.trackName,
            likedByUser, dislikedByUser
        }
        playListToRender.push(obj)

    });
    res.render("playListPage", {
        populatedPlayList: playListToRender
    })
}
export async function getOtherAllowedPlayLists(user: UserDocument) {
    let playListsRequestedFor: any = [] //USED ANY CORRECT THIS
    const listOfAllowedPlayLists = await ReqPlayList.find({
        requestMadeBy: user._id,
        requestStatus: "Accepted",
    })
    if (listOfAllowedPlayLists.length == 0) return [];
    for (const playList of listOfAllowedPlayLists) {
        await playList.populate([{ path: "playListRequestedFor" }]);
        playListsRequestedFor.push(playList.playListRequestedFor);
    }
    return playListsRequestedFor;
}

export async function partyModePage(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.send("You Dont Exist");
    const playListsOfUser = await PlayList.find({ createdBy: user._id });
    const allowedPlayLists = await getOtherAllowedPlayLists(user)
    if ((allowedPlayLists).length !== 0) {
        allowedPlayLists.forEach((playList: any) => {
            playListsOfUser.push(playList)
        })
    }
    res.render("partyMode", {
        playListsOfUser
    })
}


export async function getTempPage(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.send("No User Found");
    const playLists: Types.ObjectId[] = req.body.data.playLists;
    const selectedSongs = new Set();
    const playListsInDb = await PlayList.find({ _id: { $in: playLists } });
    playListsInDb.forEach(playList => {
        playList.trackList.forEach(track => {
            selectedSongs.add(track)
        })
    })
    const tracks = Array.from(selectedSongs);
    const newPlayList = await PlayList.create({
        createdBy: user._id,
        trackList: tracks,
        playListName: "User-Temp-PlayList"
    })
    res.json({
        newPlayListId: newPlayList._id,
    })
}


export async function partyModePageRedirect(req: Request, res: Response) {
    const user = await getUser(req)
    const populatedPlayList = await PlayList.findById(req.query.id).populate([
        { path: "trackList", select: "imageUrl , likes , dislikes , url , _id , trackName" }
    ]);
    const likedSongs = user?.likedSongs;
    const dislikedSongs = user?.dislikedSongs
    let playListToRender: any = [];
    populatedPlayList?.trackList.forEach(async (element: any) => {  // Used ANY RECTIFY IT
        let likedByUser = false;
        let dislikedByUser = false;
        if (likedSongs?.includes(element._id)) likedByUser = true;
        if (dislikedSongs?.includes(element._id)) dislikedByUser = true;
        const obj = {
            url: element.url,
            imageUrl: element.imageUrl,
            trackName: element.trackName,
            likedByUser, dislikedByUser
        }
        playListToRender.push(obj)

    });
    await PlayList.deleteOne({_id :req.query.id })

    res.render("playListPage", {
        populatedPlayList: playListToRender
    })
}