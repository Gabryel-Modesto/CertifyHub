import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById)

export default router;