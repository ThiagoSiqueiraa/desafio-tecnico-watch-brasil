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
 *                 type: strings
 *                 example: "Fulano de Tal"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
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
 *       '400':
 *         description: Erro de validação (ex.: campos obrigatórios ausentes, e-mail duplicado, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email é obrigatório"
 */
router.post("/", (req, res) => usersController.create(req, res));


/**
 * @openapi
 * /users/profile:
 *   get:
 *     tags:
 *       - users
 *     summary: Obter perfil do usuário autenticado
 *     operationId: getUserProfile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil do usuário autenticado
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
 *                   example: "Fulano de tal"
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
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Projeto de Exemplo"
 *       '400':
 *         description: Erro ao buscar perfil (ex.: usuário não encontrado ou ID ausente no token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       '401':
 *         description: Não autenticado (token ausente ou inválido)
 */
router.get("/profile", verifyToken, (req, res) => usersController.profile(req, res));

export default router;
