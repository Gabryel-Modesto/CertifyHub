import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import categoryRoutes from "./routes/category.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/certificates", certificateRoutes);
app.use("/categories", categoryRoutes);

app.use((error, req, res, next) => {
  console.error("Erro:", error);

  // Erros do Multer
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "O arquivo deve possuir no máximo 5 MB.",
    });
  }

  if (
    error.message ===
    "Tipo de arquivo inválido. Apenas PDF, PNG e JPG/JPEG são permitidos."
  ) {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
