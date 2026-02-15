import { Router } from "express";
import userRoutes from "./userRoutes";
import testRoutes from "./testRoutes";

const router = Router();
router.use("/user", userRoutes);
router.use("/test", testRoutes);

export default router;
