import { Router } from "express";
import { TasksController } from "../controllers/TasksController";
import { verifyToken } from "../middleware/checkAuth";

const router = Router();
const taskController = new TasksController();
router.post("/", verifyToken, taskController.create);
router.get("/:projectId", verifyToken, taskController.listByProject);
router.get("/getById/:id", verifyToken, taskController.getById);
router.put("/:id", verifyToken, taskController.update);
export default router;
