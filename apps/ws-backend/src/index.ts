import { WebSocketServer } from "ws";
import config from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: Number(config.PORT) });

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    const decoded = jwt.verify(token!, config.ACCESS_SECRET);

    if (!decoded) {
        ws.close();
        return;
    }

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });
});
