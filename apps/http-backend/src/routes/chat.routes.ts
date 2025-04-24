import { Router } from "express";
import chatController from "../controllers/chat.controller";
import auth from "../middlewares/auth";

const router: Router = Router();

router.get("/all/:projectId", auth, chatController.getAllChats);

export default router;
