import config from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import User from "./@types/user.types";
import {db} from "@repo/db";
import { chats } from "@repo/db/schema";

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
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");

    const userId = checkUser(token!);
    if (!userId) {
        ws.close();
        return;
    }

    users.push({
        userId,
        rooms: [],
        ws,
    });

    ws.on("message", async function message(data) {
        const parsedData = JSON.parse(data.toString());

        if (parsedData.type === "join_room") {
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }

            //TODO: roomID is valid or not

            user.rooms.push(parsedData.roomId);
        }

        if (parsedData.type === "leave_room") {
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }

            user.rooms = user.rooms.filter(
                (roomId) => roomId !== parsedData.roomId
            );
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            await db.insert(chats).values({
                roomId,
                userId,
                message
            })

            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
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
