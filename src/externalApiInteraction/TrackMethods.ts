import axios from "axios";
import * as sportifyTypes from "../TsTypes/sportifyTypes"
import { getToken } from "./authTokenGeneration";
import { Request, Response } from "express";

import { data } from "../testData"
import Track  from "../DbModels/tracksModel"
import { TracksModel } from "../TsTypes/Musicdbtypes";
interface IUseFulObject {
    TrackName: string,
    track: string,
    images: string,
    id: string
}

interface sportifyaxiosResponse {
    data: { tracks: sportifyTypes.SpotifyResponseForTracks }
}

export async function appToTrackCollections(useFullArray: IUseFulObject[]) {
    useFullArray.forEach(async (element) => {
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
    return res.send(data)
    const acess_Token = await getToken()

    const response: sportifyaxiosResponse = await axios.get("https://api.spotify.com/v1/search?q=<search_query>&type=track&market=IN&limit=20&offset=0", {
        headers: { 'Authorization': `Bearer ${acess_Token}` }
    });
    console.log(acess_Token);
    


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
            id : track.id
        }
        useFullArray.push(useOIbj)
    })
    console.log(useFullArray);
    res.send(useFullArray)
    await appToTrackCollections(useFullArray)
    return
}