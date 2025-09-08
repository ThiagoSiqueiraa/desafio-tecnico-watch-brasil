import { Request, Response } from "express";
import { hash } from "bcrypt";
import { AppDataSource } from "../data-source";
import { CreateUserService } from "../services/users/CreateUserService";

export class UsersController {
  constructor(private createUserService: CreateUserService) {
    this.createUserService = createUserService;
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await this.createUserService.execute({
        name,
        email,
        password,
      });

      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
