import express from "express"
import mongoose from "mongoose";
import authRoutes from "./routes/authroutes"
import path from "path";
const app = express();

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({extended : true }))
app.use("/public", express.static(path.resolve('public')));
app.use("/auth" , authRoutes)
async function connectToDb() {
    try {
        await mongoose.connect("mongodb://localhost:27017/DTunes")
        console.log("connected to the DB");
        
    } catch (error) {
        console.log(error);
        
    }
}

connectToDb()
console.log((path.join(__dirname, 'public')));


app.get("/home",(req,res)=>{
    res.send("SetUp Done")
})


app.listen(5000 , ()=>console.log("server is up and running"))