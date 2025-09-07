import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TaskChecklist } from "../entities/TaskChecklist";

export class TasksController {
  constructor() {}

  async create(req: Request, res: Response) {
    const { title, status, priority, dueDate, description, checklist } =
      req.body;
    if (!title) {
      return res.status(400).json({ message: "Título é obrigatório" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status é obrigatório" });
    }

    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({
        message:
          "Status inválido, informe os status possíveis: 'pending', 'in_progress', 'completed'",
      });
    }

    if (!priority) {
      return res.status(400).json({ message: "Prioridade é obrigatória" });
    }

    const priorityDictonary: {
      [key: string]: number;
    } = { low: 1, medium: 2, high: 3 };

    if (!dueDate) {
      return res
        .status(400)
        .json({ message: "Data de vencimento é obrigatória" });
    }

    //checa o formato da data
    if (isNaN(Date.parse(dueDate))) {
      return res
        .status(400)
        .json({ message: "Data de vencimento em formato inválido" });
    }

    if (!checklist || checklist.length === 0) {
      return res.status(400).json({
        message: "Checklist é obrigatória e deve ter ao menos um item",
      });
    }

    const actualProjectUser = await AppDataSource.getRepository("User").find({
      where: { id: (req as any).user.id },
      relations: ["currentProject"],
    });

    if (actualProjectUser.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!actualProjectUser[0].currentProject) {
      return res
        .status(400)
        .json({ message: "Usuário não está em um projeto" });
    }

    const projectId = actualProjectUser[0].currentProject.id;

    const tasksRepository = await AppDataSource.getRepository("Task");
    // Cria as entidades de checklist associadas à tarefa

    const newTask = await tasksRepository.create({
      title,
      status,
      priority: priorityDictonary[priority],
      dueDate: dueDate,
      project: { id: projectId },
      description,
    });

    const savedTask = await tasksRepository.save(newTask);

    const checklistEntities = checklist.map((it: any, idx: number) =>
      AppDataSource.getRepository("TaskChecklist").create({
        title: it.title,
        done: !!it.done,
        order: it.order ?? idx,
        task: { id: savedTask.id }, // associa por FK
      })
    );

    await AppDataSource.getRepository("TaskChecklist").save(checklistEntities);

    res.json({
      ...newTask,
      completedSubtasks: 0,
      totalSubtasks: checklist.length,
    });
  }

  async listByProject(req: Request, res: Response) {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "ID do projeto é obrigatório" });
    }

    const tasksRepository = await AppDataSource.getRepository("Task");
    const tasks = await tasksRepository.find({
      where: { project: { id: Number(projectId) } },
      relations: ["checklist"],
      order: { updatedAt: "ASC" },
    });

    const output = tasks.map((t) => {
      return {
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        description: t.description,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        completedSubtasks:
          t.checklist?.filter((c: TaskChecklist) => c.isDone).length || 0,
        totalSubtasks: t.checklist?.length || 0,
      };
    });
    res.json(output);
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
    
    console.log(task)
    const output = {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        description: task.description,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        checklist: task.checklist,
        projectId: task.project.id,
    };
    
    res.json(output);
  }
}
