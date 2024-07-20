import { Request } from 'express';
import multer from 'multer';
import path from "path";

export interface FileRequest extends Request {
  savedFileName: string,
  uploadedSongName? : string
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storingPath = file.fieldname === 'audioFile' 
      ? path.resolve("public/uploads/songs")
      : path.resolve("public/uploads");
    cb(null, storingPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    (req as FileRequest).savedFileName = fileName;
    const key : (keyof FileRequest) = file.fieldname === 'audioFile' ? "uploadedSongName" : "savedFileName";
    (req as FileRequest)[key] = fileName
    cb(null, fileName);
  }
});

export const upload = multer({ storage });