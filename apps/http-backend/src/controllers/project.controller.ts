import { db } from "@repo/db";
import { eq, sql } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import CustomErrorHandler from "../utils/customErrorHandler";
import ResponseHandler from "../utils/responseHandler";
import { projects, redirects } from "@repo/db/schemas";
import config from "@repo/backend-common/config";
import { desc } from "drizzle-orm";

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
			const page = req.query.page ? Number(req.query.page) : 1;
			const limit = req.query.limit ? Number(req.query.limit) : 7;
			const offset = (page - 1) * limit;

			// fetch total count
			const [total] = await db
				.select({ count: sql<number>`count(*)` })
				.from(projects)
				.where(eq(projects.adminId, id!));

			if (!total) {
				return next(CustomErrorHandler.notFound("Projects not found"));
			}

			const allProjects = await db.query.projects.findMany({
				where: eq(projects.adminId, id!),
				orderBy: desc(projects.createdAt),
				limit,
				offset,
			});

			if (!allProjects) {
				return next(CustomErrorHandler.notFound("Projects not found"));
			}

			return res.status(200).send(
				ResponseHandler(200, "Projects fetched successfully", {
					projects: allProjects,
					totalPages: Math.ceil(total.count / limit),
					page,
					limit,
				})
			);
		} catch (error) {
			return next(error);
		}
	},

	async getProjectDetails(
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
				return next(CustomErrorHandler.notAllowed("You are not authorized"));
			}

			return res
				.status(200)
				.send(
					ResponseHandler(
						200,
						"Room details fetched successfully",
						projectDetails
					)
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

	async createRedirect(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
			const { projectId } = req.params;
			const { id } = req.user;
			const { editable } = req.query;

			if (!editable || !projectId) {
				return next(CustomErrorHandler.badRequest());
			}

			const projectDetails = await db.query.projects.findFirst({
				where: eq(projects.id, projectId!),
			});

			if (!projectDetails) {
				return next(CustomErrorHandler.notFound("Project not found"));
			}

			if (projectDetails.adminId !== id) {
				return next(CustomErrorHandler.unAuthorized());
			}

			const [newRedirect] = await db
				.insert(redirects)
				.values({
					projectId,
					editable: editable == "true",
					expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
				})
				.returning();

			return res
				.status(201)
				.send(
					ResponseHandler(201, "Redirect created successfully", newRedirect)
				);
		} catch (error) {
			return next(error);
		}
	},

	async getProjectRedirectUrl(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> {
		try {
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

			const redirectDetails = await db.query.redirects.findFirst({
				where: eq(redirects.projectId, projectId!),
			});

			if (!redirectDetails)
				return next(CustomErrorHandler.notFound("Redirect not found"));
			if (redirectDetails.expiryAt < new Date())
				return next(CustomErrorHandler.notFound("Redirect not found"));

			const redirectUrl = `${config.FRONTEND_URL}/canvas/${redirectDetails!.id}?redirect=true`;

			return res.status(200).send(
				ResponseHandler(200, "Success", {
					redirectUrl,
					expiryAt: redirectDetails!.expiryAt,
				})
			);
		} catch (error) {
			return next(error);
		}
	},
};

export default projectControllers;
