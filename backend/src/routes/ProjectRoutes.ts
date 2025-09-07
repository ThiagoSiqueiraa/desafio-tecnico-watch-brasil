import { Router } from "express";
import { verifyToken } from "../middleware/checkAuth";
import { ProjectsController } from "../controllers/ProjectsController";

const router = Router();
const projectController = new ProjectsController();
router.post("/", verifyToken, projectController.create);
router.get("/:id", verifyToken, projectController.getById);
router.get("/", verifyToken, projectController.list);
router.delete("/:id", verifyToken, projectController.delete);
router.post("/addMember/:projectId", verifyToken, projectController.addMember);
router.get("/members/:projectId", verifyToken, projectController.listMembers);
router.put("/changeActualProject/:projectId", verifyToken, projectController.changeActualProject);
router.delete("/removeMember/:projectId", verifyToken, projectController.removeMember);
export default router;

