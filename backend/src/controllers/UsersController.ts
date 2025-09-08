import { Request, Response } from "express";
import { hash } from "bcrypt";
import { AppDataSource } from "../data-source";

export class UsersController {

    constructor(){}

  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Nome  é obrigatório" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" });
      }

      if (!password) {
        return res.status(400).json({ message: "Senha é obrigatória" });
      }

      const passwordHash = await hash(password, 10);
      const user = await AppDataSource.getRepository("User").save({
        name,
        email,
        password: passwordHash,
      });

      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
