import express from "express";

import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateController,
  deleteCertificateController,
  downloadCertificate,
  previewCertificate
} from "../controllers/certificateController.js";

import upload from "../middlewares/upload.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getCertificates);

router.get("/:id", auth, getCertificateById);

router.get("/:id/download", auth, downloadCertificate);

router.post("/", auth, upload.single("file"), createCertificate);

router.put("/:id", auth, upload.single("file"), updateCertificateController);

router.delete("/:id", auth, deleteCertificateController);

router.get( "/:id/preview", auth,previewCertificate);

export default router;
