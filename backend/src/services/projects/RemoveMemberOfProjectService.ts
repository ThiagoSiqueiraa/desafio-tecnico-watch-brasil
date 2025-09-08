import { Repository } from "typeorm";
import { Project } from "../../entities/Project";
import { ProjectMember } from "../../entities/ProjectMember";
import { User } from "../../entities/User";

export class RemoveMemberOfProjectService {
  constructor(
    private projectsRepository: Repository<Project>,
    private usersRepository: Repository<ProjectMember>,
    private projectMembersRepository: Repository<ProjectMember>
  ) {
    this.projectsRepository = projectsRepository;
    this.usersRepository = usersRepository;
    this.projectMembersRepository = projectMembersRepository;
  }

  async execute(input: {
    userIdToRemove: number;
    projectId: number;
    requestingUserId: number;
  }): Promise<void> {
    const { userIdToRemove, projectId, requestingUserId } = input;

    if (!userIdToRemove) {
      throw new Error("ID do usuário é obrigatório");
    }
    const user = await this.usersRepository.findOne({
      where: { id: Number(userIdToRemove) },
      select: ["id"],
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const project = await this.projectsRepository.findOne({
      where: { id: Number(projectId) },
      relations: ["members", "ownerUser", "members.user"],
    });

    if (!project) {
      throw new Error("Projeto não encontrado");
    }
    if (project.ownerUser.id !== requestingUserId) {
      throw new Error("Apenas o dono do projeto pode remover membros");
    }

    if (Number(project.ownerUser.id) === Number(user.id)) {
      throw new Error("O dono do projeto não pode ser removido");
    }

    //verifica se o usuário é o dono do projeto

    const membership = await this.projectMembersRepository.findOne({
      where: { project: { id: project.id }, user: { id: user.id } },
    });

    if (!membership) {
      throw new Error("Usuário não é membro do projeto");
    }

    await this.projectMembersRepository.remove(membership);

    return;
  }
}
