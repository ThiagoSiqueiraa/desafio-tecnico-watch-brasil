import { Repository } from "typeorm";
import { Project } from "../../entities/Project";
import { ProjectMember } from "../../entities/ProjectMember";

export class ListProjectsService {
  constructor(private projectMembersRepository: Repository<ProjectMember>) {
    this.projectMembersRepository = projectMembersRepository;
  }

  async execute(input: { userId: number }): Promise<Project[]> {
    const { userId } = input;
    const memberProjectsRelations = await this.projectMembersRepository.find({
      where: { user: { id: Number(userId) } },
      relations: ["project"],
    });
    const output = memberProjectsRelations.map((relation) => relation.project);
    return output;
  }
}
