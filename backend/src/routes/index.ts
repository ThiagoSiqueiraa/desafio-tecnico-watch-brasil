import { Router } from "express";
import TasksRoutes from "./TasksRoutes";
import ProjectRoutes from "./ProjectRoutes";
import ReportsRoutes from "./ReportsRoute";
import UsersRoutes from "./UsersRoutes";

const router = Router();
router.use("/tasks", TasksRoutes);
router.use("/projects", ProjectRoutes);
router.use("/reports", ReportsRoutes);
router.use("/users", UsersRoutes);

export default router;
