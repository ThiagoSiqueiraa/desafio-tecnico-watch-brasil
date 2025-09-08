import { Router } from "express";
import { verifyToken } from "../middleware/checkAuth";
import { ProjectsController } from "../controllers/ProjectsController";
import { CreateProjectService } from "../services/projects/CreateProjectService";
import { AppDataSource } from "../data-source";

const router = Router();
const projectController = new ProjectsController(
  new CreateProjectService(
    AppDataSource.getRepository("Project"),
    AppDataSource.getRepository("ProjectMember")
  )
);
router.post("/", verifyToken, (req, res) => projectController.create(req, res));
router.get("/:id", verifyToken, (req, res) =>
  projectController.getById(req, res)
);
router.get("/", verifyToken, (req, res) => projectController.list(req, res));
router.delete("/:id", verifyToken, (req, res) =>
  projectController.delete(req, res)
);
router.post("/addMember/:projectId", verifyToken, (req, res) =>
  projectController.addMember(req, res)
);
router.get("/members/:projectId", verifyToken, (req, res) =>
  projectController.listMembers(req, res)
);
router.put("/changeActualProject/:projectId", verifyToken, (req, res) =>
  projectController.changeActualProject(req, res)
);
router.delete("/removeMember/:projectId", verifyToken, (req, res) =>
  projectController.removeMember(req, res)
);
export default router;
