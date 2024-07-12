import {  Router } from "express";
import { getTracks } from "../externalApiInteraction/TrackMethods";
import { updateLike } from "../controllers/trackControllers";
const router = Router();

router.get("/getAllTracks" , getTracks)
router.get("/getTrack/:trackId")
router.post("/uploadSong")
router.post("/like/:trackId", updateLike)


export default router