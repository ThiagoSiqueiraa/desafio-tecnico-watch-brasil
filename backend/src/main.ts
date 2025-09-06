import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

interface CreateProjectBody {
  name: string;
}
app.post(
  "/projects",
  async (req: Request<{}, {}, CreateProjectBody>, res: Response) => {
    const { name } = req.body;

    res.json({ id: Math.floor(Math.random() * 1000), name });
  }
);

console.log("Server running on http://localhost:3000");
app.listen(3000);
