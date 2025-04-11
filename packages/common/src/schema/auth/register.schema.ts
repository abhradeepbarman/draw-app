import { z } from "zod";

const registerSchema = z
    .object({
        name: z
            .string({
                message: "Name is required",
            })
            .max(255),
        email: z
            .string({
                message: "Email is required",
            })
            .email({
                message: "Invalid email",
            }),
        password: z
            .string({
                message: "Password is required",
            })
            .max(255, {
                message: "Password must be less than 255 characters",
            }),
        confirm_password: z
            .string({
                message: "Confirm password is required",
            })
            .max(255, {
                message: "Confirm password must be less than 255 characters",
            }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
    });

export default registerSchema;
