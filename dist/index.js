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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authroutes_1 = __importDefault(require("./routes/authroutes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const trackRoutes_1 = __importDefault(require("./routes/trackRoutes"));
const config_1 = __importDefault(require("config"));
const aurhMiddlewares_1 = require("./Middlewares/aurhMiddlewares");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const playListRoutes_1 = __importDefault(require("./routes/playListRoutes"));
const sportifyAcessTokenMiddleware_1 = require("./Middlewares/sportifyAcessTokenMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*"
}));
app.set("view engine", "ejs");
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)("token"));
app.use("/auth", authroutes_1.default);
app.use("/public", express_1.default.static(path_1.default.resolve('public')));
app.use("/playlists", aurhMiddlewares_1.authorizeUser);
app.use("/playlists", playListRoutes_1.default);
app.use("/getTracks", [aurhMiddlewares_1.authorizeUser, sportifyAcessTokenMiddleware_1.getLatestToken]);
app.use("/getTracks", trackRoutes_1.default);
app.use("/user", aurhMiddlewares_1.authorizeUser);
app.use("/user", userRoutes_1.default);
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.get("DbConnectionString"));
            console.log("connected to the DB");
        }
        catch (error) {
            console.log(error);
        }
    });
}
connectToDb();
app.get("/home", (req, res) => {
    res.render("home");
});
const port = config_1.default.get("PORT") || 3000;
app.listen(port, () => console.log(`Server is listening on ${port}`));
