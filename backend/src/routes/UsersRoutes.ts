import { Router } from "express";
import { UsersController } from "../controllers/UsersController";

const router = Router();
const usersController = new UsersController();
router.post("/", (req, res) => usersController.create(req, res));

export default router;
