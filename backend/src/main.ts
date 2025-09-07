import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

const connection = pgPromise()("postgres://postgres:123456@db:5432/app");

interface CreateProjectBody {
  name: string;
}
app.post(
  "/projects",
  async (req: Request<{}, {}, CreateProjectBody>, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Nome do projeto é obrigatório" });
    }

    const id = await connection.query(
      "INSERT INTO app.projects (name, owner_user_id) VALUES ($1, $2) RETURNING id",
      [name, 1]
    );

    res.json({ id: id[0].id, name });
  }
);

app.get("/projects/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await connection.query(
    "SELECT id, name FROM app.projects WHERE id = $1",
    [id]
  );

  if (project.length === 0) {
    return res.status(404).json({ message: "Projeto não encontrado" });
  }

  res.json(project[0]);
});

app.get("/projects", async (req: Request, res: Response) => {
  const { userId } = req.query;
  const projects = await connection.query(
    "SELECT id, name FROM app.projects WHERE owner_user_id = $1",
    [userId]
  );
  res.json(projects);
});

app.delete("/projects/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await connection.query("DELETE FROM app.projects WHERE id = $1", [id]);
  res.status(204).send();
});

app.post("/tasks", async (req: Request, res: Response) => {
  const { title, projectId, status, priority, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Título é obri" });
  }

  if (!projectId) {
    return res.status(400).json({ message: "ID do projeto é obrigatório" });
  }

  if (!status) {
    return res.status(400).json({ message: "Status é obrigatório" });
  }

  if (!["pending", "in_progress", "completed"].includes(status)) {
    return res
      .status(400)
      .json({
        message:
          "Status inválido, informe os status possíveis: 'pending', 'in_progress', 'completed'",
      });
  }

  if (!priority) {
    return res.status(400).json({ message: "Prioridade é obrigatória" });
  }

  const priorityDictonary: {
    [key: string]: number;
  } = { low: 1, medium: 2, high: 3 };

  if (!dueDate) {
    return res
      .status(400)
      .json({ message: "Data de vencimento é obrigatória" });
  }

  const project = await connection.query(
    "SELECT id FROM app.projects WHERE id = $1",
    [projectId]
  );

  if (project.length === 0) {
    return res.status(404).json({ message: "Projeto não encontrado" });
  }

  const id = await connection.query(
    "INSERT INTO app.tasks (title, project_id, status, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [title, projectId, status, priorityDictonary[priority], dueDate]
  );

  res.json({
    id: id[0].id,
    title,
    projectId,
    status,
    priority: priority,
    dueDate,
  });
});

console.log("Server running on http://localhost:3000");
app.listen(3000);
