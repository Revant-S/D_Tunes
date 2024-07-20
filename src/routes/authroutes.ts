import { Router } from "express"
import * as authController from "../controllers/authControllers"
const router = Router();
import * as artistController from "../controllers/artistControllers"

router.get("/signup" ,authController.getSignupPage )
router.get("/signin" , authController.getSigninPage)
router.post("/signup", authController.signup)
router.post("/signin", authController.signin)
router.get("/registerArtist", artistController.getRegPage);
router.get("/artistSignin" , artistController.getSignInPage)
router.post("/registerArtist",artistController.registerArtist);
router.post("/artistSignin" ,artistController.artistSignin );
export default router