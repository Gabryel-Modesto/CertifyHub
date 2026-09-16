import {
  selectCertificatesByUser,
  selectCertificateByIdAndUser,
  insertCertificate,
  updateCertificateByUser,
  deleteCertificateByUser,
} from "../model/certificateModel.js";

import { selectCategoryByIdAndUser } from "../model/categoryModel.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certificatesUploadPath = path.resolve(
  __dirname,
  "../../uploads/certificates",
);

// ==========================================
// VALIDAR URL
// ==========================================

const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// ==========================================
// VALIDAR DATA
// ==========================================

const isValidDate = (value) => {
  if (!value) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime());
};

// ==========================================
// VALIDAR ID
// ==========================================

const isValidId = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};

// ==========================================
// REMOVER ARQUIVO UPLOADADO
// ==========================================

const removeUploadedFile = (file) => {
  if (!file) {
    return;
  }

  const uploadedFilePath = path.join(certificatesUploadPath, file.filename);

  if (fs.existsSync(uploadedFilePath)) {
    fs.unlinkSync(uploadedFilePath);
  }
};

// ==========================================
// BUSCAR CERTIFICADOS
// ==========================================

async function getCertificates(req, res) {
  try {
    const id_user = req.user.id;

    const certificates = await selectCertificatesByUser(id_user);

    return res.status(200).json(certificates);
  } catch (error) {
    console.error("Erro ao buscar certificados:", error);

    return res.status(500).json({
      message: "Erro ao buscar certificados.",
    });
  }
}

// ==========================================
// BUSCAR CERTIFICADO POR ID
// ==========================================

async function getCertificateById(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID do certificado inválido.",
      });
    }

    const certificate = await selectCertificateByIdAndUser(Number(id), id_user);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    return res.status(200).json(certificate);
  } catch (error) {
    console.error("Erro ao buscar certificado:", error);

    return res.status(500).json({
      message: "Erro ao buscar certificado.",
    });
  }
}

// ==========================================
// VALIDAR DADOS DO CERTIFICADO
// ==========================================

const validateCertificateData = ({
  name_certificate,
  institution_certificate,
  id_category,
  date_conclusion,
  date_validity,
  hours_certificate,
  certification_code,
  validation_link,
}) => {
  // Nome
  if (!name_certificate?.trim()) {
    return "Informe o nome do certificado.";
  }

  if (name_certificate.trim().length > 250) {
    return "O nome do certificado deve possuir no máximo 250 caracteres.";
  }

  // Instituição
  if (!institution_certificate?.trim()) {
    return "Informe a instituição.";
  }

  if (institution_certificate.trim().length > 250) {
    return "A instituição deve possuir no máximo 250 caracteres.";
  }

  // Categoria
  if (id_category === undefined || id_category === null || id_category === "") {
    return "Selecione uma categoria.";
  }

  if (!Number.isInteger(Number(id_category)) || Number(id_category) <= 0) {
    return "A categoria selecionada é inválida.";
  }

  // Data de emissão
  if (!date_conclusion) {
    return "Informe a data de emissão.";
  }

  if (!isValidDate(date_conclusion)) {
    return "A data de emissão é inválida.";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const conclusionDate = new Date(`${date_conclusion}T00:00:00`);

  if (conclusionDate > today) {
    return "A data de emissão não pode ser futura.";
  }

  // Data de validade
  if (date_validity) {
    if (!isValidDate(date_validity)) {
      return "A data de validade é inválida.";
    }

    const validityDate = new Date(`${date_validity}T00:00:00`);

    if (validityDate < conclusionDate) {
      return "A data de validade não pode ser anterior à data de emissão.";
    }
  }

  // Carga horária
  if (
    hours_certificate === undefined ||
    hours_certificate === null ||
    hours_certificate === ""
  ) {
    return "Informe a carga horária.";
  }

  const hours = Number(hours_certificate);

  if (!Number.isInteger(hours) || hours <= 0) {
    return "A carga horária deve ser um número inteiro maior que zero.";
  }

  // Código de certificação
  if (certification_code && certification_code.trim().length > 250) {
    return "O código de certificação deve possuir no máximo 250 caracteres.";
  }

  // Link de validação
  if (validation_link) {
    if (!isValidUrl(validation_link.trim())) {
      return "Informe um link de validação válido.";
    }

    if (validation_link.trim().length > 500) {
      return "O link de validação deve possuir no máximo 500 caracteres.";
    }
  }

  return null;
};

// ==========================================
// VALIDAR CATEGORIA DO USUÁRIO
// ==========================================

async function validateUserCategory(id_category, id_user) {
  if (!isValidId(id_category)) {
    return false;
  }

  const category = await selectCategoryByIdAndUser(
    Number(id_category),
    id_user,
  );

  return Boolean(category);
}

// ==========================================
// INSERIR CERTIFICADO
// ==========================================

async function createCertificate(req, res) {
  try {
    const id_user = req.user.id;

    const validationError = validateCertificateData(req.body);

    if (validationError) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message: validationError,
      });
    }

    const {
      name_certificate,
      institution_certificate,
      id_category,
      date_conclusion,
      date_validity,
      hours_certificate,
      certification_code,
      validation_link,
      description,
    } = req.body;

    const categoryIsValid = await validateUserCategory(id_category, id_user);

    if (!categoryIsValid) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message: "A categoria selecionada é inválida.",
      });
    }

    const certificateData = {
      id_user,

      name_certificate: name_certificate.trim(),

      institution_certificate: institution_certificate.trim(),

      id_category: Number(id_category),

      date_conclusion,

      date_validity: date_validity || null,

      hours_certificate: Number(hours_certificate),

      certification_code: certification_code?.trim() || null,

      validation_link: validation_link?.trim() || null,

      description: description?.trim() || null,

      file_path: req.file ? `/uploads/certificates/${req.file.filename}` : null,
    };

    const certificate = await insertCertificate(certificateData);

    return res.status(201).json({
      message: "Certificado cadastrado com sucesso.",
      certificate,
    });
  } catch (error) {
    console.error("Erro ao cadastrar certificado:", error);

    removeUploadedFile(req.file);

    // Categoria inexistente
    if (error.code === "23503") {
      return res.status(400).json({
        message: "A categoria selecionada é inválida.",
      });
    }

    return res.status(500).json({
      message: "Erro ao cadastrar certificado.",
    });
  }
}

// ==========================================
// ATUALIZAR CERTIFICADO
// ==========================================

async function updateCertificateController(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message: "ID do certificado inválido.",
      });
    }

    const validationError = validateCertificateData(req.body);

    if (validationError) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message: validationError,
      });
    }

    // Buscar certificado atual
    const currentCertificate = await selectCertificateByIdAndUser(
      Number(id),
      id_user,
    );

    if (!currentCertificate) {
      removeUploadedFile(req.file);

      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    const {
      name_certificate,
      institution_certificate,
      id_category,
      date_conclusion,
      date_validity,
      hours_certificate,
      certification_code,
      validation_link,
      description,
    } = req.body;

    const categoryIsValid = await validateUserCategory(id_category, id_user);

    if (!categoryIsValid) {
      removeUploadedFile(req.file);

      return res.status(400).json({
        message: "A categoria selecionada é inválida.",
      });
    }

    const newFilePath = req.file
      ? `/uploads/certificates/${req.file.filename}`
      : currentCertificate.file_path;

    const certificateData = {
      name_certificate: name_certificate.trim(),

      institution_certificate: institution_certificate.trim(),

      id_category: Number(id_category),

      date_conclusion,

      date_validity: date_validity || null,

      hours_certificate: Number(hours_certificate),

      certification_code: certification_code?.trim() || null,

      validation_link: validation_link?.trim() || null,

      description: description?.trim() || null,

      file_path: newFilePath,
    };

    const certificate = await updateCertificateByUser(
      Number(id),
      id_user,
      certificateData,
    );

    if (!certificate) {
      removeUploadedFile(req.file);

      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    // Se substituiu o arquivo, remover o antigo
    if (req.file && currentCertificate.file_path) {
      const oldFileName = path.basename(currentCertificate.file_path);

      const oldFilePath = path.join(certificatesUploadPath, oldFileName);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return res.status(200).json({
      message: "Certificado atualizado com sucesso.",
      certificate,
    });
  } catch (error) {
    console.error("Erro ao atualizar certificado:", error);

    removeUploadedFile(req.file);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "A categoria selecionada é inválida.",
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar certificado.",
    });
  }
}

// ==========================================
// EXCLUIR CERTIFICADO
// ==========================================

async function deleteCertificateController(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID do certificado inválido.",
      });
    }

    const certificate = await selectCertificateByIdAndUser(Number(id), id_user);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    const deletedCertificate = await deleteCertificateByUser(
      Number(id),
      id_user,
    );

    if (!deletedCertificate) {
      return res.status(404).json({
        message: "Certificado não encontrado.",
      });
    }

    // Remover arquivo físico
    if (certificate.file_path) {
      const fileName = path.basename(certificate.file_path);

      const filePath = path.join(certificatesUploadPath, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(200).json({
      message: "Certificado excluído com sucesso.",
      certificate: deletedCertificate,
    });
  } catch (error) {
    console.error("Erro ao excluir certificado:", error);

    return res.status(500).json({
      message: "Erro ao excluir certificado.",
    });
  }
}

// ==========================================
// DOWNLOAD
// ==========================================

async function downloadCertificate(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID do certificado inválido.",
      });
    }

    const certificate = await selectCertificateByIdAndUser(Number(id), id_user);

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

// ==========================================
// PREVIEW
// ==========================================

async function previewCertificate(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID do certificado inválido.",
      });
    }

    const certificate = await selectCertificateByIdAndUser(Number(id), id_user);

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

// ==========================================
// EXPORTS
// ==========================================

export {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificateController,
  deleteCertificateController,
  downloadCertificate,
  previewCertificate,
};
