import { Task } from '../entities/Task';

export interface ITasksRepository {
    findAll(): Promise<Task[]>;
    findById(id: string): Promise<Task | null>;
    create(task: Task): Promise<Task>;
    update(id: string, task: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
    find(criteria: object): Promise<Task[]>;
}