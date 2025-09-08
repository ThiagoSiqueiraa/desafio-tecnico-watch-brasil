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

/**
 * @openapi
 * /projects/addMember/{projectId}:
 *   post:
 *     tags:
 *       - projects
 *     summary: Adicionar membro ao projeto
 *     operationId: addProjectMember
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@exemplo.com"
 *     responses:
 *       '201':
 *         description: Membro adicionado com sucesso (sem conteúdo no corpo)
 */
router.post("/addMember/:projectId", verifyToken, (req, res) =>
  projectController.addMember(req, res)
);

/**
 * @openapi
 * /projects/members/{projectId}:
 *   get:
 *     tags:
 *       - projects
 *     summary: Listar membros de um projeto
 *     operationId: listProjectMembers
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
 *       '200':
 *         description: Lista de membros do projeto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Fulaninho de tal"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "sample@gmail.com"
 *       '401':
 *         description: Não autenticado
 *       '404':
 *         description: Projeto não encontrado
 */
router.get("/members/:projectId", verifyToken, (req, res) =>
  projectController.listMembers(req, res)
);

/**
 * @openapi
 * /projects/changeActualProject/{projectId}:
 *   put:
 *     tags:
 *       - projects
 *     summary: Alterar projeto atual do usuário autenticado
 *     operationId: changeActualProject
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do novo projeto a ser definido como atual
 *     responses:
 *       '200':
 *         description: Projeto atual alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Projeto atual alterado com sucesso"
 *                 currentProject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Projeto de Exemplo"
 *       '400':
 *         description: Requisição inválida
 *       '401':
 *         description: Não autenticado
 *       '404':
 *         description: Usuário ou projeto não encontrado
 *       '403':
 *         description: Usuário não é membro do projeto
 */
router.put("/changeActualProject/:projectId", verifyToken, (req, res) =>
  projectController.changeActualProject(req, res)
);

/**
 * @openapi
 * /projects/removeMember/{projectId}:
 *   delete:
 *     tags:
 *       - projects
 *     summary: Remover membro do projeto
 *     operationId: removeProjectMember
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       '204':
 *         description: Membro removido com sucesso (sem conteúdo no corpo)
 */
router.delete("/removeMember/:projectId", verifyToken, (req, res) =>
  projectController.removeMember(req, res)
);
export default router;
