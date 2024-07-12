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
exports.getPLayListPage = exports.updatePlayLists = exports.getPlayListNames = exports.getTracksOfPlayList = exports.createPlayList = exports.getPlayLists = void 0;
const userModel_1 = __importDefault(require("../DbModels/userModel"));
const playListModel_1 = __importDefault(require("../DbModels/playListModel"));
const tracksModel_1 = __importDefault(require("../DbModels/tracksModel"));
// export interface PopulatedTrackList{
//     imageUrl : string,
//     likes : number,
//     dislikes : number,
//     url : string,
//     _id : Types.ObjectId
// }
// export type PopulatedPlayList = PopulatedPlayListElement[]
// export interface PlayListToSend extends PopulatedPlayList{
//     likedByUser : boolean,
//     dislikedByUser : boolean
// }
function getPlayLists(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const playLists = yield playListModel_1.default.find({ $or: [{ createdBy: req.userToken._id }, { status: "Public" }] });
        res.render("playList", {
            playLists
        });
    });
}
exports.getPlayLists = getPlayLists;
function createPlayList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.userToken;
        const UserInDb = yield userModel_1.default.findById(user._id);
        const newPlayList = yield playListModel_1.default.create({
            playListName: req.body.playListName,
            createdBy: UserInDb === null || UserInDb === void 0 ? void 0 : UserInDb._id,
            status: req.body.Acess,
            thumbNailPath: `/public/uploads/${req.savedFileName}`
        });
        res.send({
            id: newPlayList._id,
            thumbNailURL: newPlayList.thumbNailPath,
            playListName: newPlayList.playListName
        });
    });
}
exports.createPlayList = createPlayList;
function getTracksOfPlayList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const playList = yield playListModel_1.default.findById(req.params.playListId, { trackList: 1, _id: 0 });
        if (!playList)
            return res.json({ found: false, playlist: {} });
        res.redirect(`/playlists/playListPage/${req.params.playListId}`);
    });
}
exports.getTracksOfPlayList = getTracksOfPlayList;
function getPlayListNames(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const playLists = yield playListModel_1.default.find({ createdBy: req.userToken._id }, { playListName: 1 });
        return res.send(playLists);
    });
}
exports.getPlayListNames = getPlayListNames;
function updatePlayLists(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(typeof req.body.playListName);
        const songCard = JSON.parse(req.body.SongToBeAdded);
        console.log(req.body);
        const body = req.body;
        const trackIDb = yield tracksModel_1.default.findOne({ id: songCard.id });
        if (!trackIDb)
            return res.send("Song Not Found in Db");
        console.log(body.playListName);
        if ((typeof req.body.playListName) === "string") {
            yield playListModel_1.default.findByIdAndUpdate(body.playListName, { $push: { trackList: trackIDb._id } });
        }
        else {
            body.playListName.forEach((playLIstName) => __awaiter(this, void 0, void 0, function* () {
                yield playListModel_1.default.findByIdAndUpdate(playLIstName, { $push: { trackList: trackIDb._id } });
            }));
        }
        res.send({ sucess: true, msg: "Song Added to PlayList" });
    });
}
exports.updatePlayLists = updatePlayLists;
function getPLayListPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const playListId = req.params.id;
        const playListData = yield playListModel_1.default.findById(playListId); // USED ANY TYPE RECTIFY IT
        if (!playListData)
            return res.send("Play List Not Found");
        const populatedPlayList = yield playListData.populate({
            path: "trackList",
            select: "imageUrl , likes , dislikes , url , _id , trackName"
        });
        console.log(populatedPlayList);
        const user = yield userModel_1.default.findById(req.userToken._id);
        // console.log(user);
        const likedSongs = user === null || user === void 0 ? void 0 : user.likedSongs;
        const dislikedSongs = user === null || user === void 0 ? void 0 : user.dislikedSongs;
        let playListToRender = [];
        populatedPlayList.trackList.forEach((element) => __awaiter(this, void 0, void 0, function* () {
            let likedByUser = false;
            let dislikedByUser = false;
            if (likedSongs === null || likedSongs === void 0 ? void 0 : likedSongs.includes(element._id))
                likedByUser = true;
            if (dislikedSongs === null || dislikedSongs === void 0 ? void 0 : dislikedSongs.includes(element._id))
                dislikedByUser = true;
            // console.log(element);
            const obj = {
                url: element.url,
                imageUrl: element.imageUrl,
                trackName: element.trackName,
                likedByUser, dislikedByUser
            };
            playListToRender.push(obj);
        }));
        // console.log(playListToRender);
        res.render("playListPage", {
            populatedPlayList: playListToRender
        });
    });
}
exports.getPLayListPage = getPLayListPage;
