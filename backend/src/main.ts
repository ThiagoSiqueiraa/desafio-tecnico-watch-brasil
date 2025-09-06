import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
const app = express();
app.use(express.json());

const connection = pgPromise()("postgres://postgres:123456@db:5432/app");

interface CreateProjectBody {
  name: string;
}
app.post(
  "/projects",
  async (req: Request<{}, {}, CreateProjectBody>, res: Response) => {
    const { name } = req.body;
    const id = await connection.query(
      "INSERT INTO app.projects (name, owner_user_id) VALUES ($1, $2) RETURNING id",
      [name, 1]
    );

    res.json({ id: id[0].id, name });
  }
);

app.get("/project/:id", async (req: Request, res: Response) => {
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

console.log("Server running on http://localhost:3000");
app.listen(3000);
