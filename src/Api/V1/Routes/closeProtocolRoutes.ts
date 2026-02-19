import { Router } from "express";
import CloseProtocolController from "../Controllers/CloseProtocolCotroller";

const router = Router();
const closeProtocolController = new CloseProtocolController();

router.get(
    "/fetch-all",
    closeProtocolController.fetchAllClosedProtocols.bind(closeProtocolController)
);

router.get(
    "/fetch-by-id/:id",
    closeProtocolController.getClosedProtocolById.bind(closeProtocolController)
);

export default router;
