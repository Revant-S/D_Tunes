import { Request, Response } from "express";
import { getUser } from "./userControllers";
import ReqPlayList from "../DbModels/partyModeReqModel";
import PlayList from "../DbModels/playListModel";

export async function requestPlayList(req: Request, res: Response) {
    const user = await getUser(req);
    if (!user) return res.send("You Dont Exist");
    const playListRequestBody = req.body;
    const playListRequestedFor = playListRequestBody.playListRequestedFor;
    const newRequest = await ReqPlayList.create({
        requestMadeBy: user._id,
        playListRequestedFor,
        expiresAt: new Date(Date.now() + 3600000)
    });
    const playListInDb = await PlayList.findById(playListRequestedFor);
    if (!playListInDb) return res.send("PlayList Is Deleted");
    playListInDb.requestsForMerge.push(newRequest._id);
    await playListInDb.save()

    res.json({
        success: true,
        newRequest
    });
}


export async function respondToRequest(req: Request, res: Response) {
    const { id } = req.body;

    const request = await ReqPlayList.findById(id);
    if (!request) return res.send("Request Not Found");
    request.requestStatus = "Accepted";
    await request.save();
    return res.send("Request Accepted")

}