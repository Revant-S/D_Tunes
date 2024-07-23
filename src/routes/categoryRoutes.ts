import { Router } from "express";
import { getAllCategories } from "../controllers/categoryController";

const router = Router();


router.get("/allCategories" , getAllCategories)


export default router