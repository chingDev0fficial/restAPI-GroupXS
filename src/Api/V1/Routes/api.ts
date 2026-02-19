import { Router } from "express";
import userRoutes from "./userRoutes";
import closeProtocolRoutes from "./closeProtocolRoutes";
import authRoutes from "./authRoutes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/close-protocol", closeProtocolRoutes);

export default router;
