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

    setFile(selectedFile || null);
  };

  // =========================================
  // SALVAR
  // =========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave(formData, file);
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
