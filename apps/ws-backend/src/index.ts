import config from "@repo/backend-common/config";
import { db } from "@repo/db";
import { projects } from "@repo/db/schemas";
import { parse } from "cookie";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";

interface User {
	userId: string;
	rooms: string[];
	ws: WebSocket;
}

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
		console.log(error);
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

			try {
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
			} catch (error) {
				console.log(error);
			}
		}

		if (parsedData.type === "leave_room") {
			/**
			 * {
			 *  type: "leave_room",
			 *  roomId: string
			 * }
			 */
			try {
				const user = users.find((user) => user.ws === ws);
				if (!user) {
					return;
				}

				user.rooms = user.rooms.filter(
					(roomId) => roomId !== parsedData.roomId
				);
			} catch (error) {
				console.log(error);
			}
		}

		if (parsedData.type === "chat") {
			/**
			 * {
			 *  type: "chat",
			 *  roomId: string,
			 *  message: string
			 * }
			 */
			try {
				const roomId = parsedData.roomId;
				const message = parsedData.message;

				// check if room exists
				const room = await db.query.projects.findFirst({
					where: eq(projects.id, parsedData.roomId),
				});

				if (!room) {
					return;
				}

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
			} catch (error) {
				console.log(error);
			}
		}

		if (parsedData.type === "delete_chat") {
			/**
			 * {
			 *  type: "delete_chat",
			 *  roomId: string,
			 *  message: string
			 * }
			 */
			try {
				const roomId = parsedData.roomId;
				const message = parsedData.message;

				// check if room exists
				const room = await db.query.projects.findFirst({
					where: eq(projects.id, parsedData.roomId),
				});

				if (!room) {
					return;
				}

				users.forEach((user) => {
					if (user.rooms.includes(roomId) && user.ws !== ws) {
						user.ws.send(
							JSON.stringify({
								type: "delete_chat",
								roomId,
								message,
							})
						);
					}
				});
			} catch (error) {
				console.log(error);
			}
		}
	});

	ws.on("close", () => {
		const user = users.find((user) => user.ws === ws);
		if (!user) {
			return;
		}

		users = users.filter((user) => user.ws !== ws);
	});
});
