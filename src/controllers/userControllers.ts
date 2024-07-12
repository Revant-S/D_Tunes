import { Request, Response } from "express";
import User from "../DbModels/userModel";
import { UserRequest } from "../Middlewares/aurhMiddlewares";
import { userPayload } from "./trackControllers";
import { Types } from "mongoose";

export async function getUser(req: Request) {
    return await User.findById(((req as UserRequest).userToken as userPayload)._id);
}

export async function makeFriendRequest(req: Request, res: Response) {
    const user = await getUser(req)
    const friendRequestMadeTo: Types.ObjectId = req.body.recipient;
    const recipientOfReq = await User.findById(friendRequestMadeTo)
    if (!recipientOfReq) return res.send("person Not Found");
    user?.friendRequestMade.push(friendRequestMadeTo);
    recipientOfReq.friendRequestToMe.push(((req as UserRequest).userToken as userPayload)._id);
    await user?.save();
    await recipientOfReq.save()
    res.send(`Friend Request Sent SucessFully To ${recipientOfReq.userName}`)
}

export async function acceptFriendRequest(req: Request, res: Response) {
    const user = await getUser(req);
    const requestAcceptedOf: Types.ObjectId = req.body.acceptedOf;
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
    res.json({
        userProfile: user
    })
}


export async function getMyFriends(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.send("No User Profile Found");
    res.json({
        userFriends: user.friends
    })

}