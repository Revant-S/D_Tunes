import 'dotenv/config'
import express, { Request, Response, NextFunction } from "express"
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
app.use("/artist", authorizeArtist, artistRoutes)
app.use("/public", express.static(path.resolve('public')));
app.use("/playlists", authorizeUser,playListRoutes)
app.use("/getTracks", authorizeUser, getLatestToken, trackRoutes)
app.use("/user", authorizeUser, userRoutes)
app.use("/party", authorizeUser, partyRoutes)
app.use("/category", authorizeUser, categoryRoutes);


async function connectToDb() {
    try {
        await mongoose.connect(config.get("DbConnectionString"))
        console.log("connected to the DB");

    } catch (error) {
        console.log(error);
    }
}

connectToDb()



const authorizeOrFirstLogin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token && req.query.code) {
    // First-time login with Dauth code
    return next();
  }

  // Use the existing authorizeUser middleware for subsequent visits
  return authorizeUser(req, res, next);
};



app.get("/home", authorizeOrFirstLogin,async (req, res) => {
    const params = req.query;
    if (params.code) {
        const verificationObj = await addOrVerifyDauthUser(params.code as string);
        if (!(verificationObj).success) return res.send("Something went wrong");
        console.log("Cookie Sent");
        
        return res.cookie("token", verificationObj.authToken, {
            maxAge: 3600000,
            httpOnly: true
        }).redirect("/home");
    }

    const user = await getUser(req);

    console.log(user);
    
    
    res.render("home", {
        user
    })
})
app.get("/", (req: Request, res: Response) => {
    res.render("landingPage");
})


const port = config.get("PORT") || 3000;

app.listen(port, () => console.log(`Server is listening on ${port}`))