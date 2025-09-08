import { Task } from "../entities/Task";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { TaskChecklist } from "../entities/TaskChecklist";

export class ListTasksByProjectService {
  reversePriorityDictonary: {
    [key: number]: string;
  } = { 1: "low", 2: "medium", 3: "high" };

  constructor(private tasksRepository: Repository<Task>) {
    this.tasksRepository = tasksRepository;
  }

  async execute(input: { projectId: number }): Promise<any> {
    const { projectId } = input;

    if (!projectId) {
      throw new Error("ID do projeto é obrigatório");
    }

    const tasks = await this.tasksRepository.find({
      where: { project: { id: Number(projectId) } },
      relations: ["checklist"],
      order: { updatedAt: "DESC" },
    });

    const output = tasks.map((t) => {
      return {
        id: t.id,
        title: t.title,
        status: t.status,
        priority: this.reversePriorityDictonary[t.priority],
        dueDate: t.dueDate,
        description: t.description,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        completedSubtasks:
          t.checklist?.filter((c: TaskChecklist) => c.isDone).length || 0,
        totalSubtasks: t.checklist?.length || 0,
      };
    });
    return output;
  }
}
