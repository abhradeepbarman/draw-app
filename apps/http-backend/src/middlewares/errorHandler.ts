import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatError } from "../service/formatError";
import CustomErrorHandler from "./../utils/customErrorHandler";
import ResponseHandler from "../utils/responseHandler";
import { JsonWebTokenError } from "jsonwebtoken";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message: any = "Internal Server Error";
    
    console.log("error", err)
    
    if (err instanceof ZodError) {
        statusCode = 422;
        message = formatError(err);
    }

    if (err instanceof JsonWebTokenError) {
        statusCode = 403;
        message = "Unauthorized";
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        message = err.toJson();
    }

    return res.status(statusCode).json(ResponseHandler(statusCode, message));
};

export default errorHandler;
