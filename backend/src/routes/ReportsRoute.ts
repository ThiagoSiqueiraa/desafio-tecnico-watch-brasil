import { Router } from "express";
import { verifyToken } from "../middleware/checkAuth";
import { ReportsController } from "../controllers/ReportsController";

const router = Router();
const reportsController = new ReportsController();
router.get("/", verifyToken, reportsController.generateReport);

export default router;
