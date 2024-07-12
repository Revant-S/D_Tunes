"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    access_token: {
        type: String
    },
    time: {
        type: Number,
        default: (new Date()).getTime()
    },
    status: {
        type: String,
        enum: ["expired", "current"]
    }
});
const Token = mongoose_1.default.model("Token", tokenSchema);
exports.default = Token;
