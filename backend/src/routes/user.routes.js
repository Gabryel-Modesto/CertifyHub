import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/:id", userController.updateUserController);
router.put("/:id/password", userController.changePasswordController);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

export default router;
