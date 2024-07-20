import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config"
export interface UserRequest extends Request {
  userToken?: jwt.JwtPayload | string;
}

export interface RequestArtist extends Request{
  artistToken? : jwt.JwtPayload | string
}



export function authorizeUser(req: Request, res: Response, next: NextFunction) {
  const token: string | undefined = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", redirect: "/auth/signin" });
  }
  try {
    const verification = jwt.verify(token, config.get("jwtKey"));
    (req as UserRequest).userToken = verification;
    next();
  } catch (e) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid token", redirect: "/auth/signin" });
  }
}

export function authorizeArtist(req : Request , res : Response , next : NextFunction) {
  const token: string| undefined = req.cookies.token;
  if(!token)  return res.status(401).redirect("/auth/artistSignin");
  try {
    const verification = jwt.verify(token , config.get("jwtKey"));
   (req as RequestArtist).artistToken = verification
   console.log("IN VERIFICATION");
   
   return next()
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).redirect("/auth/artistSignin")
  }
}