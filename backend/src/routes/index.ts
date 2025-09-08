import { Router } from "express";
import TasksRoutes from "./TasksRoutes";
import ProjectRoutes from "./ProjectRoutes";
import ReportsRoutes from "./ReportsRoute";
import UsersRoutes from "./UsersRoutes";
import AuthRoutes from "./AuthRoutes";

const router = Router();
router.use("/tasks", TasksRoutes);
router.use("/projects", ProjectRoutes);
router.use("/reports", ReportsRoutes);
router.use("/users", UsersRoutes);
router.use("/auth", AuthRoutes);

export default router;
