import { ITasksRepository } from "../interface/ITasksRepository";
import { Task } from "../entities/Task";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { TaskChecklist } from "../entities/TaskChecklist";
import { AppDataSource } from "../data-source";

export class TasksService {
  priorityDictonary: {
    [key: string]: number;
  } = { low: 1, medium: 2, high: 3 };

  reversePriorityDictonary: {
    [key: number]: string;
  } = { 1: "low", 2: "medium", 3: "high" };

  constructor(
    private taskRepository: Repository<Task>,
    private userRepository: Repository<User>,
    private checklistRepository: Repository<TaskChecklist>
  ) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
    this.checklistRepository = checklistRepository;
  }

  async create(input: {
    title: string;
    status: string;
    priority: string;
    dueDate: string;
    description?: string;
    checklist: { title: string; done?: boolean; order?: number }[];
    userId: number;
  }): Promise<{
    id: number;
    title: string;
    status: string;
    priority: number;
    dueDate: Date;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    completedSubtasks: number;
    totalSubtasks: number;
  }> {
    const { title, status, priority, dueDate, description, checklist, userId } =
      input;
    if (!title) {
      throw new Error("Título é obrigatório");
    }

    if (!status) {
      throw new Error("Status é obrigatório");
    }

    if (!["pending", "in_progress", "completed"].includes(status)) {
      throw new Error(
        "Status inválido, informe os status possíveis: 'pending', 'in_progress', 'completed'"
      );
    }

    if (!priority) {
      throw new Error("Prioridade é obrigatória");
    }

    if (!dueDate) {
      throw new Error("Data de vencimento é obrigatória");
    }

    if (isNaN(Date.parse(dueDate))) {
      throw new Error("Data de vencimento em formato inválido");
    }

    if (!checklist || checklist.length === 0) {
      throw new Error("Checklist é obrigatória e deve conter ao menos um item");
    }

    const actualProjectUser = await this.userRepository.find({
      where: { id: userId },
      relations: ["currentProject"],
    });

    if (actualProjectUser.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    if (!actualProjectUser[0].currentProject) {
      throw new Error("Usuário não está em um projeto");
    }

    const projectId = actualProjectUser[0].currentProject.id;

    const newTask = await this.taskRepository.create({
      title,
      status,
      priority: this.priorityDictonary[priority],
      dueDate: new Date(dueDate),
      project: { id: projectId },
      description,
    });

    const savedTask = await this.taskRepository.save(newTask);

    const checklistEntities = checklist.map((it: any, idx: number) =>
      this.checklistRepository.create({
        ...(it.title && { title: it.title }),
        ...(typeof it.done !== "undefined" && { done: !!it.done }),
        ...(typeof it.order !== "undefined"
          ? { order: it.order }
          : { order: idx }),
        task: { id: savedTask.id },
      } as Partial<TaskChecklist>)
    );

    await this.checklistRepository.save(checklistEntities);

    return {
      id: savedTask.id,
      title: savedTask.title,
      status: savedTask.status,
      priority: savedTask.priority,
      dueDate: savedTask.dueDate as Date,
      description: savedTask.description,
      createdAt: savedTask.createdAt,
      updatedAt: savedTask.updatedAt,
      completedSubtasks: 0,
      totalSubtasks: checklist.length,
    };
  }

  async update(
    id: number,
    input: {
      title: string;
      status: string;
      priority: string;
      dueDate: string;
      description?: string;
      checklist: { title: string; done?: boolean; order?: number }[];
    }
  ): Promise<{
    id: number;
    title: string;
    status: string;
    priority: string;
    dueDate: Date;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    checklist: TaskChecklist[];
    projectId: number;
  }> {
    const { title, status, priority, dueDate, description, checklist } = input;
    if (!id) {
      throw new Error("ID da tarefa é obrigatório");
    }
    if (!title) {
      throw new Error("Título é obrigatório");
    }

    if (!status) {
      throw new Error("Status é obrigatório");
    }
    if (!["pending", "in_progress", "completed"].includes(status)) {
      throw new Error(
        "Status inválido, informe os status possíveis: 'pending', 'in_progress', 'completed'"
      );
    }
    if (!priority) {
      throw new Error("Prioridade é obrigatória");
    }
    if (!dueDate) {
      throw new Error("Data de vencimento é obrigatória");
    }
    //checa o formato da data
    if (isNaN(Date.parse(dueDate))) {
      throw new Error("Data de vencimento em formato inválido");
    }
    if (!checklist || checklist.length === 0) {
      throw new Error("Checklist é obrigatória e deve conter ao menos um item");
    }
    const task = await this.taskRepository.findOne({
      where: { id: Number(id) },
      relations: ["checklist", "project"],
    });
    if (!task) {
      throw new Error("Tarefa não encontrada");
    }
    task.title = title;
    task.status = status;
    task.priority = this.priorityDictonary[priority];
    task.dueDate = new Date(dueDate);
    task.description = description;

    await this.taskRepository.save(task);

    await this.checklistRepository.delete({ task: { id: task.id } });
    const checklistEntities = checklist.map((it: any, idx: number) =>
      this.checklistRepository.create({
        ...(it.title && { title: it.title }),
        ...(typeof it.done !== "undefined" && { done: !!it.done }),
        ...(typeof it.order !== "undefined"
          ? { order: it.order }
          : { order: idx }),
        task: { id: task.id },
      } as Partial<TaskChecklist>)
    );
    await this.checklistRepository.save(checklistEntities);
    const output = {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: this.reversePriorityDictonary[task.priority],
      dueDate: task.dueDate,
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      checklist: checklistEntities,
      projectId: task.project.id,
    };
    return output;
  }
}
