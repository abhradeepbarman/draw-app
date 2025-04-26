import { db } from "@repo/db";
import { chats, projects } from "@repo/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextFunction, Response } from "express";
import ResponseHandler from "../utils/responseHandler";

const chatController = {
    async getAllChats(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const { projectId } = req.params;

            const room = await db.query.projects.findFirst({
                where: eq(projects.id, projectId!),
            });

            if (!room) {
                return res
                    .status(404)
                    .send(ResponseHandler(404, "Room not found"));
            }

            const messages = await db.query.chats.findMany({
                where: eq(chats.projectId, projectId!),
                limit: 50,
                orderBy: desc(chats.createdAt),
            });

            return res
                .status(200)
                .send(
                    ResponseHandler(
                        200,
                        "Messages fetched successfully",
                        messages
                    )
                );
        } catch (error) {
            return next(error);
        }
    },

    async sendChat(req: any, res: Response, next: NextFunction): Promise<any> {
        try {
            const { projectId } = req.params;
            const { message } = req.body;
            const { id: userId } = req.user;

            const projectDetails = await db.query.projects.findFirst({
                where: eq(projects.id, projectId!),
            });

            if (!projectDetails) {
                return res
                    .status(404)
                    .send(ResponseHandler(404, "Room not found"));
            }

            const [newChat] = await db
                .insert(chats)
                .values({ projectId, message, userId })
                .returning();

            return res
                .status(201)
                .send(ResponseHandler(201, "Chat sent successfully", newChat));
        } catch (error) {
            return next(error);
        }
    },
};

export default chatController;
