import { Router } from "express";
import { TasksController } from "../controllers/TasksController";
import { verifyToken } from "../middleware/checkAuth";
import { TasksService } from "../services/TasksService";
import { AppDataSource } from "../data-source";
import { ListTasksByProjectService } from "../services/ListTasksByProjectService";
import { GetTaskService } from "../services/GetTaskService";
const router = Router();
const taskController = new TasksController(
  new TasksService(
    AppDataSource.getRepository("Task"),
    AppDataSource.getRepository("User"),
    AppDataSource.getRepository("TaskChecklist")
  ),
  new ListTasksByProjectService(AppDataSource.getRepository("Task")),
  new GetTaskService(AppDataSource.getRepository("Task"))
);


router.post("/", verifyToken, (req, res) => taskController.create(req, res));
router.get("/:projectId", verifyToken, (req, res) =>
  taskController.listByProject(req, res)
);
router.get("/getById/:id", verifyToken, (req, res) =>
  taskController.getById(req, res)
);
/**
 * @openapi
 * /tasks/{projectId}:
 *   get:
 *     summary: Lista tarefas do projeto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: "#/components/schemas/TaskList" }
 */
router.put("/:id", verifyToken, (req, res) => taskController.update(req, res));
export default router;
