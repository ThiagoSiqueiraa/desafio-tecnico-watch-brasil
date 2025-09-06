import express, { Request, Response } from "express";
const app = express();
app.use(express.json());


app.post("/projects", async (req: Request, res: Response) => {
   
    res.json({
        'Hello': 'Worlds',
    });
});


console.log("Server running on http://localhost:3000");
app.listen(3000);