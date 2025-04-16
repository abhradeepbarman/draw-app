import { db } from "@repo/db";
import { rooms } from "@repo/db/schema";
import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/responseHandler";
import { eq } from "drizzle-orm";

const createSlug = async (): Promise<string> => {
    let randomPart = Math.random().toString(36).substring(2, 8); // random 6-char string
    let timestampPart = Date.now().toString(36); // base36 timestamp
    let generatedSlug = `${randomPart}-${timestampPart}`;

    while (true) {
        const existingRoom = await db.query.rooms.findFirst({
            where: eq(rooms.slug, generatedSlug),
        });

        if (existingRoom) {
            randomPart = Math.random().toString(36).substring(2, 8); // random 6-char string
            timestampPart = Date.now().toString(36); // base36 timestamp
            generatedSlug = `${randomPart}-${timestampPart}`;
        } else {
            break;
        }
    }

    return generatedSlug;
};

const roomControllers = {
    async createRoom(
        req: any,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const slug = await createSlug();
            const { id } = req.user;

            const [newRoom] = await db.insert(rooms).values({
                slug,
                adminId: id,
            });

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

export default roomControllers;
