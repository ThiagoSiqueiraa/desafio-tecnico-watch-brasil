import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export class LoginService {
  constructor(private usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(input: { email: string; password: string }): Promise<any> {
    const { email, password } = input;
    if (!email) {
      throw new Error("Email é obrigatório");
    }

    if (!password) {
      throw new Error("Senha é obrigatória");
    }

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ["id", "name", "email", "password"],
    });
    if (!user) {
      throw new Error("E-mail ou senha inválido");
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("E-mail ou senha inválido");
    }
    const acessToken = await sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string || "default_secret"
    );
    const output = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: acessToken,
    };
    return output;
  }
}
