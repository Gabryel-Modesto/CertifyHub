import express from "express";
import userRoutes from "./routes/user.routes.js";
const database = import ("./config/database.js");


const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/users", userRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
    
});

export default app;