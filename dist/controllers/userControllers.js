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
exports.getMyFriends = exports.getUserProfile = exports.acceptFriendRequest = exports.makeFriendRequest = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../DbModels/userModel"));
function getUser(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield userModel_1.default.findById(req.userToken._id);
    });
}
exports.getUser = getUser;
function makeFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(req);
        const friendRequestMadeTo = req.body.recipient;
        const recipientOfReq = yield userModel_1.default.findById(friendRequestMadeTo);
        if (!recipientOfReq)
            return res.send("person Not Found");
        user === null || user === void 0 ? void 0 : user.friendRequestMade.push(friendRequestMadeTo);
        recipientOfReq.friendRequestToMe.push(req.userToken._id);
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield recipientOfReq.save();
        res.send(`Friend Request Sent SucessFully To ${recipientOfReq.userName}`);
    });
}
exports.makeFriendRequest = makeFriendRequest;
function acceptFriendRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(req);
        const requestAcceptedOf = req.body.acceptedOf;
        const acceptedUserInDb = yield userModel_1.default.findById(requestAcceptedOf);
        if (!acceptedUserInDb)
            return res.send("User Not Found");
        user === null || user === void 0 ? void 0 : user.friendRequestToMe.splice(user === null || user === void 0 ? void 0 : user.friendRequestToMe.indexOf(requestAcceptedOf), 1);
        acceptedUserInDb.friendRequestMade.splice(acceptedUserInDb.friendRequestMade.indexOf(user === null || user === void 0 ? void 0 : user._id, 1)); // assertion made
        user === null || user === void 0 ? void 0 : user.friends.push(requestAcceptedOf);
        acceptedUserInDb.friends.push(user === null || user === void 0 ? void 0 : user._id); // assertion made
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield acceptedUserInDb.save();
        return res.send(`You Accepted the FriendRequest`);
    });
}
exports.acceptFriendRequest = acceptFriendRequest;
function getUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(req);
        if (!user)
            return res.send("No User Profile Found");
        res.json({
            userProfile: user
        });
    });
}
exports.getUserProfile = getUserProfile;
function getMyFriends(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUser(req);
        if (!user)
            return res.send("No User Profile Found");
        res.json({
            userFriends: user.friends
        });
    });
}
exports.getMyFriends = getMyFriends;
