import styles from "./CertificateCard.module.css";

import CertificateBtnDownload from "../CertificateForm/CertificateBtnDownload/CertificateBtnDownload.jsx";

import api from "../../../services/api.js";

import { useEffect, useState } from "react";

function CertificateCard({ certificate, onClick }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadPreview = async () => {
      if (!certificate.file_path) {
        return;
      }

      try {
        setLoadingPreview(true);
        setPreviewError(false);

        const response = await api.get(
          `/certificates/${certificate.id_certificate}/preview`,
          {
            responseType: "blob",
          },
        );

        objectUrl = window.URL.createObjectURL(response.data);

        if (!cancelled) {
          setPreviewUrl(objectUrl);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar preview do certificado:",
          error.response?.data || error.message,
        );

        if (!cancelled) {
          setPreviewError(true);
        }
      } finally {
        if (!cancelled) {
          setLoadingPreview(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;

      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [certificate.id_certificate, certificate.file_path]);

  const isPdf = certificate.file_path?.toLowerCase().endsWith(".pdf");

  return (
    <div
      className={styles.certificateCard}
      onClick={() => onClick(certificate.id_certificate)}
    >
      {/* IMAGEM / PREVIEW */}
      <div className={styles.certificateImage}>
        {!certificate.file_path ? (
          <span>📜</span>
        ) : isPdf ? (
          <span>📄 PDF</span>
        ) : loadingPreview ? (
          <span>Carregando...</span>
        ) : previewError ? (
          <span>Não foi possível carregar o preview.</span>
        ) : previewUrl ? (
          <img src={previewUrl} alt={certificate.name_certificate} />
        ) : (
          <span>📜</span>
        )}
      </div>

      {/* INFORMAÇÕES */}
      <div className={styles.certificateInfo}>
        <h3>{certificate.name_certificate}</h3>

        <p>{certificate.institution_certificate}</p>

        {/* DETALHES */}
        <div className={styles.certificateDetails}>
          <span>{certificate.category_certificate}</span>

          <span>{certificate.hours_certificate}h</span>
        </div>

        {/* DOWNLOAD */}
        <div className={styles.downloadContainer}>
          <CertificateBtnDownload certificate={certificate} />
        </div>
      </div>
    </div>
  );
}

export default CertificateCard;
