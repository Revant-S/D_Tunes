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
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["Artist", "NormalUser"],
        default: "NormalUser"
    },
    likedSongs: {
        type: [{
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Track"
            }],
        default: []
    },
    dislikedSongs: {
        type: [{
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Track"
            }],
        default: []
    },
    musicPublished: {
        type: [{
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Track"
            }],
        default: []
    },
    friends: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
        default: []
    },
    friendRequestToMe: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
        default: []
    },
    friendRequestMade: {
        type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
        default: []
    },
});
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return;
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
    });
});
userSchema.methods.getAuthToken = function getAuthToken() {
    const payload = {
        _id: this._id,
        role: this.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtKey"));
    return token;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
