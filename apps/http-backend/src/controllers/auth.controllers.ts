import { NextFunction, Request, Response } from "express";
import { registerSchema, loginSchema } from "@repo/common/schema";
import { db } from "@repo/db";
import { users, refreshTokens } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import ResponseHandler from "../utils/responseHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@repo/backend-common/config";

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, config.ACCESS_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, config.REFRESH_SECRET, {
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

            await db.insert(refreshTokens).values({
                token: refreshToken,
            });

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

            await db.insert(refreshTokens).values({
                token: refreshToken,
            });

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

    async logout(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res
                    .status(401)
                    .send(ResponseHandler(401, "Unauthorized"));
            }

            await db
                .delete(refreshTokens)
                .where(eq(refreshTokens.token, token));

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
                    .send(ResponseHandler(401, "Refresh token missing"));
            }

            const storedToken = await db.query.refreshTokens.findFirst({
                where: eq(refreshTokens.token, token),
            });

            if (!storedToken) {
                return res
                    .status(403)
                    .send(ResponseHandler(403, "Invalid refresh token"));
            }

            // Verify the refresh token
            const decoded = jwt.verify(token, config.REFRESH_SECRET) as {
                userId: string;
            };

            const { accessToken, refreshToken } = generateTokens(
                decoded.userId
            );

            await db
                .delete(refreshTokens)
                .where(eq(refreshTokens.token, token));
            await db.insert(refreshTokens).values({ token: refreshToken });

            return res.status(200).send(
                ResponseHandler(200, "Token refreshed successfully", {
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
