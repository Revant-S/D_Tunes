// import axios from "axios";
// import * as sportifyTypes from "../TsTypes/sportifyTypes";
import { Request, Response } from "express";
import Track from "../DbModels/tracksModel"
import { TracksModel } from "../TsTypes/Musicdbtypes";
import User from "../DbModels/userModel";
// import { data } from "../testData";
import { UserRequest } from "../Middlewares/authMiddlewares";
import { userPayload } from "../controllers/trackControllers";
import axios from "axios";
import { getToken } from "./authTokenGeneration";
import fs from "fs"
// import { RequestWithToken } from "../Middlewares/sportifyAcessTokenMiddleware";
interface IUseFulObject {
    TrackName: string,
    track: string,
    images: string,
    id: string
}
interface SendData extends IUseFulObject {
    likedByUser: boolean,
    dislikedByUser: boolean
}

// interface sportifyaxiosResponse {
//     data: { tracks: sportifyTypes.SpotifyResponseForTracks }
// }

export async function appToTrackCollections(useFullArray: IUseFulObject[]) {
    useFullArray.forEach(async (element) => {
        const findTrack = await Track.findOne({ id: element.id })
        if (findTrack) return
        const objAdded: TracksModel = {
            url: element.track,
            id: element.id,
            imageUrl: element.images,
            trackName: element.TrackName
        }
        await Track.create(objAdded);
    })
}
export async function getTracks(req: Request, res: Response) {
    // const acess_Token = (req as RequestWithToken).access_token
    // const response: sportifyaxiosResponse = await axios.get("https://api.spotify.com/v1/search?q=<search_query>&type=track&market=IN&limit=20&offset=0", {
    //     headers: { 'Authorization': `Bearer ${acess_Token}` }
    // });
    // const tracks = response.data.tracks.items
    // let useFullArray: IUseFulObject[] = []

    // tracks.forEach(track => {
    //     if (!track.preview_url) {
    //         return
    //     }
    //     let useOIbj: IUseFulObject = {
    //         TrackName: track.name,
    //         track: track.preview_url,
    //         images: track.album.images[0].url,
    //         id : track.id
    //     }
    //     useFullArray.push(useOIbj)
    // })
    // await appToTrackCollections(useFullArray)

    const dataToSendArray = await Track.find({})
    const dataToSend: SendData[] = [];
    const userLikedSongs = (await User.findById(((req as UserRequest).userToken as userPayload)._id, { likedSongs: 1, dislikedSongs: 1 }))
    let LikedSongs = userLikedSongs?.likedSongs;
    let dislikedSongs = userLikedSongs?.dislikedSongs


    dataToSendArray.forEach(element => {
        let likedByUser = false
        let dislikedByUser = false
        if (LikedSongs?.includes(element._id)) likedByUser = true;
        if (dislikedSongs?.includes(element._id)) dislikedByUser = true;

        let useObj: SendData = {
            TrackName: element.trackName,
            track: element.url,
            images: (element.imageUrl as string),
            id: element.id,
            likedByUser, dislikedByUser
        }
        dataToSend.push(useObj)
    })

    res.send(dataToSend)
    return
}



export async function searchTrack(value: string) {
    const accessToken = await getToken();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${value}&type=track`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const data = JSON.stringify(response.data.tracks.items, null, 2);
    fs.writeFile('track_items.json', data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data has been written to track_items.json');
        }
    });
}