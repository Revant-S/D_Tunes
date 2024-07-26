import { Request, Response } from "express";
import { signupBody } from "../TsTypes/bodyTypes";
import { validateaAuthBody } from "../zodValidationLogic/bodyValidation";
import Artist from "../DbModels/ArtistModel";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { Types } from "mongoose";
import { FileRequest } from "../Middlewares/uploadService";
import Track from "../DbModels/tracksModel";
import { uploadSongBody } from "../TsTypes/ArtistTypes";
import { RequestArtist } from "../Middlewares/authMiddlewares";


export interface ArtistPayLoad extends JwtPayload {
    artistId: Types.ObjectId,
    artistName: string,
    iat: number
}
export interface ArtistRequest extends Request {
    artistId: Types.ObjectId
}

export async function getArtist(req: Request) {
    const id = ((req as RequestArtist).artistToken as ArtistPayLoad).artistId;
    const artistInDb = await Artist.findById(id);
    console.log(artistInDb);
    return artistInDb
}

export function getArtistFromJWT(jwtToken: string): ArtistPayLoad | null {
    const decoded = jwt.decode(jwtToken, { json: true });
    if (decoded && typeof decoded === 'object' && 'artistId' in decoded && 'artistName' in decoded) {
        return decoded as ArtistPayLoad;
    }
    return null;
}
export function getRegPage(req: Request, res: Response) {
    res.render("artistRegPage")
}
export function getSignInPage(req: Request, res: Response) {
    res.render("artistSigninPage")
}


export async function registerArtist(req: Request, res: Response) {
    const registerBody: signupBody = req.body
    const validBody = validateaAuthBody(registerBody);
    if (!validBody.success) return res.send(validBody.error);
    try {
        const newArtist = await Artist.create({
            artistName: registerBody.artistName,
            password: registerBody.password,
            email: registerBody.email
        })
        const token = newArtist.getAuthToken()
        res.cookie("token", token, {
            maxAge: 360000,
            httpOnly: true
        }).redirect("/artist/dashBoard")
    } catch (error) {

        if (error instanceof Error && 'code' in error && error.code === 11000) {
            res.send("User Already Exists")
        }
    }
}

export async function artistSignin(req: Request, res: Response) {
    const signInBody: signupBody = req.body
    const isValid = validateaAuthBody(signInBody);
    if (!isValid.success) return res.send(isValid.error);
    const artistInDb = await Artist.findOne({ email: signInBody.email })
    if (!artistInDb) return res.send("INCORRECT EMAIL OR PASSWORD");
    const comparingPassword = await bcrypt.compare(signInBody.password, artistInDb.password);
    if (!comparingPassword) return res.send("INCORRECT PASSWORD OR EMAIL");
    const token = await artistInDb.getAuthToken();
    res.cookie("token", token, {
        maxAge: 3600000,
        httpOnly: true
    }).redirect("/artist/dashBoard")
}

export async function getArtistDashBoard(req: Request, res: Response) {
    const decodedObj = getArtistFromJWT(req.cookies.token)
    const artistInDb = await Artist.findById(decodedObj?.artistId).populate([{ path: "songsPublished" }])
    console.log(artistInDb);

    res.render("artistDashboard", {
        artistInDb
    })
}


export async function uploadSongForm(req: Request, res: Response) {
    res.render("uploadSong");
}

export async function uploadTheSong(req: Request, res: Response) {
    const artist = await getArtist(req)
    if (!artist) return res.send("You dont exist");
    try {
        const newTrack = await Track.create({
            trackName: (req.body as uploadSongBody).trackName,
            imageUrl: `/public/uploads/${(req as FileRequest).savedFileName}`,
            url: `/public/uploads/songs/${(req as FileRequest).uploadedSongName}`,
            id: "TESTIDARTIST"
        })

        const updateArtist = await Artist.findByIdAndUpdate(artist.id, {
            $push: { songsPublished: newTrack._id }
        })
        if (!updateArtist) return res.send("Please Try Again");

        res.send(newTrack._id)
    } catch (error: any) {
        console.log(error.message);

    }
}


