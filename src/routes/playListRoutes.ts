import { Router } from "express";
import {
    getPlayLists,
    createPlayList,
    getPLayListPage,
    getTracksOfPlayList,
    getPlayListNames,
    updatePlayLists,
    partyModePage,
    getTempPage,
    partyModePageRedirect,
    deletePlayList,
    removePlayList
    
} from "../controllers/playListControllers";
import { upload } from "../Middlewares/uploadService"

const router = Router();

router.get("/getAllPlayLists", getPlayLists)
router.post("/createPlayList", upload.single("Thumbnail"), createPlayList)
router.get("/getPlayList/:playListId", getTracksOfPlayList)
router.get("/getPlayListNames", getPlayListNames)
router.put("/updatePlayLists", updatePlayLists)
router.get("/playListPage/:id", getPLayListPage)
router.get("/partyMode", partyModePage)
router.post("/tempPlayList", getTempPage)
router.get("/playPartyMode", partyModePageRedirect)
router.delete("/deletePlayList/:playListId",deletePlayList)
router.put("/removeTrack",removePlayList )


export default router