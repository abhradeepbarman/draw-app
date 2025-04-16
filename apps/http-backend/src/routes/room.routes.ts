import { Router } from "express";
import auth from "../middlewares/auth";
import roomControllers from "../controllers/room.controller";

const router: Router = Router();

router.post("/", auth, roomControllers.createRoom);

export default router;