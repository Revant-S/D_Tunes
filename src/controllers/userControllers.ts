import { Request, Response } from "express";
import User from "../DbModels/userModel";
import { UserRequest } from "../Middlewares/authMiddlewares";
import { userPayload } from "./trackControllers";
import { Types } from "mongoose";
import { IUserModel } from "../TsTypes/userdbtypes";
import PlayList from "../DbModels/playListModel";
import ReqPlayList from "../DbModels/partyModeReqModel";
import { IReqPlayListDocument } from "../TsTypes/MergeRequestsTypes";
// import { boolean } from "zod";

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

// USED ONLY ANY TYPE IN THIS FUNCTION 
export async function getMergeRequests(playListsCreatedByUser: any[]): Promise<IReqPlayListDocument[]> {
    console.log("getting the MergeRequests");
    let requestsForMerges: any[] = [];

    for (const playList of playListsCreatedByUser) {
        const mergeRequests = playList.requestsForMerge;
        for (const requestId of mergeRequests) {
            const fullRequest = await ReqPlayList.findById(requestId);
            if (!fullRequest) continue;
            await fullRequest.populate([
                { path: "requestMadeBy", select: "_id , userName ,emailId " },
                { path: "playListRequestedFor" }
            ]);
            requestsForMerges.push(fullRequest);
            console.log("IN FOR LOOP");
            console.log(requestsForMerges);
        }
    }

    return requestsForMerges;
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
    const playListsCreatedByUser = await PlayList.find({ createdBy: user._id });
    const privatePlaylists = playListsCreatedByUser.filter(playList => playList.status === "Private");
    const publicPlayLists = playListsCreatedByUser.filter(playList => playList.status === "Public");
    const requestsForMerges: IReqPlayListDocument[] = await getMergeRequests(playListsCreatedByUser);


    res.render("myProfile", {
        user: populatedUser,
        publicPlayLists,
        privatePlaylists,
        playListsCreatedByUser,
        requestsForMerges
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
    const currentUser = await getUser(req);
    if (!currentUser) return res.send("You Dont exist")
    const emialId: string = req.params.emailId;
    const user = await User.findOne({ emailId: emialId }, {
        password: 0, friendRequestToMe: 0
    })
    if (!user) return res.send("User is not there with us")
    const isFriend: boolean = (user.friends.includes(currentUser._id));
console.log(user);

    const alreadySent: boolean = (currentUser.friendRequestMade.includes(user._id))
    const gotFromUser : boolean= currentUser.friendRequestToMe.includes(user._id)
    if (!user) return res.json({ msg: "User Not Found" });
    const userPopulated = await user.populate([{
        "path": "friends", select: "userName , emailId , role , profileImageUrl, "
    }])
    const playLists = await PlayList.find({
        $and: [
            { createdBy: user._id },
            { status: "Public" }
        ]
    })
console.log(alreadySent);
console.log(isFriend);


    return res.render("otherUserProfile", {
        userPopulated,
        playLists,
        isFriend,
        alreadySent,
        gotFromUser
    })
}




export async function searchInDb(req: Request, res: Response) {
    const currentUser = await getUser(req);
    console.log(req.query.search);
    
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


export async function updateUserProfile(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.status(404).json({ success: false, message: "No such user" });

    try {
        if (req.file) {
            const profileImageUrl = `/public/profileImages/${req.file.filename}`;
            user.profileImageUrl = profileImageUrl;
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Profile image updated successfully",
                profileImageUrl: profileImageUrl
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "No file was uploaded"
            });
        }
    } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile image"
        });
    }
}

