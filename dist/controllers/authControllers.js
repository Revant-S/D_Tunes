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
exports.signin = exports.signup = exports.getSigninPage = exports.getSignupPage = void 0;
const userModel_1 = __importDefault(require("../DbModels/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const bodyValidation_1 = require("../zodValidationLogic/bodyValidation");
function getSignupPage(req, res) {
    return res.render("signup");
}
exports.getSignupPage = getSignupPage;
function getSigninPage(req, res) {
    return res.render("signin");
}
exports.getSigninPage = getSigninPage;
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userBody = req.body;
        const validateBody = (0, bodyValidation_1.validateaAuthBody)(userBody);
        if (!validateBody.success) {
            return res.send(validateBody.error);
        }
        const user = yield userModel_1.default.findOne({ emailId: userBody.email });
        if (user) {
            return res.send("UserAlready Exists");
        }
        try {
            const newUser = yield userModel_1.default.create({
                userName: userBody.userName,
                password: userBody.password,
                emailId: userBody.email
            });
            const token = newUser.getAuthToken();
            res.cookie("token", token).redirect("/home");
        }
        catch (error) {
        }
    });
}
exports.signup = signup;
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        console.log(body.password);
        const validateBody = (0, bodyValidation_1.validateaAuthBody)(body);
        if (!validateBody.success)
            return res.send(validateBody.error);
        const userInDb = yield userModel_1.default.findOne({ emailId: body.email });
        if (!userInDb)
            return res.send("NO USER FOUND");
        const correctUser = yield bcrypt_1.default.compare(body.password, userInDb.password);
        console.log(correctUser);
        if (!correctUser)
            return res.send("Incorrect Password");
        const token = userInDb.getAuthToken();
        res.status(200).cookie("token", token).redirect("/home");
    });
}
exports.signin = signin;
