"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function authorizeUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token found");
        return res.status(401).json({ message: "Unauthorized", redirect: "/auth/signin" });
    }
    try {
        const verification = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtKey"));
        req.userToken = verification;
        next();
    }
    catch (e) {
        res.clearCookie("token");
        return res.status(401).json({ message: "Invalid token", redirect: "/auth/signin" });
    }
}
exports.authorizeUser = authorizeUser;
