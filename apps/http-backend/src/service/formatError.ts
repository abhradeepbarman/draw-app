import { ZodError } from "zod";

export const formatError = (error: ZodError) => {
    const formatted = error.errors.map((err) => ({
        path: err.path.join("."), 
        message: err.message,
    }));
    
    return formatted;
};
