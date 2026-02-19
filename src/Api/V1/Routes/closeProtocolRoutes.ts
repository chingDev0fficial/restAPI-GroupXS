import { Router } from "express";
import CloseProtocolController from "../Controllers/CloseProtocolCotroller";
import { requireAuth, requireScope } from "../../../Middleware/authMiddleware";

const router = Router();
const closeProtocolController = new CloseProtocolController();

router.get(
  "/fetch-all",
  requireAuth, // ✅ must be logged in
  requireScope("read"),
  closeProtocolController.fetchAllClosedProtocols.bind(closeProtocolController),
);

router.get(
  "/fetch-by-id/:id",
  requireAuth, // ✅ must be logged in
  requireScope("read"),
  closeProtocolController.getClosedProtocolById.bind(closeProtocolController),
);

export default router;
