import 'dotenv/config'
import express from "express"
import mongoose from "mongoose";
import authRoutes from "./routes/authroutes"
import path from "path";
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import trackRoutes from "./routes/trackRoutes"
import config from "config"
import { authorizeUser } from "./Middlewares/authMiddlewares"
import cookieParser from 'cookie-parser';
import playListRoutes from "./routes/playListRoutes"
import { getLatestToken } from './Middlewares/sportifyAcessTokenMiddleware';
import partyRoutes from "./routes/partyRoutes"
const app = express();

app.use(cors({
    origin: "*"
}))
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser("token"))
app.use("/auth", authRoutes)
app.use("/public", express.static(path.resolve('public')));
app.use("/playlists", authorizeUser)
app.use("/playlists", playListRoutes)
app.use("/getTracks", [authorizeUser , getLatestToken])
app.use("/getTracks", trackRoutes)
app.use("/user" ,authorizeUser)
app.use("/user" ,userRoutes)
app.use("/party" , authorizeUser)
app.use("/party" , partyRoutes)
async function connectToDb() {
    try {
        await mongoose.connect(config.get("DbConnectionString"))
        console.log("connected to the DB");

    } catch (error) {
        console.log(error);
    }
}

connectToDb()



app.get("/home", (req, res) => {
    res.render("home")
})

const port = config.get("PORT") || 3000
app.listen(port, () => console.log(`Server is listening on ${port}`))