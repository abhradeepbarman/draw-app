import config from "@repo/backend-common/config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomErrorHandler from "../utils/customErrorHandler";

const auth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token =
            req.headers.authorization?.split(" ")[1] ||
            req.cookies["accessToken"];

        if (!token) {
            next(CustomErrorHandler.unAuthorized("Unauthorized Access"));
        }

        const user = jwt.verify(token!, config.ACCESS_SECRET);
        if (!user) {
            next(CustomErrorHandler.unAuthorized("Unauthorized Access"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default auth;
