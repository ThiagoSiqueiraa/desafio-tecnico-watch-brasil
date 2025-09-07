import { Router } from "express";
import TasksRoutes from "./TasksRoutes";
import ProjectRoutes from "./ProjectRoutes";

const router = Router();
router.use("/tasks", TasksRoutes)
router.use("/projects", ProjectRoutes)

export default router;