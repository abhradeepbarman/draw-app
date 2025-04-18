import config from "@repo/backend-common/config";
import { loginSchema, registerSchema } from "@repo/common/schema";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ResponseHandler from "../utils/responseHandler";

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ id: userId }, config.ACCESS_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: userId }, config.REFRESH_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};

const authControllers = {
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const body = registerSchema.parse(req.body);
            const { name, email, password } = body;

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existingUser) {
                return res
                    .status(409)
                    .send(ResponseHandler(409, "User already exists"));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [newUser] = await db
                .insert(users)
                .values({
                    name,
                    email,
                    password: hashedPassword,
                })
                .returning();

            const { accessToken, refreshToken } = generateTokens(newUser?.id!);

            await db
                .update(users)
                .set({
                    refreshToken,
                })
                .where(eq(users.id, newUser?.id!));

            return res.status(201).send(
                ResponseHandler(201, "User Registered Successfully", {
                    accessToken,
                    refreshToken,
                })
            );
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const body = loginSchema.parse(req.body);
            const { email, password } = body;

            const user = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (!user) {
                return res
                    .status(401)
                    .send(ResponseHandler(401, "User not found"));
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) {
                return res
                    .status(401)
                    .send(ResponseHandler(401, "Invalid password"));
            }

            const { accessToken, refreshToken } = generateTokens(user.id);

            await db
                .update(users)
                .set({
                    refreshToken,
                })
                .where(eq(users.id, user.id));

            return res.status(200).send(
                ResponseHandler(200, "User logged in successfully", {
                    accessToken,
                    refreshToken,
                })
            );
        } catch (error) {
            return next(error);
        }
    },

    async logout(req: any, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.user.id;

            await db
                .update(users)
                .set({ refreshToken: null })
                .where(eq(users.id, id));

            return res
                .status(200)
                .send(ResponseHandler(200, "User logged out successfully"));
        } catch (error) {
            return next(error);
        }
    },

    async refresh(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res
                    .status(401)
                    .send(ResponseHandler(401, "Unauthorized access"));
            }

            const decoded = jwt.verify(token, config.REFRESH_SECRET) as {
                id: string;
            };

            if (!decoded) {
                return res
                    .status(401)
                    .send(ResponseHandler(401, "Unauthorized access"));
            }

            const user = await db.query.users.findFirst({
                where: eq(users.id, decoded.id),
            });

            if (!user) {
                return res
                    .status(401)
                    .send(ResponseHandler(401, "Unauthorized access"));
            }

            const { accessToken, refreshToken } = generateTokens(user.id);

            await db
                .update(users)
                .set({ refreshToken: refreshToken })
                .where(eq(users.id, user.id));

            return res.status(200).send(
                ResponseHandler(200, "Refresh token generated", {
                    accessToken,
                    refreshToken,
                })
            );
        } catch (error) {
            return next(error);
        }
    },
};

export default authControllers;
