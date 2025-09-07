import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
import cors from "cors";
import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const connection = pgPromise()("postgres://postgres:123456@db:5432/app");

interface CreateProjectBody {
  name: string;
}

function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
}

app.post(
  "/projects",
  authenticateToken,
  async (req: Request<{}, {}, CreateProjectBody>, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Nome do projeto é obrigatório" });
    }

    // Pega o id do usuário autenticado do token
    const userId = (req as any).user.id;

    const id = await connection.query(
      "INSERT INTO app.projects (name, owner_user_id) VALUES ($1, $2) RETURNING id",
      [name, userId]
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

app.post("/tasks", authenticateToken, async (req: Request, res: Response) => {
  const { title, status, priority, dueDate, description, checklist } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Título é obrigatório" });
  }

  if (!status) {
    return res.status(400).json({ message: "Status é obrigatório" });
  }

  if (!["pending", "in_progress", "completed"].includes(status)) {
    return res.status(400).json({
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

  //checa o formato da data
  if (isNaN(Date.parse(dueDate))) {
    return res
      .status(400)
      .json({ message: "Data de vencimento em formato inválido" });
  }

  if (!checklist || checklist.length === 0) {
    return res
      .status(400)
      .json({ message: "Checklist é obrigatória e deve ter ao menos um item" });
  }

  const actualProjectUser = await AppDataSource.getRepository("User").find({
    where: { id: (req as any).user.id },
    relations: ["currentProject"],
  });

  if (actualProjectUser.length === 0) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  if (!actualProjectUser[0].currentProject) {
    return res.status(400).json({ message: "Usuário não está em um projeto" });
  }

  const projectId = actualProjectUser[0].currentProject.id;

  const tasksRepository = AppDataSource.getRepository("Task");
  // Cria as entidades de checklist associadas à tarefa

  const newTask = await tasksRepository.create({
    title,
    status,
    priority: priorityDictonary[priority],
    dueDate: dueDate,
    project: { id: projectId },
    description,
  });

  const savedTask = await tasksRepository.save(newTask);

  const checklistEntities = checklist.map((it: any, idx: number) =>
    AppDataSource.getRepository("TaskChecklist").create({
      title: it.title,
      done: !!it.done,
      order: it.order ?? idx,
      task: { id: savedTask.id }, // associa por FK
    })
  );

  await AppDataSource.getRepository("TaskChecklist").save(checklistEntities);

  res.json({
    ...newTask,
    completedSubtasks: 0,
    totalSubtasks: checklist.length,
  });
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Nome  é obrigatório" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório" });
  }

  if (!password) {
    return res.status(400).json({ message: "Senha é obrigatória" });
  }

  const passwordHash = await hash(password, 10);
  const id = await connection.query(
    "INSERT INTO app.users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
    [name, email, passwordHash]
  );

  res.json({ id: id[0].id, name, email });
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório" });
  }

  if (!password) {
    return res.status(400).json({ message: "Senha é obrigatória" });
  }

  const user = await connection.query(
    "SELECT id, name, email, password FROM app.users WHERE email = $1",
    [email]
  );
  if (user.length === 0) {
    return res.status(404).json({ message: "E-mail ou senha inválido" });
  }

  const userData = user[0];
  const isPasswordValid = await compare(password, userData.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "E-mail ou senha inválido" });
    //Retorna essa mensagem para não deixar claro se o e-mail ou a senha estão incorretos
  }

  //jwt

  const acessToken = await sign(userData, process.env.JWT_SECRET as string);
  return res.json({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    token: acessToken,
  });
});

app.get("/me", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["currentProject"],
  });
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  res.json(user);
});

app.get("/tasks/:projectId", async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({ message: "ID do projeto é obrigatório" });
  }

  const tasksRepository = AppDataSource.getRepository("Task");
  const tasks = await tasksRepository.find({
    where: { project: { id: Number(projectId) } },
    relations: ["checklist"],
    order: { updatedAt: "ASC" },
  });

  res.json(tasks);
});

console.log("Server running on http://localhost:3000");
app.listen(3000);
