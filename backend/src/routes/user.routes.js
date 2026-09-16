import express from "express";

import userController from "../controllers/userController.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

// Rotas públicas
router.post("/", userController.createUser);

router.post("/login", userController.loginUser);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);

// Rotas protegidas
router.get("/", auth, userController.getUsers);

router.get("/:id", auth, userController.getUserById);

router.put("/:id", auth, userController.updateUserController);

router.put("/:id/password", auth, userController.changePasswordController);

export default router;
