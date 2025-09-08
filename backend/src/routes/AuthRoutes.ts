import { Router } from "express";
import { AppDataSource } from "../data-source";
import { LoginController } from "../controllers/AuthController";
import { LoginService } from "../services/auth/LoginService";

const router = Router();
const loginController = new LoginController(
  new LoginService(AppDataSource.getRepository("User"))
);
/**
 * @openapi
 * /auth:
 *   post:
 *     tags:
 *       - auth
 *     summary: Autenticar usuário
 *     operationId: login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
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
 *         description: Usuário autenticado com sucesso
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
 *                   example: "sample@gmail.com"
 *                 token:
 *                   type: string
 *                   description: JWT de acesso
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Erro de validação ou credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "E-mail ou senha inválido"
 */
router.post("/", (req, res) => loginController.login(req, res));

export default router;
