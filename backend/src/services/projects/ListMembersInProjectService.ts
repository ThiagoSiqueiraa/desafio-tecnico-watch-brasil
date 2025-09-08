import { Repository } from "typeorm";
import { Project } from "../../entities/Project";

export class ListMembersInProjectService {
  constructor(private projectsRepository: Repository<Project>) {
    this.projectsRepository = projectsRepository;
  }

  async execute(input: { projectId: number }): Promise<any> {
    const { projectId } = input;

    const project = await this.projectsRepository.findOne({
      where: { id: Number(projectId) },
      relations: ["members", "members.user"],
    });

    if (!project) {
      throw new Error("Projeto não encontrado");
    }

    const output = project.members.map((member: any) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
    }));

    return output;
  }
}
