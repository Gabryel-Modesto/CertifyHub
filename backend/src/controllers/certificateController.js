import {
  selectCertificates,
  selectCertificateById,
  insertCertificate,
  updateCertificate,
  deleteCertificate,
} from "../model/certificateModel.js";

async function getCertificates(req, res) {
  try {
    const certificates = await selectCertificates();

    res.status(200).json(certificates);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar certificados.",
    });
  }
}

async function getCertificateById(req, res) {
  try {
    const { id } = req.params;

    const certificate = await selectCertificateById(id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    res.status(200).json(certificate);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar certificado.",
    });
  }
}

async function createCertificate(req, res) {
  try {
    const certificate = await insertCertificate(req.body);

    res.status(201).json({
      message: "Certificado cadastrado com sucesso.",
      certificate,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao cadastrar certificado.",
    });
  }
}

async function updateCertificateController(req, res) {
  try {
    const { id } = req.params;

    const certificate = await updateCertificate(id, req.body);

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
    console.error(error);

    res.status(500).json({
      message: "Erro ao atualizar certificado.",
    });
  }
}

async function deleteCertificateController(req, res) {
  try {
    const { id } = req.params;

    const certificate = await deleteCertificate(id);

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
    console.error(error);

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
