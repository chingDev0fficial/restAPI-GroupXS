import { Router } from "express";
// import the target controller here
// e.g. import NameController from "../Controllers/NameController";
import TestController from "../Controllers/TestController";

const router = Router();
// create a new instance of the target controller here
// e.g. const NameController = new NameController();
const testController = new TestController();

// Add your routes here
router.get("/index", testController.testIndex.bind(testController));

export default router;
