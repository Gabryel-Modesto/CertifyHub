import styles from "./Dashboard.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import CertificateBtnDownload from "../../components/Certificate/CertificateForm/CertificateBtnDownload/CertificateBtnDownload.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import api from "../../services/api.js";

function Dashboard() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [previewUrls, setPreviewUrls] = useState({});
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(null);

  // =========================================
  // ABRIR DETALHES DO CERTIFICADO
  // =========================================

  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  // =========================================
  // BUSCAR CERTIFICADOS DO USUÁRIO
  // =========================================

  useEffect(() => {
    async function fetchCertificates() {
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

        const response = await api.get("/certificates");

        const certificatesData = Array.isArray(response.data)
          ? response.data
          : response.data.certificates || [];

        setCertificates(certificatesData);
      } catch (error) {
        console.error(
          "Erro ao buscar certificados:",
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

        // Erro ao buscar certificados
        setAlert({
          message:
            error.response?.data?.message ||
            "Erro ao carregar os certificados.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, [navigate]);

  // =========================================
  // INDICADORES DO DASHBOARD
  // =========================================

  const statistics = useMemo(() => {
    const totalCertificates = certificates.length;

    const totalHours = certificates.reduce((total, certificate) => {
      return total + Number(certificate.hours_certificate || 0);
    }, 0);

    const institutions = new Set(
      certificates.map((certificate) => certificate.institution_certificate),
    );

    return {
      totalCertificates,
      totalHours,
      totalInstitutions: institutions.size,
    };
  }, [certificates]);

  // =========================================
  // CERTIFICADOS MAIS RECENTES
  // =========================================

  const recentCertificates = useMemo(() => {
    return [...certificates]
      .sort((a, b) => {
        return new Date(b.date_conclusion) - new Date(a.date_conclusion);
      })
      .slice(0, 3);
  }, [certificates]);

  // =========================================
  // CARREGAR PREVIEWS DOS CERTIFICADOS
  // =========================================

  useEffect(() => {
    let cancelled = false;

    const loadPreviews = async () => {
      const certificatesWithFiles = recentCertificates.filter(
        (certificate) => certificate.file_path,
      );

      if (certificatesWithFiles.length === 0) {
        setPreviewUrls({});
        return;
      }

      const loadedPreviews = {};

      for (const certificate of certificatesWithFiles) {
        try {
          const response = await api.get(
            `/certificates/${certificate.id_certificate}/preview`,
            {
              responseType: "blob",
            },
          );

          const url = window.URL.createObjectURL(response.data);

          loadedPreviews[certificate.id_certificate] = url;
        } catch (error) {
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

          console.error(
            "Erro ao carregar preview do certificado:",
            error.response?.data || error.message,
          );
        }
      }

      if (!cancelled) {
        setPreviewUrls(loadedPreviews);
      } else {
        Object.values(loadedPreviews).forEach((url) => {
          window.URL.revokeObjectURL(url);
        });
      }
    };

    loadPreviews();

    return () => {
      cancelled = true;
    };
  }, [recentCertificates, navigate]);

  // =========================================
  // LIBERAR PREVIEWS
  // =========================================

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // =========================================
  // RENDERIZAÇÃO
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
        {/* CABEÇALHO */}
        <div className={styles.header}>
          <div>
            <h1>Dashboard</h1>

            <p>Bem-vindo ao CertifyHub!</p>
          </div>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <section className={styles.stats}>
          {/* TOTAL DE CERTIFICADOS */}
          <div className={styles.statCard}>
            <span className={styles.icon}>📜</span>

            <div>
              <p>Total de certificados</p>

              <h2>{loading ? "..." : statistics.totalCertificates}</h2>
            </div>
          </div>

          {/* INSTITUIÇÕES */}
          <div className={styles.statCard}>
            <span className={styles.icon}>🏢</span>

            <div>
              <p>Instituições</p>

              <h2>{loading ? "..." : statistics.totalInstitutions}</h2>
            </div>
          </div>

          {/* HORAS ESTUDADAS */}
          <div className={styles.statCard}>
            <span className={styles.icon}>⏱️</span>

            <div>
              <p>Horas estudadas</p>

              <h2>{loading ? "..." : `${statistics.totalHours}h`}</h2>
            </div>
          </div>
        </section>

        {/* CERTIFICADOS RECENTES */}
        <section className={styles.recent}>
          <div className={styles.recentHeader}>
            <h2>Certificados recentes</h2>

            <button type="button" onClick={() => navigate("/certificates")}>
              Ver todos
            </button>
          </div>

          {/* LOADING */}
          {loading && <p>Carregando certificados...</p>}

          {/* SEM CERTIFICADOS */}
          {!loading && recentCertificates.length === 0 && (
            <p>Nenhum certificado cadastrado ainda.</p>
          )}

          {/* CERTIFICADOS */}
          {!loading && recentCertificates.length > 0 && (
            <div className={styles.certificateGrid}>
              {recentCertificates.map((certificate) => {
                const previewUrl = previewUrls[certificate.id_certificate];

                const isPdf = certificate.file_path
                  ?.toLowerCase()
                  .endsWith(".pdf");

                return (
                  <div
                    key={certificate.id_certificate}
                    className={styles.certificateCard}
                    onClick={() =>
                      handleCertificate(certificate.id_certificate)
                    }
                  >
                    {/* IMAGEM DO CERTIFICADO */}
                    <div className={styles.certificateImage}>
                      {certificate.file_path ? (
                        isPdf ? (
                          <span>📄 PDF</span>
                        ) : previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={`Certificado ${certificate.name_certificate}`}
                          />
                        ) : (
                          <span>Carregando...</span>
                        )
                      ) : (
                        <span>📜</span>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className={styles.certificateInfo}>
                      <h3>{certificate.name_certificate}</h3>

                      <p>{certificate.institution_certificate}</p>

                      <div className={styles.certificateDetails}>
                        <span>
                          {certificate.name_category ||
                            certificate.category_certificate ||
                            "Sem categoria"}
                        </span>

                        <span>{certificate.hours_certificate}h</span>
                      </div>

                      {/* BOTÃO DE DOWNLOAD */}
                      <div className={styles.downloadContainer}>
                        <CertificateBtnDownload certificate={certificate} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
