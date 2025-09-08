import { Task } from "../entities/Task";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { TaskChecklist } from "../entities/TaskChecklist";

export class GetTaskService {
  reversePriorityDictonary: {
    [key: number]: string;
  } = { 1: "low", 2: "medium", 3: "high" };

  constructor(private tasksRepository: Repository<Task>) {
    this.tasksRepository = tasksRepository;
  }

  async execute(input: { id: number }): Promise<any> {
    const { id } = input;

    if (!id) {
      throw new Error("ID da tarefa é obrigatório");
    }

    const task = await this.tasksRepository.findOne({
      where: { id: Number(id) },
      relations: ["checklist", "project"],
    });

    if (!task) {
      throw new Error("Tarefa não encontrada");
    }

    const output = {
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate,
      priority: this.reversePriorityDictonary[task.priority],
      description: task.description,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      checklist: task.checklist,
      projectId: task.project.id,
    };

    return output;
  }
}
