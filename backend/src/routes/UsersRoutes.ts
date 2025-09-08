import { Router } from "express";
import { UsersController } from "../controllers/UsersController";
import { CreateUserService } from "../services/users/CreateUserService";
import { AppDataSource } from "../data-source";
import { GetProfileService } from "../services/users/GetProfileService";
import { verifyToken } from "../middleware/checkAuth";

const router = Router();
const usersController = new UsersController(
  new CreateUserService(AppDataSource.getRepository("User")),
  new GetProfileService(AppDataSource.getRepository("User"))
);

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - users
 *     summary: Criar um novo usuário
 *     operationId: createUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           examples:
 *             exemplo:
 *               value:
 *                 name: "Fulano de Tal"
 *                 email: "usuario@exemplo.com"
 *                 password: "123456"
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Fulano de Tal"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "usuario@exemplo.com"
 */
router.post("/", (req, res) => usersController.create(req, res));

/**
 * @openapi
 * /users/profile:
 *   get:
 *     tags:
 *       - users
 *     summary: Recupera o perfil do usuário autenticado
 *     operationId: getProfileUser
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil do usuário recuperado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Fulano de Tal"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "usuario@exemplo.com"
 *                 currentProject:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 */
router.get("/profile", verifyToken, (req, res) => usersController.profile(req, res));


export default router;
