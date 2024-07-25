import {  Router } from "express";
import { getTracks, searchTrack } from "../externalApiInteraction/TrackMethods";
import { updateLike } from "../controllers/trackControllers";
const router = Router();

router.get("/getAllTracks" , getTracks)
router.get("/getTrack/:trackId")
router.post("/uploadSong")
router.post("/like/:trackId", updateLike)
router.get("/searchTracks", searchTrack)

export default router