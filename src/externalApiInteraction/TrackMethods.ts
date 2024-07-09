// import axios from "axios";
// import * as sportifyTypes from "../TsTypes/sportifyTypes"
// import { getToken } from "./authTokenGeneration";
import { Request, Response } from "express";
import {data} from "../testData"

// interface IUseFulObject {
//     TrackName: string,
//     track: string,
//     images: string
// }

// interface sportifyaxiosResponse {
//     data: { tracks: sportifyTypes.SpotifyResponseForTracks }
// }


export async function getTracks(req : Request,res : Response) {
    
    
    // const acess_Token = await getToken()
    return res.send(data)

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
    //         images: track.album.images[0].url
    //     }
    //     useFullArray.push(useOIbj)
    // })
    // console.log(useFullArray);

    // return res.json({
    //     data : useFullArray
    // });
}