import { Repository } from "typeorm";
import { hash } from "bcrypt";
import { User } from "../../entities/User";

export class GetProfileService {
  constructor(private usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(input: { userId: number }): Promise<any> {
    const { userId } = input;
    if (!userId) {
      throw new Error("ID do usuário é obrigatório");
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["currentProject"],
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }
}
