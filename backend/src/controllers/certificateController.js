import {
  selectCertificatesByUser,
  selectCertificateByIdAndUser,
  insertCertificate,
  updateCertificateByUser,
  deleteCertificateByUser,
} from "../model/certificateModel.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certificatesUploadPath = path.resolve(
  __dirname,
  "../../uploads/certificates",
);

async function getCertificates(req, res) {
  try {
    const id_user = req.user.id;

    const certificates = await selectCertificatesByUser(id_user);

    res.status(200).json(certificates);
  } catch (error) {
    console.error("Erro ao buscar certificados:", error);

    res.status(500).json({
      message: "Erro ao buscar certificados.",
    });
  }
}

async function getCertificateById(req, res) {
  try {
    const { id } = req.params;

    const id_user = req.user.id;

    const certificate = await selectCertificateByIdAndUser(id, id_user);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    res.status(200).json(certificate);
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);

    res.status(500).json({
      message: "Erro ao buscar certificado.",
    });
  }
}

async function createCertificate(req, res) {
  try {
    const id_user = req.user.id;

    const certificateData = {
      ...req.body,

      // O usuário vem do JWT
      id_user,

      file_path: req.file ? `/uploads/certificates/${req.file.filename}` : null,
    };

    const certificate = await insertCertificate(certificateData);

    return res.status(201).json({
      message: "Certificado cadastrado com sucesso.",
      certificate,
    });
  } catch (error) {
    console.error("Erro ao cadastrar certificado:", error);

    return res.status(500).json({
      message: "Erro ao cadastrar certificado.",
    });
  }
}

async function updateCertificateController(req, res) {
  try {
    const { id } = req.params;

    const id_user = req.user.id;

    const certificateData = {
      ...req.body,

      file_path: req.file
        ? `/uploads/certificates/${req.file.filename}`
        : req.body.file_path || null,
    };

    const certificate = await updateCertificateByUser(
      id,
      id_user,
      certificateData,
    );

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    res.status(200).json({
      message: "Certificado atualizado com sucesso.",
      certificate,
    });
  } catch (error) {
    console.error("Erro ao atualizar certificado:", error);

    res.status(500).json({
      message: "Erro ao atualizar certificado.",
    });
  }
}

async function deleteCertificateController(req, res) {
  try {
    const { id } = req.params;

    const id_user = req.user.id;

    const certificate = await deleteCertificateByUser(id, id_user);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    res.status(200).json({
      message: "Certificado excluído com sucesso.",
      certificate,
    });
  } catch (error) {
    console.error("Erro ao excluir certificado:", error);

    res.status(500).json({
      message: "Erro ao excluir certificado.",
    });
  }
}

async function downloadCertificate(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;
    const certificate = await selectCertificateByIdAndUser(id, id_user);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    if (!certificate.file_path) {
      return res.status(404).json({
        message: "Este certificado não possui um arquivo.",
      });
    }

    const fileName = path.basename(certificate.file_path);

    const filePath = path.join(certificatesUploadPath, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Arquivo não encontrado.",
      });
    }

    return res.download(
      filePath,
      `${certificate.name_certificate}${path.extname(filePath)}`,
      (error) => {
        if (error) {
          console.error("Erro ao enviar arquivo:", error);
        }
      },
    );
  } catch (error) {
    console.error("Erro ao baixar certificado:", error);

    return res.status(500).json({
      message: "Erro ao baixar certificado.",
    });
  }
}

async function previewCertificate(req, res) {
  try {
    const { id } = req.params;

    const id_user = req.user.id;

    const certificate = await selectCertificateByIdAndUser(id, id_user);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    if (!certificate.file_path) {
      return res.status(404).json({
        message: "Este certificado não possui um arquivo.",
      });
    }

    const fileName = path.basename(certificate.file_path);

    const filePath = path.join(certificatesUploadPath, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Arquivo não encontrado.",
      });
    }

    return res.sendFile(filePath);
  } catch (error) {
    console.error("Erro ao visualizar certificado:", error);

    return res.status(500).json({
      message: "Erro ao visualizar certificado.",
    });
  }
}

export {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateController,
  deleteCertificateController,
  downloadCertificate,
  previewCertificate,
};
