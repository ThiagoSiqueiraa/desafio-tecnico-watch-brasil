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

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags:
 *       - tasks
 *     summary: Criar uma tarefa
 *     operationId: createTask
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             exemplo:
 *               value:
 *                 title: "11"
 *                 description: "11"
 *                 priority: "low"
 *                 status: "completed"
 *                 dueDate: "2025-09-22T03:00:00.000Z"
 *                 checklist:
 *                   - { "title": "sample1" }
 *                   - { "title": "sample2" }
 *                   - { "title": "sample3" }
 *     responses:
 *       '201':
 *         description: Criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskList'
 */
router.post("/", verifyToken, (req, res) => taskController.create(req, res));

/**
 * @openapi
 * /tasks/{projectId}:
 *   get:
 *     tags:
 *       - tasks
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
router.get("/:projectId", verifyToken, (req, res) =>
  taskController.listByProject(req, res)
);

/**
 * @openapi
 * /tasks/getById/{id}:
 *   get:
 *     tags:
 *       - tasks
 *     summary: Recupera informações de uma tarefa especifica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa a ser visualizada
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items: { $ref: "#/components/schemas/TaskView" }
 */
router.get("/getById/:id", verifyToken, (req, res) =>
  taskController.getById(req, res)
);

/**
 * @openapi
 * /tasks/{taskId}:
 *   put:
 *     tags:
 *       - tasks
 *     summary: Atualiza uma tarefa
 *     operationId: updateTask
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             exemplo:
 *               value:
 *                 title: "11"
 *                 description: "11"
 *                 priority: "low"
 *                 status: "completed"
 *                 dueDate: "2025-09-22T03:00:00.000Z"
 *                 checklist:
 *                   - title: "sample1"
 *                   - title: "sample2"
 *                   - title: "sample3"
 *     responses:
 *       '200':
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskList'
 */

router.put("/:id", verifyToken, (req, res) => taskController.update(req, res));
export default router;
