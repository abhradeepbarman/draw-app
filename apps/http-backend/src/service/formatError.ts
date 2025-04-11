import { ZodError } from "zod";

export const formatError = (error: ZodError): Record<string, string> => {
    const errors: Record<string, string> = {};

    error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
    });

    return errors;
};
