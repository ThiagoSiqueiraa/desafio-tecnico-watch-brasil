import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CreateProjectService } from "../services/projects/CreateProjectService";

export class ProjectsController {
  constructor(private createProjectService: CreateProjectService) {}

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
    const { id } = req.params;

    const projectRepository = await AppDataSource.getRepository("Project");
    const project = await projectRepository.findOne({
      where: { id: Number(id) },
      select: ["id", "name"],
    });

    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    res.json(project);
  }

  async list(req: Request, res: Response) {
    const { userId } = req.query;
    const projectMemberRepository = await AppDataSource.getRepository(
      "ProjectMember"
    );

    const memberProjectsRelations = await projectMemberRepository.find({
      where: { user: { id: Number(userId) } },
      relations: ["project"],
    });

    const projects = memberProjectsRelations.map(
      (relation) => relation.project
    );

    res.json(projects);
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
    const { projectId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório" });
    }

    const userRepository = await AppDataSource.getRepository("User");
    const user = await userRepository.findOne({
      where: { email: email },
      select: ["id", "name", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const projectRepository = await AppDataSource.getRepository("Project");
    const project = await projectRepository.findOne({
      where: { id: Number(projectId) },
      relations: ["members", "ownerUser", "members.user"],
    });

    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    if (project.ownerUser.id === user.id) {
      return res.status(400).json({ message: "O dono do projeto já é membro" });
    }
    console;
    const isAlreadyMember = project.members.some(
      (member: any) => member.userId === user.id
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "Usuário já é membro do projeto" });
    }

    const projectMemberRepository = await AppDataSource.getRepository(
      "ProjectMember"
    );
    const memberProjectEntities = projectMemberRepository.create({
      project: { id: project.id },
      user: { id: user.id },
    });
    await projectMemberRepository.save(memberProjectEntities);

    res.json({ message: "Membro adicionado com sucesso", member: user });
  }

  async listMembers(req: Request, res: Response) {
    const { projectId } = req.params;

    const projectRepository = await AppDataSource.getRepository("Project");
    const project = await projectRepository.findOne({
      where: { id: Number(projectId) },
      relations: ["members", "members.user"],
    });

    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    const members = project.members.map((member: any) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
    }));

    res.json(members);
  }

  async changeActualProject(req: Request, res: Response) {
    try {
      const { projectId } = req.params;

      const userId = (req as any).user.id;

      const userRepository = await AppDataSource.getRepository("User");
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["currentProject"],
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const projectRepository = await AppDataSource.getRepository("Project");
      const project = await projectRepository.findOne({
        where: { id: Number(projectId) },
      });

      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }

      const projectMemberRepository = await AppDataSource.getRepository(
        "ProjectMember"
      );
      const isMember = await projectMemberRepository.findOne({
        where: { project: { id: project.id }, user: { id: user.id } },
      });

      if (!isMember) {
        return res
          .status(403)
          .json({ message: "Usuário não é membro do projeto" });
      }

      user.currentProject = project;
      await userRepository.save(user);

      res.json({
        message: "Projeto atual alterado com sucesso",
        currentProject: { id: project.id, name: project.name },
      });
    } catch (e: any) {
      return res
        .status(500)
        .json({ message: e.message || "Erro interno do servidor" });
    }
  }

  async removeMember(req: Request, res: Response) {
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "ID do usuário é obrigatório" });
    }
    const userRepository = await AppDataSource.getRepository("User");
    const user = await userRepository.findOne({
      where: { id: Number(userId) },
      select: ["id", "name", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const projectRepository = await AppDataSource.getRepository("Project");
    const project = await projectRepository.findOne({
      where: { id: Number(projectId) },
      relations: ["members", "ownerUser", "members.user"],
    });

    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    const requestingUserId = (req as any).user.id;
    if (project.ownerUser.id !== requestingUserId) {
      return res
        .status(403)
        .json({ message: "Apenas o dono do projeto pode remover membros" });
    }

    if (Number(project.ownerUser.id) === Number(user.id)) {
      return res
        .status(400)
        .json({ message: "O dono do projeto não pode ser removido" });
    }

    //verifica se o usuário é o dono do projeto

    const projectMemberRepository = await AppDataSource.getRepository(
      "ProjectMember"
    );
    const membership = await projectMemberRepository.findOne({
      where: { project: { id: project.id }, user: { id: user.id } },
    });

    if (!membership) {
      return res
        .status(400)
        .json({ message: "Usuário não é membro do projeto" });
    }

    await projectMemberRepository.remove(membership);

    res.json({ message: "Membro removido com sucesso", member: user });
  }
}
