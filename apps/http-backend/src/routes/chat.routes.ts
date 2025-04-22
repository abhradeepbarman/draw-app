import { Router } from "express";
import auth from "../middlewares/auth";
import chatController from "../controllers/chat.controller";

const router: Router = Router();

router.get("/all/:roomId", auth, chatController.getAllChats);

export default router;
