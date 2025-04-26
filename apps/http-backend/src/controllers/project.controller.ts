import { db } from "@repo/db";
import { projects } from "@repo/db/schema";
import { NextFunction, Response } from "express";
import ResponseHandler from "../utils/responseHandler";

const projectControllers = {
    async createProject(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const { id } = req.user;

            const [newRoom] = await db
                .insert(projects)
                .values({
                    adminId: id,
                })
                .returning();

            return res
                .status(201)
                .send(
                    ResponseHandler(201, "Room created successfully", newRoom)
                );
        } catch (error) {
            return next(error);
        }
    },
};

export default projectControllers;
