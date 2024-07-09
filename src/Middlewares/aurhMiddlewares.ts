import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config"
export interface UserRequest extends Request {
  userToken?: jwt.JwtPayload | string;
}

export function authUser(req: Request, res: Response, next: NextFunction) {
  const token: string | undefined = req.cookies.token;

  if (!token) {
    return res.redirect("/auth/signin");
  }

  try {
    const verification = jwt.verify(token, config.get("jwtKey"));
    (req as UserRequest).userToken = verification;
    next();
  } catch (e) {
    res.clearCookie("token");
    return res.redirect("/auth/signin");
  }
}