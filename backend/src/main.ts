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

console.log("Server running on http://localhost:3000");
app.listen(3000);
