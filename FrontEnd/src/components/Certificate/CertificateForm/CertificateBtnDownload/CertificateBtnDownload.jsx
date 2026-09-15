import axios from "axios";
import styles from './CertificateBtnDownload.module.css'

function CertificateDownloadButton({ certificate }) {
  const handleDownload = async (event) => {
    event.stopPropagation();

    if (!certificate.file_path) {
      alert("Este certificado não possui um arquivo.");
      return;
    }

    try {
      const fileUrl = `http://localhost:3000${certificate.file_path}`;

      const response = await axios.get(fileUrl, {
        responseType: "blob",
      });

      const extension = certificate.file_path
        .split(".")
        .pop()
        .split("?")[0];

      const fileName = `${certificate.name_certificate}.${extension}`;

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert("Erro ao baixar o certificado.");
    }
  };

  return (
    <button
      type="button"
      className={styles.downloadButton}
      onClick={handleDownload}
    >
      ⬇ Baixar certificado
    </button>
  );
}

export default CertificateDownloadButton;