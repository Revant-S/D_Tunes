"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestToken = void 0;
const acessToken_1 = __importDefault(require("../DbModels/acessToken"));
const authTokenGeneration_1 = require("../externalApiInteraction/authTokenGeneration");
function getLatestToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeNow = (new Date()).getTime();
        const currentToken = yield acessToken_1.default.findOne({ status: "current" });
        if (currentToken && (timeNow - currentToken.time) / 1000 < 3600) {
            req.access_token = currentToken === null || currentToken === void 0 ? void 0 : currentToken.access_token;
            next();
            return;
        }
        if (currentToken) {
            currentToken.status = "expired";
        }
        const token = yield (0, authTokenGeneration_1.getToken)();
        req.access_token = token;
        const newToken = yield acessToken_1.default.create({
            access_token: token,
            status: "current"
        });
        if (!newToken)
            return res.send("Something FUCKED UP!!!");
        next();
        return;
    });
}
exports.getLatestToken = getLatestToken;
