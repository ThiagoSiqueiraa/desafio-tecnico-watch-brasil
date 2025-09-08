import { Router } from "express";
import { verifyToken } from "../middleware/checkAuth";
import { ProjectsController } from "../controllers/ProjectsController";
import { CreateProjectService } from "../services/projects/CreateProjectService";
import { AppDataSource } from "../data-source";
import { GetProjectService } from "../services/projects/GetProjectService";
import { ListProjectsService } from "../services/projects/ListProjectsService";
import { AddMemberInProjectService } from "../services/projects/AddMemberInProjectService";
import { ListMembersInProjectService } from "../services/projects/ListMembersInProjectService";
import { ChangeActualProjectService } from "../services/users/ChangeActualProjectService";
import { RemoveMemberOfProjectService } from "../services/projects/RemoveMemberOfProjectService";

const router = Router();
const projectController = new ProjectsController(
  new CreateProjectService(
    AppDataSource.getRepository("Project"),
    AppDataSource.getRepository("ProjectMember")
  ),
  new GetProjectService(AppDataSource.getRepository("Project")),
  new ListProjectsService(AppDataSource.getRepository("ProjectMember")),
  new AddMemberInProjectService(
    AppDataSource.getRepository("Project"),
    AppDataSource.getRepository("ProjectMember"),
    AppDataSource.getRepository("User")
  ),
  new ListMembersInProjectService(AppDataSource.getRepository("Project")),
  new ChangeActualProjectService(
    AppDataSource.getRepository("Project"),
    AppDataSource.getRepository("User"),
    AppDataSource.getRepository("ProjectMember")
  ),
  new RemoveMemberOfProjectService(
    AppDataSource.getRepository("Project"),
    AppDataSource.getRepository("User"),
    AppDataSource.getRepository("ProjectMember")
  )
);

/**
 * @openapi
 * /projects:
 *   post:
 *     tags:
 *       - projects
 *     summary: Criar um projeto
 *     operationId: createProject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *           examples:
 *             exemplo:
 *               value:
 *                name: "Projeto Exemplo"
 *     responses:
 *       '201':
 *         description: Criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectList'
 */
router.post("/", verifyToken, (req, res) => projectController.create(req, res));


router.get("/:id", verifyToken, (req, res) =>
  projectController.getById(req, res)
);

/**
 * @openapi
 * /projects:
 *   get:
 *     tags:
 *       - projects
 *     summary: Listar projetos do usuário
 *     operationId: listProjects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Listado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: "#/components/schemas/ProjectList" }
 */
router.get("/", verifyToken, (req, res) => projectController.list(req, res));
router.delete("/:id", verifyToken, (req, res) =>
  projectController.delete(req, res)
);
router.post("/addMember/:projectId", verifyToken, (req, res) =>
  projectController.addMember(req, res)
);
router.get("/members/:projectId"  , verifyToken, (req, res) =>
  projectController.listMembers(req, res)
);
router.put("/changeActualProject/:projectId", verifyToken, (req, res) =>
  projectController.changeActualProject(req, res)
);
router.delete("/removeMember/:projectId", verifyToken, (req, res) =>
  projectController.removeMember(req, res)
);
export default router;
