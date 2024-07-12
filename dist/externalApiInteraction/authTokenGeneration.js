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
exports.getToken = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("config"));
const client_id = config_1.default.get("client_id");
const client_secret = config_1.default.get("client_secret");
function getToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
        const response = yield axios_1.default.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            'grant_type': 'client_credentials',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
            },
        });
        let token = response.data.access_token;
        return token;
    });
}
exports.getToken = getToken;
