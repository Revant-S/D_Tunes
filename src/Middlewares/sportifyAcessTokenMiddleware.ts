import { NextFunction, Request, Response } from "express";
// import Token from "../DbModels/acessToken";
// import { getToken } from "../externalApiInteraction/authTokenGeneration";

export interface RequestWithToken extends Request{
    access_token : string|null|undefined
}

export async function getLatestToken(req : Request , res : Response , next : NextFunction) {
    return next()
    // const timeNow:number = (new Date()).getTime()
    // const currentToken = await Token.findOne({status : "current"})
    // if (currentToken && (timeNow - currentToken.time)/1000 < 3600) {
    //     (req as RequestWithToken).access_token = currentToken?.access_token
    //     next();
    //     return
    // }
    // if (currentToken) {
    //     currentToken.status = "expired"
    // }
    // const token = await getToken();
    // (req as RequestWithToken).access_token = token; 
    // const newToken = await Token.create({
    //     access_token : token,
    //     status : "current"
    // })

    // if (!newToken) return res.send("Something FUCKED UP!!!");
    // next()
    // return
}