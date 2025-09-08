import { Repository } from "typeorm";
import { hash } from "bcrypt";
import { User } from "../../entities/User";

export class CreateUserService {
  constructor(private usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<any> {
    const { name, email, password } = input;
    if (!name) {
      throw new Error("Nome  é obrigatório");
    }

    if (!email) {
      throw new Error("Email é obrigatório");
    }

    if (!password) {
      throw new Error("Senha é obrigatória");
    }

    const passwordHash = await hash(password, 10);
    const user = this.usersRepository.save({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}
