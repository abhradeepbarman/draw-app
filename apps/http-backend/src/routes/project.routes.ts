import { Router } from "express";
import projectControllers from "../controllers/project.controller";
import auth from "../middlewares/auth";

const router: Router = Router();

router.post("/", auth, projectControllers.createProject);

export default router;