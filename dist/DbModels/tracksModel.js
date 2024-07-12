"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const trackSchema = new mongoose_1.default.Schema({
    trackName: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String
    },
});
const Track = mongoose_1.default.model("Track", trackSchema);
exports.default = Track;
