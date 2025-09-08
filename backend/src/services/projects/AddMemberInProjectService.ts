import { Repository } from "typeorm";
import { Project } from "../../entities/Project";
import { ProjectMember } from "../../entities/ProjectMember";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";

export class AddMemberInProjectService {
  constructor(
    private projectsRepository: Repository<Project>,
    private projectMembersRepository: Repository<ProjectMember>,
    private usersRepository: Repository<User>
  ) {
    this.projectsRepository = projectsRepository;
    this.projectMembersRepository = projectMembersRepository;
    this.usersRepository = usersRepository;
  }

  async execute(input: { projectId: number; email: string }): Promise<any> {
    const { projectId, email } = input;

    if (!projectId) {
      throw new Error("ID do projeto é obrigatório");
    }

    if (!email) {
      throw new Error("Email do usuário é obrigatório");
    }

    const user = await this.usersRepository.findOne({
      where: { email: email },
      select: ["id", "name", "email"],
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
    if (project.ownerUser.id === user.id) {
      throw new Error("O dono do projeto já é membro do projeto");
    }
    const isAlreadyMember = project.members.some(
      (member: any) => member.userId === user.id
    );
    if (isAlreadyMember) {
      throw new Error("Usuário já é membro do projeto");
    }

    const memberProjectEntities = this.projectMembersRepository.create({
      project: { id: project.id },
      user: { id: user.id },
    });
    await this.projectMembersRepository.save(memberProjectEntities);

    return user;
  }
}
