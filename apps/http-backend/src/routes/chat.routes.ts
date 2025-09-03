import { Router } from "express";
import chatController from "../controllers/chat.controller";
import auth from "../middlewares/auth";

const router: Router = Router();

router.get("/all/:projectId", auth, chatController.getAllChats);
router.post("/:projectId", auth, chatController.sendChat);
router.delete("/:projectId", auth, chatController.deleteChats);
router.put("/:projectId", auth, chatController.updateChat);

router.get(
	"/redirect/:redirectId",
	auth,
	chatController.getAllChatsForRedirect
);

export default router;
