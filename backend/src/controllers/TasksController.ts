import { Request, Response } from "express";
import { TasksService } from "../services/TasksService";
import { ListTasksByProjectService } from "../services/ListTasksByProjectService";
import { GetTaskService } from "../services/GetTaskService";

export class TasksController {
  constructor(
    private tasksService: TasksService,
    private listTasksByProjectService: ListTasksByProjectService,
    private getTaskService: GetTaskService
  ) {
    this.tasksService = tasksService;
    this.listTasksByProjectService = listTasksByProjectService;
    this.getTaskService = getTaskService;
  }

  async create(req: Request, res: Response) {
    try {
      const { title, status, priority, dueDate, description, checklist } =
        req.body;
      const userId = (req as any).userId;
      const output = await this.tasksService.create({
        title,
        status,
        priority,
        dueDate,
        description,
        checklist,
        userId,
      });
      res.json(output);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async listByProject(req: Request, res: Response) {
    const { projectId } = req.params;

    try {
      const output = await this.listTasksByProjectService.execute({
        projectId: Number(projectId),
      });
      return res.json(output);
    } catch (e) {
      return res.status(400).json({ message: (e as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const output = await this.getTaskService.execute({ id: Number(id) });
      res.json(output);
    } catch (e) {
      return res.status(400).json({ message: (e as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, status, priority, dueDate, description, checklist } =
        req.body;

      const output = await this.tasksService.update(Number(id), {
        title,
        status,
        priority,
        dueDate,
        description,
        checklist,
      });
      res.json(output);
    } catch (e) {
      return res.status(400).json({ message: (e as Error).message });
    }
  }
}
