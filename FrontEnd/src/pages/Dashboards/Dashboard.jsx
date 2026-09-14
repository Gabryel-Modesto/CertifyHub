import styles from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

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
              <h2>12</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>⏳</span>

            <div>
              <p>Próximos do vencimento</p>
              <h2>2</h2>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.icon}>🏢</span>

            <div>
              <p>Instituições</p>
              <h2>5</h2>
            </div>
          </div>
        </section>

        {/* CERTIFICADOS RECENTES */}

        <section className={styles.recent}>
          <div className={styles.recentHeader}>
            <h2>Certificados recentes</h2>

            <button onClick={() => navigate("/certificates")}>Ver todos</button>
          </div>

          <div className={styles.certificateGrid}>
            {/* CERTIFICADO 1 */}

            <div
              className={styles.certificateCard}
              onClick={() => handleCertificate(1)}
            >
              <div className={styles.certificateImage}>
                <span>📜</span>
              </div>

              <div className={styles.certificateInfo}>
                <h3>Java Completo</h3>

                <p>Rocketseat</p>

                <div className={styles.certificateDetails}>
                  <span>Tecnologia</span>
                  <span>40h</span>
                </div>
              </div>
            </div>

            {/* CERTIFICADO 2 */}

            <div
              className={styles.certificateCard}
              onClick={() => handleCertificate(2)}
            >
              <div className={styles.certificateImage}>
                <span>📜</span>
              </div>

              <div className={styles.certificateInfo}>
                <h3>React</h3>

                <p>Hashtag Treinamentos</p>

                <div className={styles.certificateDetails}>
                  <span>Tecnologia</span>
                  <span>30h</span>
                </div>
              </div>
            </div>

            {/* CERTIFICADO 3 */}

            <div
              className={styles.certificateCard}
              onClick={() => handleCertificate(3)}
            >
              <div className={styles.certificateImage}>
                <span>📜</span>
              </div>

              <div className={styles.certificateInfo}>
                <h3>Oracle Database</h3>

                <p>Oracle</p>

                <div className={styles.certificateDetails}>
                  <span>Banco de Dados</span>
                  <span>20h</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
