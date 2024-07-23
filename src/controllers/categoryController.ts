import { Request, Response } from "express";
import { getCategories } from "../externalApiInteraction/categoriesFromSportify";


export async function getAllCategories(req : Request , res : Response) {
    const allCategories = await getCategories();
    return res.send(allCategories)
}