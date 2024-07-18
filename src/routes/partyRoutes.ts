import { Router } from "express";
import {
    requestPlayList,
    respondToRequest
} from "../controllers/partyControllers";

const router = Router();

router.get("/getPermittedPlayList")
router.post("/requestPlayList", requestPlayList)
router.put("/respondToRequest", respondToRequest)
router.get("/getAllowedPlayLists",)
export default router