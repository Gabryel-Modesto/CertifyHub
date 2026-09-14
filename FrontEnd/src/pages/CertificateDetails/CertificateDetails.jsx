import styles from "./CertificateDetails.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CertificateDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [certificate, setCertificate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name_certificate: "",
    institution_certificate: "",
    category_certificate: "",
    date_conclusion: "",
    date_validity: "",
    hours_certificate: "",
    certification_code: "",
    validation_link: "",
    description: "",
    file_path: null,
  });

  // Buscar certificado
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/certificates/${id}`,
        );

        setCertificate(response.data);

        setFormData({
          name_certificate: response.data.name_certificate || "",
          institution_certificate: response.data.institution_certificate || "",
          category_certificate: response.data.category_certificate || "",
          date_conclusion: response.data.date_conclusion
            ? response.data.date_conclusion.substring(0, 10)
            : "",
          date_validity: response.data.date_validity
            ? response.data.date_validity.substring(0, 10)
            : "",
          hours_certificate: response.data.hours_certificate || "",
          certification_code: response.data.certification_code || "",
          validation_link: response.data.validation_link || "",
          description: response.data.description || "",
          file_path: response.data.file_path || null,
        });
      } catch (error) {
        console.error(error);

        if (error.response?.status === 404) {
          setError("Certificado não encontrado.");
        } else {
          setError("Erro ao carregar certificado.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  // Alterar campos
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Ativar edição
  const handleEdit = () => {
    setEditing(true);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditing(false);

    setFormData({
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
      file_path: certificate.file_path || null,
    });
  };

  // Salvar alterações
  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const updatedCertificate = {
        name_certificate: formData.name_certificate,
        institution_certificate: formData.institution_certificate,
        category_certificate: formData.category_certificate,
        date_conclusion: formData.date_conclusion,
        date_validity: formData.date_validity || null,
        hours_certificate: Number(formData.hours_certificate),
        certification_code: formData.certification_code || null,
        validation_link: formData.validation_link || null,
        description: formData.description || null,
        file_path: formData.file_path || null,
      };

      const response = await axios.put(
        `http://localhost:3000/certificates/${id}`,
        updatedCertificate,
      );

      setCertificate(response.data.certificate);

      setEditing(false);
    } catch (error) {
      console.error(error);

      setError("Erro ao atualizar certificado.");
    } finally {
      setSaving(false);
    }
  };

  // Voltar
  const handleBack = () => {
    navigate("/certificates");
  };

  // Download
  const handleDownload = () => {
    console.log("Baixar certificado:", certificate.id_certificate);
  };

  // Excluir
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este certificado?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/certificates/${id}`);

      navigate("/certificates");
    } catch (error) {
      console.error(error);

      setError("Erro ao excluir certificado.");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />

        <main className={styles.content}>
          <p>Carregando certificado...</p>
        </main>
      </div>
    );
  }

  // Erro
  if (error && !certificate) {
    return (
      <div className={styles.container}>
        <Sidebar />

        <main className={styles.content}>
          <h1>{error}</h1>

          <button className={styles.backButton} onClick={handleBack}>
            ← Voltar para certificados
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* VOLTAR */}

        <button className={styles.backButton} onClick={handleBack}>
          ← Voltar para certificados
        </button>

        {/* HEADER */}

        <div className={styles.header}>
          <h1>{certificate.name_certificate}</h1>

          <p>{certificate.institution_certificate}</p>
        </div>

        {/* ERRO */}

        {error && <p>{error}</p>}

        {/* CARD */}

        <div className={styles.card}>
          {editing ? (
            /* =========================================
               MODO EDIÇÃO
            ========================================= */

            <form className={styles.editForm} onSubmit={handleSave}>
              <div className={styles.editInputGroup}>
                <label>Nome do certificado</label>

                <input
                  type="text"
                  name="name_certificate"
                  value={formData.name_certificate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.editInputGroup}>
                <label>Instituição</label>

                <input
                  type="text"
                  name="institution_certificate"
                  value={formData.institution_certificate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.editRow}>
                <div className={styles.editInputGroup}>
                  <label>Data de emissão</label>

                  <input
                    type="date"
                    name="date_conclusion"
                    value={formData.date_conclusion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.editInputGroup}>
                  <label>Data de validade</label>

                  <input
                    type="date"
                    name="date_validity"
                    value={formData.date_validity}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                  />
                </div>

                <div className={styles.editInputGroup}>
                  <label>Categoria</label>

                  <select
                    name="category_certificate"
                    value={formData.category_certificate}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>

                    <option value="Tecnologia">Tecnologia</option>

                    <option value="Idiomas">Idiomas</option>

                    <option value="Gestão">Gestão</option>

                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className={styles.editInputGroup}>
                <label>Código de certificação</label>

                <input
                  type="text"
                  name="certification_code"
                  value={formData.certification_code}
                  onChange={handleChange}
                  placeholder="Ex: CERT-2026-001"
                />
              </div>

              <div className={styles.editInputGroup}>
                <label>Link de validação</label>

                <input
                  type="url"
                  name="validation_link"
                  value={formData.validation_link}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.editInputGroup}>
                <label>Descrição</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descrição do certificado..."
                  rows="4"
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "💾 Salvar alterações"}
                </button>

                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            /* =========================================
               MODO VISUALIZAÇÃO
            ========================================= */

            <>
              {/* PREVIEW */}

              <div className={styles.certificatePreview}>
                <div className={styles.placeholder}>
                  <span>📜</span>

                  <p>Preview do certificado</p>
                </div>
              </div>

              {/* INFORMAÇÕES */}

              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span>Instituição</span>

                  <strong>{certificate.institution_certificate}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Categoria</span>

                  <strong>{certificate.category_certificate}</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Carga horária</span>

                  <strong>{certificate.hours_certificate}h</strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Data de emissão</span>

                  <strong>
                    {new Date(certificate.date_conclusion).toLocaleDateString(
                      "pt-BR",
                    )}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Data de validade</span>

                  <strong>
                    {certificate.date_validity
                      ? new Date(certificate.date_validity).toLocaleDateString(
                          "pt-BR",
                        )
                      : "Sem validade"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Código de certificação</span>

                  <strong>
                    {certificate.certification_code || "Não informado"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Link de validação</span>

                  <strong>
                    {certificate.validation_link || "Não informado"}
                  </strong>
                </div>

                <div className={styles.infoItem}>
                  <span>Descrição</span>

                  <strong>{certificate.description || "Não informado"}</strong>
                </div>
              </div>

              {/* AÇÕES */}

              <div className={styles.actions}>
                <button
                  className={styles.downloadButton}
                  onClick={handleDownload}
                >
                  ⬇ Baixar certificado
                </button>

                <button className={styles.editButton} onClick={handleEdit}>
                  ✏️ Editar
                </button>

                <button className={styles.deleteButton} onClick={handleDelete}>
                  🗑️ Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CertificateDetails;
