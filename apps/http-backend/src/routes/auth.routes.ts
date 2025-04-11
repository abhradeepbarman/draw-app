import express, { Router } from "express";
import authControllers from "../controllers/auth.controllers";

const router: Router = express.Router();

router.post("/login", authControllers.login);
router.post("/register", authControllers.register);
router.post("/logout", authControllers.logout);
router.post("/refresh", authControllers.refresh);

export default router;
