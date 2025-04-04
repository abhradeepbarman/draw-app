import { z } from "zod";

const registerSchema = z.object({
    name: z.string().max(255),
    email: z.string().email(),
    password: z.string().max(255),
    confirm_password: z.string().max(255),
});

export default registerSchema;
