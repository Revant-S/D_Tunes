import { signupBody } from "../TsTypes/bodyTypes";
import { z } from "zod";

export function validateaAuthBody(body: signupBody) {
    const authBodySchema = z.object({
        userName : z.string().min(4).optional(),
        artistName : z.string().optional(),
        email : z.string().email(),
        password : z.string().min(6),
    })
    return authBodySchema.safeParse(body)
}