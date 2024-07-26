import { Request, Response } from "express";
import Track from "../DbModels/tracksModel"
import { TracksModel } from "../TsTypes/Musicdbtypes";
import User from "../DbModels/userModel";
import axios from "axios";
import { RequestWithToken } from "../Middlewares/sportifyAcessTokenMiddleware";
import * as sportifyTypes from "../TsTypes/sportifyTypes"
import { getUser } from "../controllers/userControllers";
import { Types } from "mongoose";

interface TrackDocument extends TracksModel {
    _id: Types.ObjectId
}

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

interface sportifyaxiosResponse {
    data: { tracks: sportifyTypes.SpotifyResponseForTracks }
}

export async function getUseFullData(useFullArray: IUseFulObject[], req: Request, getAll: boolean) {
    const user = await getUser(req);
    await appToTrackCollections(useFullArray)
    let dataToSendArray: TrackDocument[];
    if (getAll) {
        dataToSendArray = await Track.find({}).limit(30)
    } else {
        const { search } = req.query
   
        dataToSendArray = await Track.find({ trackName: new RegExp(search as string, 'i') })
    }
    const dataToSend: SendData[] = [];


    
    const userLikedSongs = (await User.findById(user?._id, { likedSongs: 1, dislikedSongs: 1 }))
    let LikedSongs = userLikedSongs?.likedSongs;
    let dislikedSongs = userLikedSongs?.dislikedSongs
    dataToSendArray.forEach((element: TrackDocument) => {
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
    return dataToSend
}



export async function appToTrackCollections(useFullArray: IUseFulObject[]) {
    const createPromises = useFullArray.map(async (element) => {
        const findTrack = await Track.findOne({ id: element.id });
        if (findTrack) return;
        const objAdded: TracksModel = {
            url: element.track,
            id: element.id,
            imageUrl: element.images,
            trackName: element.TrackName
        };
        return Track.create(objAdded);
    });
    await Promise.all(createPromises);
}


export async function getTracks(req: Request, res: Response) {
    try {

        const acess_Token = (req as RequestWithToken).access_token
        const { search } = req.query
        const response: sportifyaxiosResponse = await axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: search,
                type: "track",
                limit: 20,
            },
            headers: { 'Authorization': `Bearer ${acess_Token}` }
        });
        const tracks = response.data.tracks.items
        let useFullArray: IUseFulObject[] = []

        tracks.forEach(track => {
            if (!track.preview_url) {
                return
            }
            let useOIbj: IUseFulObject = {
                TrackName: track.name,
                track: track.preview_url,
                images: track.album.images[0].url,
                id: track.id
            }
            useFullArray.push(useOIbj)
        })

        const dataToSend = await getUseFullData(useFullArray, req, true)
        return res.send(dataToSend)

    } catch (error: any) {
        console.log(error.message);
        console.log(error.data.error);
        console.log(error);
    }
}

export async function searchTrack(req: Request, res: Response) {
    const accessToken = (req as RequestWithToken).access_token;
    const { search } = req.query
    if(!search || search.length === 0) return res.send([])
    const response: sportifyaxiosResponse = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
            q: search,
            type: "track",
            limit: 15
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const tracks = response.data.tracks.items
    let useFullArray: IUseFulObject[] = []
    tracks.forEach(track => {
        if (!track.preview_url) {
            return
        }
        let useOIbj: IUseFulObject = {
            TrackName: track.name,
            track: track.preview_url,
            images: track.album.images[0].url,
            id: track.id
        }
        useFullArray.push(useOIbj)
    })

    const dataToSend = await getUseFullData(useFullArray, req, false)
    return res.send(dataToSend)
}
