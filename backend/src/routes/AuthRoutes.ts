import { Router } from "express";
import { AppDataSource } from "../data-source";
import { LoginController } from "../controllers/AuthController";
import { LoginService } from "../services/auth/LoginService";

const router = Router();
const loginController = new LoginController(
  new LoginService(AppDataSource.getRepository("User"))
);
router.post("/", (req, res) => loginController.login(req, res));

export default router;
