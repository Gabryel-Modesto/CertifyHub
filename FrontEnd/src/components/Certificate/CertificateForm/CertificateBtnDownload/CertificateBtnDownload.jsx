import api from "../../../../services/api.js";

import Alert from "../../../Alert/Alert.jsx";
import Loading from "../../../Loading/Loading.jsx";

import { useState } from "react";

import styles from "./CertificateBtnDownload.module.css";

function CertificateDownloadButton({ certificate }) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleDownload = async (event) => {
    event.stopPropagation();

    setAlert(null);

    if (!certificate.file_path) {
      setAlert({
        message: "Este certificado não possui um arquivo.",
        type: "warning",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/certificates/${certificate.id_certificate}/download`,
        {
          responseType: "blob",
        },
      );

      const extension = certificate.file_path.split(".").pop().split("?")[0];

      const fileName = `${certificate.name_certificate}.${extension}`;

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      setAlert({
        message: "Certificado baixado com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Erro ao baixar certificado:",
        error.response?.data || error.message,
      );

      // Sessão expirada
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAlert({
          message: "Sua sessão expirou. Faça login novamente.",
          type: "error",
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

        return;
      }

      // Outros erros
      setAlert({
        message:
          error.response?.data?.message || "Erro ao baixar o certificado.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* LOADING */}
      {loading && <Loading message="Baixando certificado..." />}

      {/* BOTÃO */}
      <button
        type="button"
        className={styles.downloadButton}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? "Baixando..." : "⬇ Baixar certificado"}
      </button>
    </>
  );
}

export default CertificateDownloadButton;
