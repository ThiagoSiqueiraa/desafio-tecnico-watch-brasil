import { Repository } from "typeorm";
import { Project } from "../../entities/Project";
import { ProjectMember } from "../../entities/ProjectMember";

export class GetProjectService {
  constructor(private projectsRepository: Repository<Project>) {
    this.projectsRepository = projectsRepository;
  }

  async execute(input: { id: number }): Promise<Project> {
    const { id } = input;
    const output = await this.projectsRepository.findOne({
      where: { id: Number(id) },
      select: ["id", "name"],
    });

    if (!output) {
      throw new Error("Projeto não encontrado");
    }

    return output;
  }
}
