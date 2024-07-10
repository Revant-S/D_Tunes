import 'dotenv/config'
import express from "express"
import mongoose from "mongoose";
import authRoutes from "./routes/authroutes"
import path from "path";
import cors from "cors"
import trackRoutes from "./routes/trackRoutes"
import config from "config"
import {authorizeUser} from "./Middlewares/aurhMiddlewares"
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
  origin : "*"
}))
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({extended : true }))
app.use(cookieParser("token"))
app.use("/auth" , authRoutes)
app.use("/public", express.static(path.resolve('public')));
app.use("/" ,authorizeUser )
app.use("/getTracks", trackRoutes)

async function connectToDb() {
    try {
        await mongoose.connect(config.get("DbConnectionString"))
        console.log("connected to the DB");
        
    } catch (error) {
        console.log(error);
    }
}

connectToDb()



app.get("/home",(req,res)=>{
   res.render("home")
})


app.listen(5000 , ()=>console.log("server is up and running"))