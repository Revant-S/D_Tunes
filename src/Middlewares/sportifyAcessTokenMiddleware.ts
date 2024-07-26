import { NextFunction, Request, Response } from "express";
import Token from "../DbModels/acessToken";
import { getToken } from "../externalApiInteraction/authTokenGeneration";

export interface RequestWithToken extends Request {
    access_token: string | null | undefined
}

export async function getLatestToken(req: Request, res: Response, next: NextFunction) {
    const timeNow: number = (new Date()).getTime()
    const currentToken = await Token.findOne({ status: "current" })    
    if (currentToken && (timeNow - currentToken.time) < 3600000) {
        (req as RequestWithToken).access_token = currentToken?.access_token
        next();
        return
    }
    if (currentToken) {
        await Token.deleteOne({ _id: currentToken._id })
    }
    const token = await getToken();
    console.log("THEEK NYI HUA LAUDE");
    

    (req as RequestWithToken).access_token = token;
    console.log("New Access Token Found");
    const newToken = await Token.create({
        access_token: token,
        status: "current"
    })

    if (!newToken) return res.send("Something FUCKED UP!!!");
    next()
    return
}