import { Repository } from "typeorm";
import { Project } from "../../entities/Project";
import { User } from "../../entities/User";
import { ProjectMember } from "../../entities/ProjectMember";

export class ChangeActualProjectService {
  constructor(
    private projectsRepository: Repository<Project>,
    private usersRepository: Repository<User>,
    private projectMembersRepository: Repository<ProjectMember>
  ) {
    this.projectsRepository = projectsRepository;
    this.usersRepository = usersRepository;
  }

  async execute(input: { projectId: number; userId: number }): Promise<{
    id: number;
    name: string;
  }> {
    const { projectId, userId } = input;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["currentProject"],
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const project = await this.projectsRepository.findOne({
      where: { id: Number(projectId) },
    });

    if (!project) {
      throw new Error("Projeto não encontrado");
    }

    const isMember = await this.projectMembersRepository.findOne({
      where: { project: { id: project.id }, user: { id: user.id } },
    });

    if (!isMember) {
      throw new Error("Usuário não é membro do projeto");
    }

    user.currentProject = project;
    await this.usersRepository.save(user);

    const output = { id: project.id, name: project.name };
    return output;
  }
}
