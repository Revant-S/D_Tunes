import { Router } from "express";
import { getPlayLists, createPlayList, getTracksOfPlayList, getPlayListNames , updatePlayLists} from "../controllers/playListControllers";
import { upload } from "../Middlewares/uploadService"

const router = Router();

router.get("/getAllPlayLists", getPlayLists)
router.post("/createPlayList", upload.single("Thumbnail"), createPlayList)
router.get("/getPlayList/:playListId", getTracksOfPlayList)
router.get("/getPlayListNames", getPlayListNames)
router.put("/updatePlayLists" , updatePlayLists )

export default router