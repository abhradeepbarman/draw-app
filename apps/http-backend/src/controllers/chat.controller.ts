import { db } from "@repo/db";
import { chats, projects, redirects } from "@repo/db/schemas";
import { desc, eq, inArray } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/customErrorHandler";
import ResponseHandler from "../utils/responseHandler";

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
				orderBy: desc(chats.createdAt),
			});

			return res
				.status(200)
				.send(ResponseHandler(200, "Messages fetched successfully", messages));
		} catch (error) {
			return next(error);
		}
	},

	async getAllChatsForRedirect(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { redirectId } = req.params;
			if (!redirectId) return next(CustomErrorHandler.badRequest());

			const redirectDetails = await db.query.redirects.findFirst({
				where: eq(redirects.id, redirectId!),
			});

			if (!redirectDetails) {
				return next(CustomErrorHandler.notFound("Redirect not found"));
			}

			if (redirectDetails.expiryAt < new Date()) {
				return next(CustomErrorHandler.notFound("Redirect not found"));
			}

			const projectId = redirectDetails.projectId;
			const messages = await db.query.chats.findMany({
				where: eq(chats.projectId, projectId!),
				orderBy: desc(chats.createdAt),
			});

			return res.status(200).send(
				ResponseHandler(200, "Messages fetched successfully", {
					messages,
					projectId,
					editable: redirectDetails.editable,
				})
			);
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

	async updateChat(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
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

			const jsonChat = JSON.parse(body.message);
			const chatDetails = await db.query.chats.findFirst({
				where: eq(chats.id, jsonChat.id),
			});

			if (!chatDetails) {
				return next(CustomErrorHandler.notFound("Chat not found"));
			}

			await db
				.update(chats)
				.set({
					message: body.message,
				})
				.where(eq(chats.id, jsonChat.id));

			return res
				.status(200)
				.send(ResponseHandler(200, "Chat updated successfully"));
		} catch (error) {
			return next(error);
		}
	},
};

export default chatController;
