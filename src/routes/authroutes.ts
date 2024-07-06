import { Router } from "express"
import * as authController from "../controllers/authControllers"
const router = Router();


router.get("/signup" ,authController.getSignupPage )
router.get("/signin" , authController.getSigninPage)
router.post("/signup", authController.signup)
router.post("/signin", authController.signin)






export default router