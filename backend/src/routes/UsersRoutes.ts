import { Router } from "express";
import { UsersController } from "../controllers/UsersController";
import { CreateUserService } from "../services/users/CreateUserService";
import { AppDataSource } from "../data-source";
import { GetProfileService } from "../services/users/GetProfileService";

const router = Router();
const usersController = new UsersController(
  new CreateUserService(AppDataSource.getRepository("User")),
  new GetProfileService(AppDataSource.getRepository("User"))
);
router.post("/", (req, res) => usersController.create(req, res));
router.get("/profile", (req, res) => usersController.profile(req, res));

export default router;
