import styles from "./Certificates.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Certificates() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Buscar certificados da API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/certificates");

        setCertificates(response.data);
      } catch (error) {
        console.error(error);

        setError("Erro ao carregar certificados.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Abrir detalhes do certificado
  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  // Ir para cadastro
  const handleRegister = () => {
    navigate("/registerCertificate");
  };

  // Botão de download
  const handleDownload = (event, certificate) => {
    event.stopPropagation();

    console.log("Baixando certificado:", certificate.name_certificate);
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <h1>Meus Certificados</h1>

            <p>Gerencie todos os seus certificados em um só lugar.</p>
          </div>

          <button
            type="button"
            className={styles.registerButton}
            onClick={handleRegister}
          >
            + Cadastrar certificado
          </button>
        </div>

        {/* FILTROS */}

        <section className={styles.filters}>
          <input type="text" placeholder="🔍 Buscar certificado..." />

          <select>
            <option>Todas as categorias</option>
            <option>Tecnologia</option>
            <option>Banco de Dados</option>
            <option>Gestão</option>
            <option>Idiomas</option>
          </select>

          <select>
            <option>Mais recentes</option>
            <option>Mais antigos</option>
            <option>Nome A-Z</option>
            <option>Nome Z-A</option>
          </select>
        </section>

        {/* CARREGANDO */}

        {loading && <p>Carregando certificados...</p>}

        {/* ERRO */}

        {error && <p>{error}</p>}

        {/* CERTIFICADOS */}

        {!loading && !error && certificates.length > 0 && (
          <section className={styles.certificateGrid}>
            {certificates.map((certificate) => (
              <div
                className={styles.certificateCard}
                key={certificate.id_certificate}
                onClick={() => handleCertificate(certificate.id_certificate)}
              >
                {/* IMAGEM / PREVIEW */}

                <div className={styles.certificateImage}>
                  <span>📜</span>
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

                  <button
                    type="button"
                    className={styles.downloadButton}
                    onClick={(event) => handleDownload(event, certificate)}
                  >
                    ⬇ Baixar certificado
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* NENHUM CERTIFICADO */}

        {!loading && !error && certificates.length === 0 && (
          <div className={styles.emptyState}>
            <span>📜</span>

            <h2>Nenhum certificado cadastrado</h2>

            <p>Comece cadastrando seu primeiro certificado.</p>

            <button
              type="button"
              className={styles.registerButton}
              onClick={handleRegister}
            >
              + Cadastrar certificado
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Certificates;
