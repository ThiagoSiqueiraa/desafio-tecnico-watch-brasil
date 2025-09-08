import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infra/swagger";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

console.log("Server running on http://localhost:3000");
app.listen(3000);
