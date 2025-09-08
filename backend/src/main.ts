import express, { Request, Response } from "express";
import pgPromise from "pg-promise";
import cors from "cors";
import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import routes from "./routes";
import { verifyToken } from "./middleware/checkAuth";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);

const connection = pgPromise()("postgres://postgres:123456@db:5432/app");

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

console.log("Server running on http://localhost:3000");
app.listen(3000);
