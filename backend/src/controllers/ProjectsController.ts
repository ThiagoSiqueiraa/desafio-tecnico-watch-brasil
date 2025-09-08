import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CreateProjectService } from "../services/projects/CreateProjectService";
import { GetProjectService } from "../services/projects/GetProjectService";
import { ListProjectsService } from "../services/projects/ListProjectsService";
import { AddMemberInProjectService } from "../services/projects/AddMemberInProjectService";
import { ListMembersInProjectService } from "../services/projects/ListMembersInProjectService";
import { ChangeActualProjectService } from "../services/users/ChangeActualProjectService";
import { RemoveMemberOfProjectService } from "../services/projects/RemoveMemberOfProjectService";

export class ProjectsController {
  constructor(
    private createProjectService: CreateProjectService,
    private getProjectService: GetProjectService,
    private listProjectsService: ListProjectsService,
    private addMemberInProjectService: AddMemberInProjectService,
    private listMembersInProjectService: ListMembersInProjectService,
    private changeActualProjectService: ChangeActualProjectService,
    private removeMemberOfProjectService: RemoveMemberOfProjectService
  ) {}

  async create(req: Request, res: Response) {
    const { name } = req.body;
    const userId = (req as any).user.id;

    try {
      const project = await this.createProjectService.execute({
        name,
        userId,
      });
      return res.status(201).json(project);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await this.getProjectService.execute({ id: Number(id) });
      return res.json(project);
    } catch (e) {
      return res.status(400).json({ message: (e as Error).message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const projects = await this.listProjectsService.execute({ userId });
      return res.json(projects);
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Erro ao obter usuário autenticado" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const projectRepository = await AppDataSource.getRepository("Project");
    const project = await projectRepository.findOne({
      where: { id: Number(id) },
      select: ["id"],
    });
    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    await projectRepository.remove(project);
    res.status(204).send();
  }

  async addMember(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { email } = req.body;
      const project = await this.addMemberInProjectService.execute({
        projectId: Number(projectId),
        email,
      });
      return res.status(201).json(project);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }

  async listMembers(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const members = await this.listMembersInProjectService.execute({
        projectId: Number(projectId),
      });
      return res.json(members);
    } catch (e: any) {
      return res.status(400).json({ message: e.message });
    }
  }

  async changeActualProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;

      const userId = (req as any).user.id;
      const project = await this.changeActualProjectService.execute({
        projectId: Number(projectId),
        userId,
      });
      return res.json({
        message: "Projeto atual alterado com sucesso",
        currentProject: project,
      });
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: e.message || "Erro interno do servidor" });
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const { userId } = req.body;
      const requestingUserId = (req as any).user.id;

      await this.removeMemberOfProjectService.execute({
        userIdToRemove: Number(userId),
        projectId: Number(projectId),
        requestingUserId,
      });

      return res.json({ message: "Membro removido com sucesso" });
    } catch (e) {
      return res.status(400).json({ message: (e as Error).message });
    }
  }
}
