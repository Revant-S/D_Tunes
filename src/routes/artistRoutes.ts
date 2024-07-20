import { Router } from "express";
import {
  getArtistDashBoard,
  uploadSongForm,
  uploadTheSong
} from "../controllers/artistControllers";
import { upload } from "../Middlewares/uploadService";

const router = Router();

router.post("/uploadnewsong",
  upload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'thumbNail', maxCount: 1 }
  ]),
  uploadTheSong
);

router.get("/uploadnewsong", uploadSongForm);
router.get("/dashBoard", getArtistDashBoard);
router.put("/updateProfile");

export default router;