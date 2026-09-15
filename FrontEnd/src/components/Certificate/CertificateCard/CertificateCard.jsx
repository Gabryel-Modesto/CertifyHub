import styles from "./CertificateCard.module.css";

import CertificateBtnDownload from "../CertificateForm/CertificateBtnDownload/CertificateBtnDownload.jsx";

function CertificateCard({ certificate, onClick }) {
  return (
    <div
      className={styles.certificateCard}
      onClick={() => onClick(certificate.id_certificate)}
    >
      {/* IMAGEM / PREVIEW */}

      <div className={styles.certificateImage}>
        {certificate.file_path ? (
          <img
            src={`http://localhost:3000${certificate.file_path}`}
            alt={certificate.name_certificate}
          />
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
