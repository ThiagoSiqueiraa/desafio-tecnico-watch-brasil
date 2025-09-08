import { Router } from "express";
import { UsersController } from "../controllers/UsersController";
import { CreateUserService } from "../services/users/CreateUserService";
import { AppDataSource } from "../data-source";

const router = Router();
const usersController = new UsersController(
  new CreateUserService(AppDataSource.getRepository("User"))
);
router.post("/", (req, res) => usersController.create(req, res));

export default router;
