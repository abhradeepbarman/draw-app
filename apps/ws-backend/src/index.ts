import config from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import User from "./@types/user.types";
import { db } from "@repo/db";
import { chats, projects } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { parse } from "cookie";

const wss = new WebSocketServer({ port: Number(config.PORT) });

let users: User[] = [];

const checkUser = (token: string) => {
    try {
        let decoded;
        decoded = jwt.verify(token!, config.ACCESS_SECRET);

        if (typeof decoded === "string") {
            return null;
        }

        if (!decoded || !decoded?.id) {
            return null;
        }

        return decoded.id;
    } catch (error) {
        return null;
    }
};

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        ws.close();
        return;
    }

    const cookies = parse(request.headers.cookie || "");
    const token = cookies.accessToken;

    console.log("access token", token);

    if (!token) {
        ws.close();
        return;
    }

    const userId = checkUser(token);
    if (!userId) {
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws,
    });

    console.log("users", users);

    ws.on("message", async function message(data) {
        const jsonString = typeof data === "string" ? data : data.toString();
        let parsedData = JSON.parse(jsonString);

        if (typeof parsedData === "string") {
            parsedData = JSON.parse(parsedData);
        }

        if (parsedData.type === "join_room") {
            /**
             * {
             *  type: "join_room",
             *  roomId: string
             * }
             */

            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }

            // check if room exists
            const room = await db.query.projects.findFirst({
                where: eq(projects.id, parsedData.roomId),
            });

            if (!room) {
                return;
            }

            // check if already joined
            if (user.rooms.includes(parsedData.roomId)) {
                return;
            }

            user.rooms.push(parsedData.roomId);
        }

        if (parsedData.type === "leave_room") {
            /**
             * {
             *  type: "leave_room",
             *  roomId: string
             * }
             */
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }

            user.rooms = user.rooms.filter(
                (roomId) => roomId !== parsedData.roomId
            );
        }

        if (parsedData.type === "chat") {
            /**
             * {
             *  type: "chat",
             *  roomId: string,
             *  message: string
             * }
             */
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            // check if room exists
            const room = await db.query.projects.findFirst({
                where: eq(projects.id, parsedData.roomId),
            });

            if (!room) {
                return;
            }

            await db.insert(chats).values({
                projectId: roomId,
                userId,
                message,
            });

            users.forEach((user) => {
                if (user.rooms.includes(roomId) && user.ws !== ws) {
                    user.ws.send(
                        JSON.stringify({
                            type: "chat",
                            roomId,
                            message,
                        })
                    );
                }
            });
        }
    });

    ws.on("close", function close() {
        const user = users.find((user) => user.ws === ws);
        if (!user) {
            return;
        }

        users = users.filter((user) => user.ws !== ws);
    });
});
