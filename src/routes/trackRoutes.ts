import {  Router } from "express";
import { getTracks } from "../externalApiInteraction/TrackMethods";

const router = Router();

router.get("/getAllTracks" , getTracks)
router.get("/getTrack/:trackId")
router.post("/uploadSong")


export default router