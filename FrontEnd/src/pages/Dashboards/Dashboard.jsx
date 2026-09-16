import styles from "./Dashboard.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import CertificateBtnDownload from "../../components/Certificate/CertificateForm/CertificateBtnDownload/CertificateBtnDownload.jsx";

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Abrir detalhes do certificado
  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  // Buscar certificados do usuário logado
  useEffect(() => {
    async function fetchCertificates() {
      try {
        setLoading(true);
        setError("");

        const loggedUser = JSON.parse(localStorage.getItem("user"));

        if (!loggedUser) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/certificates?id_user=${loggedUser.id}`,
        );

        setCertificates(response.data);
      } catch (error) {
        console.error(error);

        setError("Erro ao carregar os certificados.");
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, [navigate]);

  // Indicadores do Dashboard
  const statistics = useMemo(() => {
    const totalCertificates = certificates.length;

    const totalHours = certificates.reduce((total, certificate) => {
      return total + Number(certificate.hours_certificate || 0);
    }, 0);

    const institutions = new Set(
      certificates.map((certificate) => certificate.institution_certificate),
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const nextThirtyDays = new Date();

    nextThirtyDays.setHours(0, 0, 0, 0);
    nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);

    const expiringCertificates = certificates.filter((certificate) => {
      if (!certificate.date_validity) {
        return false;
      }

      const validityDate = new Date(`${certificate.date_validity}T00:00:00`);

      return validityDate >= today && validityDate <= nextThirtyDays;
    });

    return {
      totalCertificates,
      totalHours,
      totalInstitutions: institutions.size,
      expiringCertificates: expiringCertificates.length,
    };
  }, [certificates]);

  // Organizar certificados mais recentes
  const recentCertificates = useMemo(() => {
    return [...certificates]
      .sort((a, b) => {
        return new Date(b.date_conclusion) - new Date(a.date_conclusion);
      })
      .slice(0, 3);
  }, [certificates]);

  return (
    <div className={styles.container}>
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
          <div className={styles.statCard}>
            <span className={styles.icon}>📜</span>

            <div>
              <p>Total de certificados</p>

              <h2>{loading ? "..." : statistics.totalCertificates}</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>⏳</span>

            <div>
              <p>Próximos do vencimento</p>

              <h2>{loading ? "..." : statistics.expiringCertificates}</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>🏢</span>

            <div>
              <p>Instituições</p>

              <h2>{loading ? "..." : statistics.totalInstitutions}</h2>
            </div>
          </div>

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

          {loading && <p>Carregando certificados...</p>}

          {!loading && error && <p>{error}</p>}

          {!loading && !error && recentCertificates.length === 0 && (
            <p>Nenhum certificado cadastrado ainda.</p>
          )}

          {!loading && !error && recentCertificates.length > 0 && (
            <div className={styles.certificateGrid}>
              {recentCertificates.map((certificate) => (
                <div
                  key={certificate.id_certificate}
                  className={styles.certificateCard}
                  onClick={() => handleCertificate(certificate.id_certificate)}
                >
                  {/* IMAGEM DO CERTIFICADO */}
                  <div className={styles.certificateImage}>
                    {certificate.file_path ? (
                      certificate.file_path.toLowerCase().endsWith(".pdf") ? (
                        <span>📄 PDF</span>
                      ) : (
                        <img
                          src={`http://localhost:3000${certificate.file_path}`}
                          alt={`Certificado ${certificate.name_certificate}`}
                        />
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
                      <span>{certificate.category_certificate}</span>

                      <span>{certificate.hours_certificate}h</span>
                    </div>

                    {/* BOTÃO DE DOWNLOAD */}
                    <div className={styles.downloadContainer}>
                      <CertificateBtnDownload certificate={certificate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
