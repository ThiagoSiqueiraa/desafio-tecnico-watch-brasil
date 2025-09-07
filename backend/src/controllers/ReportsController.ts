import { Request, Response } from "express";
import { Task } from "../entities/Task";
import { AppDataSource } from "../data-source";

export class ReportsController {
  async generateReport(req: Request, res: Response) {
    const projectId = Number(req.query.projectId);
    if (!projectId) {
      return res.status(400).json({ message: "projectId é obrigatório" });
    }

    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const status = await taskRepo
        .createQueryBuilder("task")
        .select([
          "SUM(CASE WHEN task.status = 'pending' THEN 1 ELSE 0 END) AS pending",
          "SUM(CASE WHEN task.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress",
          "SUM(CASE WHEN task.status = 'completed' THEN 1 ELSE 0 END) AS completed",
        ])
        .where("task.project_id = :projectId", { projectId })
        .andWhere("task.deleted_at IS NULL")
        .getRawOne();

      const now = new Date();
      const due = await taskRepo
        .createQueryBuilder("task")
        .select([
          "SUM(CASE WHEN task.due_date IS NOT NULL AND task.due_date < :now AND task.status <> 'completed' THEN 1 ELSE 0 END) AS overdue",
          "SUM(CASE WHEN task.due_date IS NOT NULL AND task.due_date >= :now AND task.status <> 'completed' THEN 1 ELSE 0 END) AS ontime",
        ])
        .where("task.project_id = :projectId", { projectId })
        .andWhere("task.deleted_at IS NULL")
        .setParameter("now", now)
        .getRawOne();

      return res.json({
        status: {
          pending: Number(status.pending) || 0,
          in_progress: Number(status.in_progress) || 0,
          completed: Number(status.completed) || 0,
        },
        due: {
          overdue: Number(due.overdue) || 0,
          onTime: Number(due.ontime) || 0,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Erro ao gerar relatórios" });
    }
  }
}
