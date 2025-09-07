import { Router } from "express";
import TasksRoutes from "./TasksRoutes";

const router = Router();
router.use("/tasks", TasksRoutes)

export default router;