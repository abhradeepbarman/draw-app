import express, { NextFunction, Request, Response } from 'express';
import config from '@repo/backend-common/config';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import chatRoutes from './routes/chat.routes';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: config.FRONTEND_URL,
	})
);

/** Routes */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/chat', chatRoutes);

/** Custom error handling  */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	errorHandler(err, req, res, next);
});

/** 404 not found */
app.use((req: Request, res: Response) => {
	res.status(404).json({
		status: 404,
		message: '404 not found',
	});
});

app.listen(config.PORT, () => {
	console.log(`http-backend listening on port ${config.PORT}`);
});
