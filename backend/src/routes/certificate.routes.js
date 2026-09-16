import express from "express";

import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateController,
  deleteCertificateController,
} from "../controllers/certificateController.js";

import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getCertificates);

router.get("/:id", auth, getCertificateById);

router.post("/", auth, upload.single("file"), createCertificate);

router.put("/:id", auth, upload.single("file"), updateCertificateController);

router.delete("/:id", auth, deleteCertificateController);

export default router;
