import { Router } from "express";
import projectControllers from "../controllers/project.controller";
import auth from "../middlewares/auth";

const router: Router = Router();

router.get("/:id", auth, projectControllers.getProjectDetails);
router.get("/", auth, projectControllers.getAllProjects);
router.post("/", auth, projectControllers.createProject);
router.delete("/:id", auth, projectControllers.deleteProject);
router.put("/:id", auth, projectControllers.updateProject);

router.post("/redirect", auth, projectControllers.createRedirect);
router.get(
	"/redirect/:projectId",
	auth,
	projectControllers.getProjectRedirectUrl
);

export default router;
