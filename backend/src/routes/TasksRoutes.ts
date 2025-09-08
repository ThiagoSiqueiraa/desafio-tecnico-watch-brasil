import { Router } from "express";
import { TasksController } from "../controllers/TasksController";
import { verifyToken } from "../middleware/checkAuth";

import { TasksService } from "../services/TasksService";
import { AppDataSource } from "../data-source";
const router = Router();
const taskController = new TasksController(
  new TasksService(
    AppDataSource.getRepository("Task"),
    AppDataSource.getRepository("User"),
    AppDataSource.getRepository("TaskChecklist")
  )
);
router.post("/", verifyToken, taskController.create);
router.get("/:projectId", verifyToken, taskController.listByProject);
router.get("/getById/:id", verifyToken, taskController.getById);
router.put("/:id", verifyToken, taskController.update);
export default router;
