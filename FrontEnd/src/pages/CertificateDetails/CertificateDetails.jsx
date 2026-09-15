import styles from "./CertificateDetails.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import CertificateBtnEdition from "../../components/Certificate/CertificateForm/CertificateBtnEdition/CertificateBtnEdition.jsx";
import CertificateBtnDownload from "../../components/Certificate/CertificateForm/CertificateBtnDownload/CertificateBtnDownload.jsx";
import CertificateBtnDelete from "../../components/Certificate/CertificateForm/CertificateBtnDelete/CertificateBtnDelete.jsx";
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

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/certificates/${id}`,
        );

        setCertificate(response.data);
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

  // =========================================
  // ATIVAR EDIÇÃO
  // =========================================

  const handleEdit = () => {
    setEditing(true);
    setError("");
  };

  // =========================================
  // CANCELAR EDIÇÃO
  // =========================================

  const handleCancelEdit = () => {
    setEditing(false);
    setError("");
  };

  // =========================================
  // SALVAR ALTERAÇÕES
  // =========================================

  const handleSave = async (formData, file) => {
    setSaving(true);
    setError("");

    try {
      const data = new FormData();

      data.append("name_certificate", formData.name_certificate);

      data.append("institution_certificate", formData.institution_certificate);

      data.append("category_certificate", formData.category_certificate);

      data.append("date_conclusion", formData.date_conclusion);

      if (formData.date_validity) {
        data.append("date_validity", formData.date_validity);
      }

      data.append("hours_certificate", formData.hours_certificate);

      if (formData.certification_code) {
        data.append("certification_code", formData.certification_code);
      }

      if (formData.validation_link) {
        data.append("validation_link", formData.validation_link);
      }

      if (formData.description) {
        data.append("description", formData.description);
      }

      // Só envia arquivo se o usuário
      // escolher um novo arquivo
      if (file) {
        data.append("file", file);
      }

      const response = await axios.put(
        `http://localhost:3000/certificates/${id}`,
        data,
      );

      setCertificate(response.data.certificate);

      setEditing(false);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Erro ao atualizar certificado.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // VOLTAR
  // =========================================

  const handleBack = () => {
    navigate("/certificates");
  };

  // =========================================
  // LOADING
  // =========================================

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

  // =========================================
  // ERRO
  // =========================================

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

  // =========================================
  // PÁGINA
  // =========================================

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
            // =========================================
            // COMPONENTE DE EDIÇÃO
            // =========================================

            <CertificateBtnEdition
              certificate={certificate}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              saving={saving}
            />
          ) : (
            // =========================================
            // MODO VISUALIZAÇÃO
            // =========================================

            <>
              {/* PREVIEW */}

              <div className={styles.certificatePreview}>
                {certificate.file_path ? (
                  certificate.file_path.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={`http://localhost:3000${certificate.file_path}`}
                      title={certificate.name_certificate}
                      className={styles.pdfPreview}
                    />
                  ) : (
                    <img
                      src={`http://localhost:3000${certificate.file_path}`}
                      alt={certificate.name_certificate}
                    />
                  )
                ) : (
                  <div className={styles.placeholder}>
                    <span>📜</span>

                    <p>Preview do certificado</p>
                  </div>
                )}
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
                <CertificateBtnDownload certificate={certificate} />

                <button className={styles.editButton} onClick={handleEdit}>
                  ✏️ Editar
                </button>

                <CertificateBtnDelete id={id} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CertificateDetails;
