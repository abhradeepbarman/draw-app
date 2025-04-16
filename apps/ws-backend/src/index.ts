import config from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import User from "./@types/user.type";

const wss = new WebSocketServer({ port: Number(config.PORT) });

const users: User[] = [];

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    const decoded = jwt.verify(token!, config.ACCESS_SECRET);

    if (typeof decoded === "string") {
        return null;
    }

    if (!decoded || !decoded?.id) {
        ws.close();
        return;
    }

    const userId = decoded.id;
    users.push({
        userId,
        room: [],
        ws,
    });

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });
});
