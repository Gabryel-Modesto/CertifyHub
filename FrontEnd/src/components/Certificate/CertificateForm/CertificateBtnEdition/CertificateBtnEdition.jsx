import { useState } from "react";

import styles from "./CertificateBtnEdition.module.css";

function CertificateEditForm({ certificate, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    name_certificate: certificate.name_certificate || "",

    institution_certificate: certificate.institution_certificate || "",

    category_certificate: certificate.category_certificate || "",

    date_conclusion: certificate.date_conclusion
      ? certificate.date_conclusion.substring(0, 10)
      : "",

    date_validity: certificate.date_validity
      ? certificate.date_validity.substring(0, 10)
      : "",

    hours_certificate: certificate.hours_certificate || "",

    certification_code: certificate.certification_code || "",

    validation_link: certificate.validation_link || "",

    description: certificate.description || "",
  });

  const [file, setFile] = useState(null);

  // =========================================
  // ALTERAR CAMPOS
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // SELECIONAR NOVO ARQUIVO
  // =========================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Tipos permitidos
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Arquivo inválido. Selecione um PDF, PNG, JPG ou JPEG.");

      event.target.value = "";
      setFile(null);

      return;
    }

    // Limite de 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert("O arquivo deve possuir no máximo 5 MB.");

      event.target.value = "";
      setFile(null);

      return;
    }

    setFile(selectedFile);
  };

  // =========================================
  // SALVAR
  // =========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    // =========================================
    // NORMALIZAÇÃO
    // =========================================

    const name = formData.name_certificate.trim();

    const institution = formData.institution_certificate.trim();

    const category = formData.category_certificate.trim();

    const certificationCode = formData.certification_code.trim();

    const validationLink = formData.validation_link.trim();

    const description = formData.description.trim();

    // =========================================
    // VALIDAÇÕES
    // =========================================

    // Nome
    if (!name) {
      alert("Informe o nome do certificado.");
      return;
    }

    if (name.length > 250) {
      alert("O nome do certificado deve possuir no máximo 250 caracteres.");
      return;
    }

    // Instituição
    if (!institution) {
      alert("Informe a instituição.");
      return;
    }

    if (institution.length > 250) {
      alert("A instituição deve possuir no máximo 250 caracteres.");
      return;
    }

    // Categoria
    if (!category) {
      alert("Selecione uma categoria.");
      return;
    }

    // Data de emissão
    if (!formData.date_conclusion) {
      alert("Informe a data de emissão.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const conclusionDate = new Date(`${formData.date_conclusion}T00:00:00`);

    if (conclusionDate > today) {
      alert("A data de emissão não pode ser futura.");
      return;
    }

    // Data de validade
    if (formData.date_validity) {
      const validityDate = new Date(`${formData.date_validity}T00:00:00`);

      if (validityDate < conclusionDate) {
        alert("A data de validade não pode ser anterior à data de emissão.");
        return;
      }
    }

    // Carga horária
    if (!formData.hours_certificate) {
      alert("Informe a carga horária.");
      return;
    }

    const hours = Number(formData.hours_certificate);

    if (!Number.isInteger(hours) || hours <= 0) {
      alert("A carga horária deve ser um número inteiro maior que zero.");
      return;
    }

    // Código
    if (certificationCode.length > 250) {
      alert("O código de certificação deve possuir no máximo 250 caracteres.");
      return;
    }

    // Link
    if (validationLink) {
      try {
        new URL(validationLink);
      } catch {
        alert("Informe um link de validação válido.");
        return;
      }
    }

    // =========================================
    // ENVIAR PARA O PAI
    // =========================================

    const validatedData = {
      ...formData,
      name_certificate: name,
      institution_certificate: institution,
      category_certificate: category,
      certification_code: certificationCode,
      validation_link: validationLink,
      description,
      hours_certificate: hours,
    };

    onSave(validatedData, file);
  };

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      {/* =========================================
          NOME
      ========================================= */}

      <div className={styles.editInputGroup}>
        <label>Nome do certificado</label>

        <input
          type="text"
          name="name_certificate"
          value={formData.name_certificate}
          onChange={handleChange}
          required
          maxLength={250}
          disabled={saving}
        />
      </div>

      {/* =========================================
          INSTITUIÇÃO
      ========================================= */}

      <div className={styles.editInputGroup}>
        <label>Instituição</label>

        <input
          type="text"
          name="institution_certificate"
          value={formData.institution_certificate}
          onChange={handleChange}
          required
          maxLength={250}
          disabled={saving}
        />
      </div>

      {/* =========================================
          DATAS
      ========================================= */}

      <div className={styles.editRow}>
        <div className={styles.editInputGroup}>
          <label>Data de emissão</label>

          <input
            type="date"
            name="date_conclusion"
            value={formData.date_conclusion}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className={styles.editInputGroup}>
          <label>Data de validade</label>

          <input
            type="date"
            name="date_validity"
            value={formData.date_validity}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
      </div>

      {/* =========================================
          CARGA HORÁRIA / CATEGORIA
      ========================================= */}

      <div className={styles.editRow}>
        <div className={styles.editInputGroup}>
          <label>Carga horária</label>

          <input
            type="number"
            name="hours_certificate"
            value={formData.hours_certificate}
            onChange={handleChange}
            min="1"
            step="1"
            required
            disabled={saving}
          />
        </div>

        <div className={styles.editInputGroup}>
          <label>Categoria</label>

          <select
            name="category_certificate"
            value={formData.category_certificate}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="">Selecione uma categoria</option>

            <option value="Tecnologia">Tecnologia</option>

            <option value="Idiomas">Idiomas</option>

            <option value="Gestão">Gestão</option>

            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>

      {/* =========================================
          CÓDIGO
      ========================================= */}

      <div className={styles.editInputGroup}>
        <label>Código de certificação</label>

        <input
          type="text"
          name="certification_code"
          value={formData.certification_code}
          onChange={handleChange}
          placeholder="Ex: CERT-2026-001"
          maxLength={250}
          disabled={saving}
        />
      </div>

      {/* =========================================
          LINK
      ========================================= */}

      <div className={styles.editInputGroup}>
        <label>Link de validação</label>

        <input
          type="url"
          name="validation_link"
          value={formData.validation_link}
          onChange={handleChange}
          placeholder="https://..."
          disabled={saving}
        />
      </div>

      {/* =========================================
          DESCRIÇÃO
      ========================================= */}

      <div className={styles.editInputGroup}>
        <label>Descrição</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição do certificado..."
          rows="4"
          disabled={saving}
        />
      </div>

      {/* =========================================
          ARQUIVO
      ========================================= */}

      <div className={styles.editInputGroup}>
        <label>Foto / arquivo do certificado</label>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={saving}
        />

        {file && (
          <p className={styles.fileSelected}>
            Novo arquivo selecionado: <strong>{file.name}</strong>
          </p>
        )}

        {!file && certificate.file_path && (
          <p className={styles.currentFile}>Arquivo atual será mantido.</p>
        )}
      </div>

      {/* =========================================
          AÇÕES
      ========================================= */}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveButton} disabled={saving}>
          {saving ? "Salvando..." : "💾 Salvar alterações"}
        </button>

        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default CertificateEditForm;
