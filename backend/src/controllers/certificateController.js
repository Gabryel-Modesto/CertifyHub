import {
  selectCertificatesByUser,
  selectCertificateByIdAndUser,
  insertCertificate,
  updateCertificateByUser,
  deleteCertificateByUser,
} from "../model/certificateModel.js";

// ==========================================
// Buscar certificados do usuário
// ==========================================

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

// ==========================================
// Buscar certificado por ID
// ==========================================

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

// ==========================================
// Cadastrar certificado
// ==========================================

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

// ==========================================
// Atualizar certificado
// ==========================================

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

// ==========================================
// Excluir certificado
// ==========================================

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

export {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateController,
  deleteCertificateController,
};
