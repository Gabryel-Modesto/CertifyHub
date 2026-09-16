import styles from "./CertificateDetails.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import CertificateBtnEdition from "../../components/Certificate/CertificateForm/CertificateBtnEdition/CertificateBtnEdition.jsx";

import CertificateBtnDownload from "../../components/Certificate/CertificateForm/CertificateBtnDownload/CertificateBtnDownload.jsx";

import CertificateBtnDelete from "../../components/Certificate/CertificateForm/CertificateBtnDelete/CertificateBtnDelete.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../services/api.js";

function CertificateDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [certificate, setCertificate] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(null);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  // =========================================
  // BUSCAR CERTIFICADO + PREVIEW
  // =========================================

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setAlert(null);

        const token = localStorage.getItem("token");

        if (!token) {
          setAlert({
            message: "Sua sessão não foi encontrada. Faça login novamente.",
            type: "error",
          });

          setTimeout(() => {
            navigate("/");
          }, 1500);

          return;
        }

        // Buscar dados do certificado
        const response = await api.get(`/certificates/${id}`);

        const certificateData = response.data;

        setCertificate(certificateData);

        // Buscar preview protegido
        if (certificateData.file_path) {
          const fileResponse = await api.get(`/certificates/${id}/preview`, {
            responseType: "blob",
          });

          const url = window.URL.createObjectURL(fileResponse.data);

          setPreviewUrl(url);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar certificado:",
          error.response?.data || error.message,
        );

        // Token inválido ou expirado
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setAlert({
            message: "Sua sessão expirou. Faça login novamente.",
            type: "error",
          });

          setTimeout(() => {
            navigate("/");
          }, 1500);

          return;
        }

        // Certificado não encontrado
        if (error.response?.status === 404) {
          setAlert({
            message: "Certificado não encontrado.",
            type: "error",
          });

          return;
        }

        // Outros erros
        setAlert({
          message:
            error.response?.data?.message || "Erro ao carregar certificado.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id, navigate]);

  // =========================================
  // LIBERAR PREVIEW
  // =========================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        window.URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // =========================================
  // ATIVAR EDIÇÃO
  // =========================================

  const handleEdit = () => {
    setEditing(true);
    setAlert(null);
  };

  // =========================================
  // CANCELAR EDIÇÃO
  // =========================================

  const handleCancelEdit = () => {
    setEditing(false);
    setAlert(null);
  };

  // =========================================
  // SALVAR ALTERAÇÕES
  // =========================================

  const handleSave = async (formData, file) => {
    setSaving(true);
    setAlert(null);

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

      // Só envia arquivo se escolher um novo
      if (file) {
        data.append("file", file);
      }

      const response = await api.put(`/certificates/${id}`, data);

      setCertificate(response.data.certificate);

      setEditing(false);

      // Se houve novo arquivo, atualiza o preview
      if (file) {
        const fileResponse = await api.get(`/certificates/${id}/preview`, {
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(fileResponse.data);

        setPreviewUrl((oldUrl) => {
          if (oldUrl) {
            window.URL.revokeObjectURL(oldUrl);
          }

          return url;
        });
      }

      // Alert de sucesso
      setAlert({
        message: "Certificado atualizado com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar certificado:",
        error.response?.data || error.message,
      );

      // Token inválido ou expirado
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAlert({
          message: "Sua sessão expirou. Faça login novamente.",
          type: "error",
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }

      // Outros erros
      setAlert({
        message:
          error.response?.data?.message || "Erro ao atualizar certificado.",
        type: "error",
      });
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
  // CERTIFICADO NÃO ENCONTRADO
  // =========================================

  if (!certificate) {
    return (
      <div className={styles.container}>
        <Sidebar />

        <main className={styles.content}>
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          <h1>Certificado não encontrado.</h1>

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
      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

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

        {/* CARD */}
        <div className={styles.card}>
          {editing ? (
            <CertificateBtnEdition
              certificate={certificate}
              onSave={handleSave}
              onCancel={handleCancelEdit}
              saving={saving}
            />
          ) : (
            <>
              {/* PREVIEW */}
              <div className={styles.certificatePreview}>
                {certificate.file_path && previewUrl ? (
                  certificate.file_path.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={previewUrl}
                      title={certificate.name_certificate}
                      className={styles.pdfPreview}
                    />
                  ) : (
                    <img src={previewUrl} alt={certificate.name_certificate} />
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

                <button
                  className={styles.editButton}
                  onClick={handleEdit}
                  disabled={saving}
                >
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
