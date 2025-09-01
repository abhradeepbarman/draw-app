import { ZodError } from "zod";

export const formatError = (error: ZodError) => {
	const formatted = error.issues.map((issue) => issue.message);

	return formatted;
};
