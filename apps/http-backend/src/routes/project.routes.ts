import { Router } from "express";
import projectControllers from "../controllers/project.controller";
import auth from "../middlewares/auth";

const router: Router = Router();

router.post("/", auth, projectControllers.createProject);
router.get("/", auth, projectControllers.getAllProjects);
router.delete("/:id", auth, projectControllers.deleteProject);
router.put("/:id", auth, projectControllers.updateProject);

export default router;
