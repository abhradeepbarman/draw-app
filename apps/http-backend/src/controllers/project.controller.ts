import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/customErrorHandler";
import ResponseHandler from "../utils/responseHandler";
import { projects } from "@repo/db/schemas";

const projectControllers = {
	async createProject(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { id } = req.user;

			const [newProject] = await db
				.insert(projects)
				.values({
					adminId: id,
				})
				.returning();

			return res
				.status(201)
				.send(ResponseHandler(201, "Project created successfully", newProject));
		} catch (error) {
			return next(error);
		}
	},

	async updateProject(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { name } = req.body;
			const { id } = req.params;

			if (!name) {
				return next(CustomErrorHandler.badRequest("Name is required"));
			}

			const projectDetails = await db.query.projects.findFirst({
				where: eq(projects.id, id!),
			});

			if (!projectDetails) {
				return next(CustomErrorHandler.notFound("Room not found"));
			}

			const [updatedProject] = await db
				.update(projects)
				.set({ name })
				.where(eq(projects.id, id!))
				.returning();

			return res
				.status(200)
				.send(
					ResponseHandler(200, "Project updated successfully", updatedProject)
				);
		} catch (error) {
			return next(error);
		}
	},

	async getAllProjects(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { id } = req.user;

			const allProjects = await db.query.projects.findMany({
				where: eq(projects.adminId, id!),
			});

			return res
				.status(200)
				.send(
					ResponseHandler(200, "Projects fetched successfully", allProjects)
				);
		} catch (error) {
			return next(error);
		}
	},

	async deleteProject(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { id } = req.params;
			const { id: userId } = req.user;

			const projectDetails = await db.query.projects.findFirst({
				where: eq(projects.id, id!),
			});

			if (!projectDetails) {
				return next(CustomErrorHandler.notFound("Room not found"));
			}

			if (projectDetails.adminId !== userId) {
				return next(CustomErrorHandler.unAuthorized("You are not authorized"));
			}

			await db.delete(projects).where(eq(projects.id, id!));

			return res
				.status(200)
				.send(ResponseHandler(200, "Room deleted successfully"));
		} catch (error) {
			return next(error);
		}
	},
};

export default projectControllers;
