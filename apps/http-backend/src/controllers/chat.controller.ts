import { db } from "@repo/db";
import { desc, eq, inArray } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/customErrorHandler";
import ResponseHandler from "../utils/responseHandler";
import { projects, chats } from "@repo/db/schemas";

const chatController = {
	async getAllChats(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { projectId } = req.params;

			const projectDetails = await db.query.projects.findFirst({
				where: eq(projects.id, projectId!),
			});

			if (!projectDetails) {
				return next(CustomErrorHandler.notFound("Project not found"));
			}

			const messages = await db.query.chats.findMany({
				where: eq(chats.projectId, projectId!),
				limit: 50,
				orderBy: desc(chats.createdAt),
			});

			return res
				.status(200)
				.send(ResponseHandler(200, "Messages fetched successfully", messages));
		} catch (error) {
			return next(error);
		}
	},

	async sendChat(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { projectId } = req.params;
			const { message } = req.body;
			const { id: userId } = req.user;

			if (!message || !projectId) {
				return next(CustomErrorHandler.badRequest());
			}

			const projectDetails = await db.query.projects.findFirst({
				where: eq(projects.id, projectId!),
			});

			if (!projectDetails) {
				return next(CustomErrorHandler.notFound("Project not found"));
			}

			const messageObj = JSON.parse(message);

			const [newChat] = await db
				.insert(chats)
				.values({ id: messageObj.id, projectId, message, userId })
				.returning();

			return res
				.status(201)
				.send(ResponseHandler(201, "Chat sent successfully", newChat));
		} catch (error) {
			return next(error);
		}
	},

	async deleteChats(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			/**
			 * [chatID 1, chatID 2, chatID 3]
			 */
			const body = req.body;
			const { projectId } = req.params;
			const { id } = req.user;

			const projectDetails = await db.query.projects.findFirst({
				where: eq(projects.id, projectId!),
			});

			if (!projectDetails) {
				return next(CustomErrorHandler.notFound("Project not found"));
			}

			if (projectDetails.adminId !== id) {
				return next(CustomErrorHandler.unAuthorized());
			}

			const jsonChats = JSON.parse(body.chats);
			await db.delete(chats).where(inArray(chats.id, jsonChats));

			return res
				.status(200)
				.send(ResponseHandler(200, "Chats deleted successfully"));
		} catch (error) {
			return next(error);
		}
	},
};

export default chatController;
