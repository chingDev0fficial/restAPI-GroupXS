import { Router } from "express";
import UserController from "../Controllers/UserController";

const router = Router();
const userController = new UserController();

router.get("/index", userController.index.bind(userController));

export default router;
