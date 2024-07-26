import 'dotenv/config'
import express, { Request, Response } from "express"
import mongoose from "mongoose";
import authRoutes from "./routes/authroutes"
import path from "path";
import cors from "cors"
import morgan from "morgan"
import userRoutes from "./routes/userRoutes"
import trackRoutes from "./routes/trackRoutes"
import config from "config"
import { authorizeUser, authorizeArtist } from "./Middlewares/authMiddlewares"
import cookieParser from 'cookie-parser';
import playListRoutes from "./routes/playListRoutes"
import { getLatestToken } from './Middlewares/sportifyAcessTokenMiddleware';
import partyRoutes from "./routes/partyRoutes"
import artistRoutes from "./routes/artistRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import { addOrVerifyDauthUser } from './controllers/authControllers';
import { getUser } from './controllers/userControllers';

const app = express();


app.use(cors({
    origin: "*"
}))
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser("token"))
app.use(morgan("dev"))
app.use("/auth", authRoutes)
app.use("/artist", authorizeArtist)
app.use("/artist", artistRoutes)
app.use("/public", express.static(path.resolve('public')));
app.use("/playlists", authorizeUser)
app.use("/playlists", playListRoutes)
app.use("/getTracks", [authorizeUser, getLatestToken])
app.use("/getTracks", trackRoutes)
app.use("/user", authorizeUser)
app.use("/user", userRoutes)
app.use("/party", authorizeUser)
app.use("/party", partyRoutes)
app.use("/category", authorizeUser);
app.use("/category", categoryRoutes)


async function connectToDb() {
    try {
        await mongoose.connect(config.get("DbConnectionString"))
        console.log("connected to the DB");

    } catch (error) {
        console.log(error);
    }
}

connectToDb()


app.get("/home", async (req, res) => {
    const params = req.query;
    if (params.code) {
        const verificationObj = await addOrVerifyDauthUser(params.code as string);
        if (!(verificationObj).success) return res.send("Something went wrong");
        return res.cookie("token", verificationObj.authToken, {
            maxAge: 3600000,
            httpOnly: true
        }).redirect("/home");
    }
    res.render("home")
})
app.get("/", (req: Request, res: Response) => {
    res.render("landingPage");
})

app.get("/sync", authorizeUser , async (req : Request, res : Response)=>{
    const user = await getUser(req);
    if(!user) return res.send("User Not Found");
    
})




const port = config.get("PORT") || 3000;

app.listen(port, () => console.log(`Server is listening on ${port}`))