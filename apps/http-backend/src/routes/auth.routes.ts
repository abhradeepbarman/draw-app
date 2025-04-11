import express, { Router } from "express";
import authControllers from "../controllers/auth.controllers";
import auth from "../middlewares/auth";

const router: Router = express.Router();

router.post("/register", authControllers.register);
router.post("/login", authControllers.login);
router.post("/logout", auth, authControllers.logout);
router.post("/refresh", authControllers.refresh);

export default router;
