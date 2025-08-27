import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { ZodError } from "zod";
import { formatError } from "../utils/formatError";
import ResponseHandler from "../utils/responseHandler";
import CustomErrorHandler from "./../utils/customErrorHandler";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message: any = "Internal Server Error";

    console.log("error", err);

    if (err instanceof ZodError) {
        statusCode = 422;
        message = formatError(err);
    }

    if (err instanceof JsonWebTokenError) {
        statusCode = 401;
        message = "Unauthorized";
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        message = err.toJson();
    }

    return res.status(statusCode).json(ResponseHandler(statusCode, message));
};

export default errorHandler;
