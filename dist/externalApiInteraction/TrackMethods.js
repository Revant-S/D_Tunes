"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTracks = exports.appToTrackCollections = void 0;
const tracksModel_1 = __importDefault(require("../DbModels/tracksModel"));
const userModel_1 = __importDefault(require("../DbModels/userModel"));
// interface sportifyaxiosResponse {
//     data: { tracks: sportifyTypes.SpotifyResponseForTracks }
// }
function appToTrackCollections(useFullArray) {
    return __awaiter(this, void 0, void 0, function* () {
        useFullArray.forEach((element) => __awaiter(this, void 0, void 0, function* () {
            const findTrack = yield tracksModel_1.default.findOne({ id: element.id });
            if (findTrack)
                return;
            const objAdded = {
                url: element.track,
                id: element.id,
                imageUrl: element.images,
                trackName: element.TrackName
            };
            yield tracksModel_1.default.create(objAdded);
        }));
    });
}
exports.appToTrackCollections = appToTrackCollections;
function getTracks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const dataToSendArray = yield tracksModel_1.default.find({});
        const dataToSend = [];
        const userLikedSongs = (yield userModel_1.default.findById(req.userToken._id, { likedSongs: 1, dislikedSongs: 1 }));
        let LikedSongs = userLikedSongs === null || userLikedSongs === void 0 ? void 0 : userLikedSongs.likedSongs;
        let dislikedSongs = userLikedSongs === null || userLikedSongs === void 0 ? void 0 : userLikedSongs.dislikedSongs;
        dataToSendArray.forEach(element => {
            let likedByUser = false;
            let dislikedByUser = false;
            if (LikedSongs === null || LikedSongs === void 0 ? void 0 : LikedSongs.includes(element._id))
                likedByUser = true;
            if (dislikedSongs === null || dislikedSongs === void 0 ? void 0 : dislikedSongs.includes(element._id))
                dislikedByUser = true;
            let useObj = {
                TrackName: element.trackName,
                track: element.url,
                images: element.imageUrl,
                id: element.id,
                likedByUser, dislikedByUser
            };
            dataToSend.push(useObj);
        });
        res.send(dataToSend);
        return;
    });
}
exports.getTracks = getTracks;
