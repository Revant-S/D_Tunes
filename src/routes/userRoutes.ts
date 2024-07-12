import { Router } from "express"
import { makeFriendRequest, acceptFriendRequest, getUserProfile,getMyFriends } from "../controllers/userControllers"

const router = Router()

router.get("/myprofile", getUserProfile)
router.get("/myfriends", getMyFriends)
router.post("/sendfriendRequest", makeFriendRequest)
router.post("/acceptFriendRequest", acceptFriendRequest)


export default router