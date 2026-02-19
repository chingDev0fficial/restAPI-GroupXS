import { Router } from "express";
import UserController from "../Controllers/UserController";
import { requireAuth, requireScope } from "../../../Middleware/authMiddleware";

const router = Router();
const userController = new UserController();

// ✅ Protected: caller must supply a valid Bearer token with "read" scope
router.get(
  "/index",
  requireAuth,
  requireScope("read"),
  userController.index.bind(userController),
);

export default router;
