import { z } from "zod";

const registerSchema = z
    .object({
        name: z.string({ message: "Name is required" }).max(255),
        email: z.string({ message: "Email is required" }).email(),
        password: z.string({ message: "Password is required" }).max(255),
        confirm_password: z
            .string({ message: "Confirm password is required" })
            .max(255),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"], 
    });

export default registerSchema;
