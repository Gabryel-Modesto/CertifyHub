import express from "express";
import cors from 'cors';
import userRoutes from "./routes/user.routes.js";
import certificatesRoutes from './routes/certificate.routes.js'
import dotenv from "dotenv"
dotenv.config({path: "./backend/.env",});

const app = express();
const port = 3000;
app.use(cors());

app.use(express.json());


app.use("/uploads",express.static("uploads"));
app.use("/users", userRoutes);
app.use("/certificates", certificatesRoutes)

app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
    
});

export default app;