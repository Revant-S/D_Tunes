import { Request } from 'express';
import multer from 'multer';
import path from "path";

export interface FileRequest extends Request{
    savedFileName : string
}

const storage = multer.diskStorage({
    destination : function (req , file , cb ) {
        const storingPath = path.resolve("public/uploads")
        cb(null , storingPath)
    },
    filename : function (req,file , cb) {
        const fileName = `${Date.now()}-${file?.originalname}`;
        (req as FileRequest).savedFileName = fileName;
        cb(null , fileName)
    }

})
export const upload = multer({storage})