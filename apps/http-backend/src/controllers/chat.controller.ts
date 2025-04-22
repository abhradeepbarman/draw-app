import { db } from "@repo/db";
import { chats, rooms } from "@repo/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler";

const chatController = {
    async getAllChats(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const { roomId } = req.params;

            const room = await db.query.rooms.findFirst({
                where: eq(rooms.id, roomId!),
            });

            if (!room) {
                return res
                    .status(404)
                    .send(ResponseHandler(404, "Room not found"));
            }

            const messages = await db.query.chats.findMany({
                where: eq(chats.roomId, roomId!),
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
};

export default chatController;
