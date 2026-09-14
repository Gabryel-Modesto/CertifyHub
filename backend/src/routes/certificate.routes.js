import express from "express";

import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateController,
  deleteCertificateController
} from "../controllers/certificateController.js";

const router = express.Router();


router.get("/", getCertificates);

router.get("/:id", getCertificateById);

router.post("/", createCertificate);

router.put("/:id", updateCertificateController);

router.delete("/:id", deleteCertificateController);


export default router;