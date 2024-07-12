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
exports.updateLike = void 0;
const tracksModel_1 = __importDefault(require("../DbModels/tracksModel"));
const userModel_1 = __importDefault(require("../DbModels/userModel"));
function updateLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let amt = req.body.data;
        const findUser = yield userModel_1.default.findById((req.userToken._id));
        const trackId = req.params.trackId;
        if (!trackId)
            return res.send("No Id Found");
        const findTrackInDb = yield tracksModel_1.default.findOne({ id: trackId });
        if (!findTrackInDb)
            return res.send("Track Not in db");
        if (amt > 0) {
            //user has liked the song
            if (findUser === null || findUser === void 0 ? void 0 : findUser.likedSongs.includes(findTrackInDb._id)) {
                amt = -1;
                findUser.likedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1);
            }
            else {
                findUser === null || findUser === void 0 ? void 0 : findUser.likedSongs.push(findTrackInDb._id);
                amt = 1;
            }
            if (findUser === null || findUser === void 0 ? void 0 : findUser.dislikedSongs.includes(findTrackInDb._id))
                findUser.dislikedSongs.splice(findUser.dislikedSongs.indexOf(findTrackInDb._id), 1);
            findTrackInDb.likes += amt;
        }
        else {
            // user disliked the song
            if (findUser === null || findUser === void 0 ? void 0 : findUser.dislikedSongs.includes(findTrackInDb._id)) {
                amt = -1;
                yield findUser.dislikedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1);
            }
            else {
                amt = 1;
                yield (findUser === null || findUser === void 0 ? void 0 : findUser.dislikedSongs.push(findTrackInDb._id));
            }
            if (findUser === null || findUser === void 0 ? void 0 : findUser.likedSongs.includes(findTrackInDb._id))
                findUser.likedSongs.splice(findUser.likedSongs.indexOf(findTrackInDb._id), 1);
            findTrackInDb.dislikes += amt;
        }
        yield findTrackInDb.save();
        yield (findUser === null || findUser === void 0 ? void 0 : findUser.save());
        res.send({ trackUpdated: findTrackInDb, amt });
    });
}
exports.updateLike = updateLike;
