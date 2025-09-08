import { Router } from "express";
import { verifyToken } from "../middleware/checkAuth";
import { ReportsController } from "../controllers/ReportsController";

const router = Router();
const reportsController = new ReportsController();

/**
 * @openapi
 * /reports:
 *   get:
 *     summary: Gera um relatório
 *     operationId: generateReport
 *     tags:
 *       - reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do projeto para gerar o relatório
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: integer
 *                       example: 5
 *                     in_progress:
 *                       type: integer
 *                       example: 3
 *                     completed:
 *                       type: integer
 *                       example: 12
 *                 due:
 *                   type: object
 *                   properties:
 *                     overdue:
 *                       type: integer
 *                       example: 2
 *                     onTime:
 *                       type: integer
 *                       example: 6
 */

router.get("/", verifyToken, reportsController.generateReport);

export default router;
