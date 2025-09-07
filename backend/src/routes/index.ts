import { Router } from "express";
import TasksRoutes from "./TasksRoutes";
import ProjectRoutes from "./ProjectRoutes";
import ReportsRoutes from "./ReportsRoute";

const router = Router();
router.use("/tasks", TasksRoutes);
router.use("/projects", ProjectRoutes);
router.use("/reports", ReportsRoutes);

export default router;
