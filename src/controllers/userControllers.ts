import { Request, Response } from "express";
import User from "../DbModels/userModel";
import { UserRequest } from "../Middlewares/aurhMiddlewares";
import { userPayload } from "./trackControllers";
import { Types } from "mongoose";
import { IUserModel } from "../TsTypes/userdbtypes";
import PlayList from "../DbModels/playListModel";

export interface UserDocument extends IUserModel {
    _id: Types.ObjectId
}


export async function getUser(req: Request) {
    return await User.findById(((req as UserRequest).userToken as userPayload)._id);
}
export function areFriends(user1Doc: UserDocument, user2Doc: UserDocument): boolean {
    if (user1Doc.friends.includes(user2Doc._id) || user2Doc.friends.includes(user1Doc._id)) return true;
    return false
}
export function alreadyMadeRequest(whoMadeTheRequest: UserDocument, toWhomRequestIsMade: UserDocument): boolean {
    if (whoMadeTheRequest.friendRequestMade.includes(toWhomRequestIsMade._id)) {
        return true
    }
    return false;
}

export async function makeFriendRequest(req: Request, res: Response) {
    const user = await getUser(req)
    if (!user) return res.send("YOU DONT EXIST !!!!");
    const friendRequestMadeTo: Types.ObjectId = req.body.data.recipient;
    const recipientOfReq = await User.findById(friendRequestMadeTo)
    if (!recipientOfReq) return res.send("USER DELETED THE ACCOUNT")
    if (alreadyMadeRequest(user, recipientOfReq)) {
        return res.json({
            success: false,
            msg: "You have already made a Request!!!"
        })
    }
    if (!recipientOfReq) return res.send("person Not Found");
    user.friendRequestMade.push(friendRequestMadeTo);
    recipientOfReq.friendRequestToMe.push(user._id);
    await user.save();
    await recipientOfReq.save()
    res.json({
        sucess: true,
        msg: `Friend Request Sent SucessFully To ${recipientOfReq.userName}`
    })
}

export async function acceptFriendRequest(req: Request, res: Response) {
    const user = await getUser(req);
    const requestAcceptedOf: Types.ObjectId = req.body.data.acceptedOf;
    const acceptedUserInDb = await User.findById(requestAcceptedOf);
    if (!acceptedUserInDb) return res.send("User Not Found");
    user?.friendRequestToMe.splice(user?.friendRequestToMe.indexOf(requestAcceptedOf), 1);
    acceptedUserInDb.friendRequestMade.splice(acceptedUserInDb.friendRequestMade.indexOf((user?._id as Types.ObjectId), 1));// assertion made
    user?.friends.push(requestAcceptedOf);
    acceptedUserInDb.friends.push((user?._id as Types.ObjectId)) // assertion made
    await user?.save();
    await acceptedUserInDb.save()
    return res.send(`You Accepted the FriendRequest`);
}


export async function getUserProfile(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.send("No User Profile Found");
    const populatedUser = await user.populate([{
        path: "friends", select: "userName , emailId , role, _id"
    }, {
        path: "friendRequestToMe", select: "userName , emailId , role, _id"
    }, {
        path: "friendRequestMade", select: "userName , emailId , role , _id"
    }])
    const playListsCreatedByUser = await PlayList.find({createdBy : user._id});
    const privatePlaylists = playListsCreatedByUser.filter(playList =>playList.status==="Private");
    const publicPlayLists = playListsCreatedByUser.filter(playList => playList.status === "Public");
    console.log(playListsCreatedByUser);
    
    console.log(privatePlaylists);
    console.log(publicPlayLists);
    
    
    res.render("myProfile", {
        user: populatedUser,publicPlayLists , privatePlaylists
    })
}


export async function getMyFriends(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.send("No User Profile Found");
    res.json({
        userFriends: user.friends
    })

}
export async function getProfile(req: Request, res: Response) {
    const emialId: string = req.params.emailId;
    const user = await User.findOne({ emailId: emialId }, {
        password: 0, friendRequestToMe: 0, friendRequestMade: 0
    })
    if (!user) return res.json({ msg: "User Not Found" });
    const userPopulated = await user.populate([{
        "path": "friends", select: "userName , emailId , role , profileImageUrl, "
    }])
    return res.render("otherUserProfile", {
        userPopulated
    })
}




export async function searchInDb(req: Request, res: Response) {
    const currentUser = await getUser(req);
    const allUsers = await User.find({ _id: { $ne: currentUser?._id } }, { password: 0, _id: 0 });
    let usersToSend: any[] = [] // Used any type
    const toCompare = <string>req.query.search
    allUsers.forEach(user => {
        if ((user.userName.toLowerCase()).includes(toCompare) || (user.emailId.toLowerCase()).includes(toCompare)) {
            usersToSend.push(user)
        }
    })
    return res.send(usersToSend)
}

export async function removeFriendRequest(req: Request, res: Response) {
    const currentUser = await getUser(req);
    if (!currentUser) return res.send("YOU ARE NOT THERE IN THE DATABASE !!!!!!!!");
    const friendToRemove: Types.ObjectId = req.body.data.toRemove;
    const userToRemove = await User.findById(friendToRemove);
    userToRemove?.friendRequestToMe.splice(
        userToRemove?.friendRequestMade.indexOf(currentUser._id), 1
    )
    currentUser.friendRequestMade.splice(
        currentUser.friendRequestMade.indexOf(friendToRemove), 1
    )
    await currentUser.save()
    await userToRemove?.save()
    return res.json({
        success: true,
        msg: "Removed The friendRequest"

    })
}
export async function removeFromFriendList(req: Request, res: Response) {
    const currentUser = await getUser(req);
    if (!currentUser) return res.send("YOU ARE NOT THERE IN THE DATABASE !!!!!!!!");
    const friendToRemove: Types.ObjectId = req.body.data.toRemove;
    const userToRemove = await User.findById(friendToRemove);
    userToRemove?.friends.splice(
        userToRemove?.friends.indexOf(currentUser._id), 1
    )
    currentUser.friends.splice(
        currentUser.friends.indexOf(friendToRemove), 1
    )
    await currentUser.save()
    await userToRemove?.save()
    return res.json({
        success: true,
        msg: "Removed The FriendList"

    })
}

export async function rejectFriendRequest(req: Request, res: Response) {
    const currentUser = await getUser(req);
    const whoseRequestToReject: Types.ObjectId = req.body.data.toReject;
    const rejectedUserInDb = await User.findById(whoseRequestToReject)
    if (!currentUser) return res.send("You Dont exist");
    if (!rejectedUserInDb) return res.send("User Doesnt Exist"); // potential Bug
    currentUser.friendRequestToMe.splice(currentUser.friendRequestToMe.indexOf(whoseRequestToReject), 1);
    rejectedUserInDb.friendRequestMade.splice(rejectedUserInDb.friendRequestMade.indexOf(currentUser._id), 1);
    await rejectedUserInDb.save()
    await currentUser.save()
    return res.send("Reject the request")
}
