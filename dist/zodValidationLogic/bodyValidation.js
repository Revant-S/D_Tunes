"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateaAuthBody = void 0;
const zod_1 = require("zod");
function validateaAuthBody(body) {
    const authBodySchema = zod_1.z.object({
        userName: zod_1.z.string().min(4).optional(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    });
    return authBodySchema.safeParse(body);
}
exports.validateaAuthBody = validateaAuthBody;
