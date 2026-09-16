import express from "express";

import auth from "../middlewares/auth.js";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Listar categorias
router.get("/", auth, getCategories);

// Buscar categoria por ID
router.get("/:id", auth, getCategoryById);

// Cadastrar categoria
router.post("/", auth, createCategory);

// Atualizar categoria
router.put("/:id", auth, updateCategory);

// Excluir categoria
router.delete("/:id", auth, deleteCategory);

export default router;
