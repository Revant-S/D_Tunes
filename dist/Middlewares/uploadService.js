"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const storingPath = path_1.default.resolve("public/uploads");
        cb(null, storingPath);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file === null || file === void 0 ? void 0 : file.originalname}`;
        req.savedFileName = fileName;
        cb(null, fileName);
    }
});
exports.upload = (0, multer_1.default)({ storage });
