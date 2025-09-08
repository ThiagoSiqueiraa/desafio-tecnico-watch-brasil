import { Repository } from "typeorm";
import { Project } from "../../entities/Project";
import { ProjectMember } from "../../entities/ProjectMember";

export class CreateProjectService {
  constructor(
    private projectsRepository: Repository<Project>,
    private projectMembersRepository: Repository<ProjectMember>
  ) {
    this.projectsRepository = projectsRepository;
    this.projectMembersRepository = projectMembersRepository;
  }

  async execute(input: { name: string; userId: number }): Promise<any> {
    const { name, userId } = input;
    if (!name) {
      throw new Error("Nome do projeto é obrigatório");
    }
    const project = this.projectsRepository.create({
      name,
      ownerUser: { id: userId },
    });

    const output = await this.projectsRepository.save(project);

    const memberProjectEntities = this.projectMembersRepository.create({
      project: { id: project.id },
      user: { id: userId },
    });
    await this.projectMembersRepository.save(memberProjectEntities);

    return {
      id: output.id,
      name: output.name,
    };
  }
}
