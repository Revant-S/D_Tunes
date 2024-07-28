import { Request, Response } from "express";
import Track from "../DbModels/tracksModel";
import { UserRequest } from "../Middlewares/authMiddlewares";
import User from "../DbModels/userModel";
import { Types } from "mongoose";
import { UserDocument } from "./userControllers";
import PlayList from "../DbModels/playListModel";

export interface userPayload {
    _id: Types.ObjectId,
    role: "NormalUser" | "Artist",
    iat: number
}

export async function removeFromTheLikedPlayList(id: Types.ObjectId, user: UserDocument) {
    try {
        let  playList  = await PlayList.findOne({ $and: [{ playListName: "Liked Songs" }, { createdBy: user._id }] });
        if (!playList) return ;
        playList.trackList.splice(playList.trackList.indexOf(id) , 1);
        await playList.save()
    } catch (error) {
        console.log(error);
    }
}
export async function AddToTheLikedPlayList(id: Types.ObjectId, user: UserDocument) {
    try {
        let  playList  = await PlayList.findOne({ $and: [{ playListName: "Liked Songs" }, { createdBy: user._id }] });
        if (!playList) return ;
        playList.trackList.push(id)
        await playList.save()
        return
    } catch (error) {
        console.log(error);
    }

}




export async function updateLike(req: Request, res: Response) {
    let amt: number = req.body.data
    const findUser = await User.findById((((req as UserRequest).userToken as userPayload)._id))
    const trackId = req.params.trackId;
    if (!trackId) return res.send("No Id Found");
    if (!findUser) return res.send("You Dont exit !!!!");

    console.log("HERE");
    console.log(trackId);
    
    
    const findTrackInDb = await Track.findOne({ id: trackId })

    console.log(findTrackInDb);
    
    if (!findTrackInDb) return res.send("Track Not in db");
    if (amt > 0) {
        //user has liked the song
        if (findUser?.dislikedSongs.includes(findTrackInDb._id)) {
            findUser.dislikedSongs.splice(findUser.dislikedSongs.indexOf(findTrackInDb._id), 1)
        }
        if (findUser?.likedSongs.includes(findTrackInDb._id)) {
            amt = -1
            findUser.likedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1)
            removeFromTheLikedPlayList(findTrackInDb._id, findUser);
        } else {
            findUser?.likedSongs.push(findTrackInDb._id)
            amt = 1
            AddToTheLikedPlayList(findTrackInDb._id, findUser)
        }
        if (findUser?.dislikedSongs.includes(findTrackInDb._id)) findUser.dislikedSongs.splice(findUser.dislikedSongs.indexOf(findTrackInDb._id), 1);
        (findTrackInDb.likes as number) += amt;

    } else {
        // user disliked the song
        if (findUser?.likedSongs.includes(findTrackInDb._id)) {
            findUser.likedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1)
        }
        if (findUser?.dislikedSongs.includes(findTrackInDb._id)) {
            amt = -1
            await findUser.dislikedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1)
        } else {
            amt = 1
            await findUser?.dislikedSongs.push(findTrackInDb._id)
            removeFromTheLikedPlayList(findTrackInDb._id, findUser)
        }
        if (findUser?.likedSongs.includes(findTrackInDb._id)) findUser.likedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1);
        (findTrackInDb.dislikes as number) += amt;
    }

    await findTrackInDb.save()
    await findUser?.save()
    res.send({ trackUpdated: findTrackInDb, amt })
}


export async function searchTrack(req: Request , res : Response) {
    
}


