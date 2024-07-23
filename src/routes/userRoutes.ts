import { Router } from "express"
import {
    makeFriendRequest,
    acceptFriendRequest,
    getUserProfile,
    getMyFriends,
    searchInDb,
    getProfile,
    rejectFriendRequest,
    removeFriendRequest,
    removeFromFriendList,
    updateUserProfile
} from "../controllers/userControllers"
import { upload } from "../Middlewares/uploadService"

const router = Router()




router.get("/myprofile", getUserProfile)
router.get("/searchUser", searchInDb)
router.get("/myfriends", getMyFriends)
router.post("/sendfriendRequest", makeFriendRequest)
router.post("/acceptFriendRequest", acceptFriendRequest)
router.get("/viewProfile/:emailId" ,getProfile )
router.put("/removeFriendRequest" ,removeFriendRequest )
router.put("/rejectFriendRequest",rejectFriendRequest)
router.put("/removeFromFriend", removeFromFriendList)
router.put("/updateUserProfile",upload.single("profileImage"),updateUserProfile )
export default router