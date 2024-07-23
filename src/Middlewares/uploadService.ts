import { Request } from 'express';
import multer from 'multer';
import path from "path";

export interface FileRequest extends Request {
  savedFileName: string,
  uploadedSongName?: string,
  profileImage?: string
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let storingPath: string;
    switch (file.fieldname) {
      case 'audioFile':
        storingPath = path.resolve("public/uploads/songs");
        break;
      case 'profileImage':
        storingPath = path.resolve("public/profileImages");
        break;
      default:
        storingPath = path.resolve("public/uploads");
    }
    cb(null, storingPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    (req as FileRequest).savedFileName = fileName;
    
    let key: keyof FileRequest;
    switch (file.fieldname) {
      case 'audioFile':
        key = "uploadedSongName";
        break;
      case 'profileImage':
        key = "profileImage";
        break;
      default:
        key = "savedFileName";
    }
    (req as FileRequest)[key] = fileName;
    
    cb(null, fileName);
  }
});

export const upload = multer({ storage });