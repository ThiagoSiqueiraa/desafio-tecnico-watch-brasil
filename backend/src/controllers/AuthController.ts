import { Request, Response } from "express";
import { LoginService } from "../services/auth/LoginService";

export class LoginController {
  constructor(private loginService: LoginService) {
    this.loginService = loginService;
  }

  async login(req: Request, res: Response) {
    try {
        console.log(req.body)
      const { email, password } = req.body;
      const user = await this.loginService.execute({
        email,
        password,
      });

      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }


}
