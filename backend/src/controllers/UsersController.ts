import { Request, Response } from "express";
import { CreateUserService } from "../services/users/CreateUserService";
import { GetProfileService } from "../services/users/GetProfileService";

export class UsersController {
  constructor(
    private createUserService: CreateUserService,
    private getProfileService: GetProfileService
  ) {
    this.createUserService = createUserService;
    this.getProfileService = getProfileService;
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

  async profile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const profile = await this.getProfileService.execute({ userId });
      res.json(profile);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
