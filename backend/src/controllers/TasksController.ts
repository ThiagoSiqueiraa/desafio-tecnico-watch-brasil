import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TaskChecklist } from "../entities/TaskChecklist";
import { TasksService } from "../services/TasksService";
import { ListTasksByProjectService } from "../services/ListTasksByProjectService";

const priorityDictonary: {
  [key: string]: number;
} = { low: 1, medium: 2, high: 3 };

const reversePriorityDictonary: {
  [key: number]: string;
} = { 1: "low", 2: "medium", 3: "high" };

export class TasksController {
  constructor(
    private tasksService: TasksService,
    private listTasksByProjectService: ListTasksByProjectService
  ) {
    this.tasksService = tasksService;
    this.listTasksByProjectService = listTasksByProjectService;
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
    const { id } = req.params;
    console.log("Received request to get task by ID:", id);

    if (!id) {
      return res.status(400).json({ message: "ID da tarefa é obrigatório" });
    }
    console.log("Fetching task with ID:", id);

    const tasksRepository = await AppDataSource.getRepository("Task");
    const task = await tasksRepository.findOne({
      where: { id: Number(id) },
      relations: ["checklist", "project"],
    });

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }

    const output = {
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate,
      priority: reversePriorityDictonary[task.priority],
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      checklist: task.checklist,
      projectId: task.project.id,
    };

    res.json(output);
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
