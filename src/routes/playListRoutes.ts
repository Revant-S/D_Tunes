import { Router } from "express";
import { getPlayLists, createPlayList, getTracksOfPlayList } from "../controllers/playListControllers";
import { upload } from "../Middlewares/uploadService"

const router = Router();

router.get("/getAllPlayLists", getPlayLists)
router.post("/createPlayList", upload.single("Thumbnail"), createPlayList)
router.get("/getPlayList/:playListId", getTracksOfPlayList)
router.put("/updatePlayList")

export default router