import { Request, Response } from "express";
import { signupBody } from "../TsTypes/bodyTypes";
import User from "../DbModels/userModel";
import bcrypt from "bcrypt"
import { validateaAuthBody } from "../zodValidationLogic/bodyValidation";
import { UserDocument } from "./userControllers";
import PlayList from "../DbModels/playListModel";

export function getSignupPage(req: Request, res: Response) {
    return res.render("signup")
}

export function getSigninPage(req: Request, res: Response) {
    return res.render("signin")
}

export async function createADefaultLikePlayList(user :UserDocument ) {
    const newPlayList = await PlayList.create({
        playListName : "Liked Songs",
        createdBy : user._id,
        trackList : [],
        status : "Private",
        genere : "Liked Songs"
    })
    return newPlayList
}
export async function signup(req: Request, res: Response) {
    const userBody: signupBody = req.body
    const validateBody = validateaAuthBody(userBody)
    if (!validateBody.success) {
        return res.send(validateBody.error)
    }
    const user = await User.findOne({ emailId: userBody.email })
    if (user) {
        return res.send("UserAlready Exists")
    }

    try {
        const newUser = await User.create({
            userName: userBody.userName,
            password: userBody.password,
            emailId: userBody.email
        })
        const token = newUser.getAuthToken()
        res.cookie("token", token).redirect("/home")
        await createADefaultLikePlayList(newUser)

    } catch (error) {

    }
}


export async function signin(req: Request, res: Response) {

    const body: signupBody = req.body
    console.log(body.password);
    const validateBody = validateaAuthBody(body)
    if (!validateBody.success) return res.send(validateBody.error)
    const userInDb = await User.findOne({ emailId: body.email })
    if (!userInDb) return res.send("NO USER FOUND");
        
    const correctUser = await bcrypt.compare(body.password, userInDb.password)
    console.log(correctUser);

    if (!correctUser) return res.send("Incorrect Password")
    const token = userInDb.getAuthToken();
    res.status(200).cookie("token", token).redirect("/home")
}