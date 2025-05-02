import config from "@repo/backend-common/config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomErrorHandler from "../utils/customErrorHandler";
import ResponseHandler from "../utils/responseHandler";

const auth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token =
            req.headers.authorization?.split(" ")[1] ||
            req.cookies["accessToken"];

        if (!token) {
            res
                .status(403)
                .send(ResponseHandler(401, "Unauthorized Access"));
        }

        const user = jwt.verify(token!, config.ACCESS_SECRET);
        if (!user) {
            res
                .status(403)
                .send(ResponseHandler(401, "Unauthorized Access"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error", error);
        next(error);
    }
};

export default auth;
