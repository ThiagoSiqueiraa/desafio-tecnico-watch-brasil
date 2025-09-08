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
router.post("/", verifyToken, (req, res) => taskController.create(req, res));
router.get("/:projectId", verifyToken, (req, res) =>
  taskController.listByProject(req, res)
);
router.get("/getById/:id", verifyToken, (req, res) =>
  taskController.getById(req, res)
);
router.put("/:id", verifyToken, (req, res) => taskController.update(req, res));
export default router;
