import styles from "./Certificates.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import { useNavigate } from "react-router-dom";

function Certificates() {
  const navigate = useNavigate();

  // Abre os detalhes do certificado
  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  // Botão de download
  const handleDownload = (event, certificate) => {
    event.stopPropagation();

    console.log("Baixando certificado:", certificate.name);
  };

  const certificates = [
    {
      id: 1,
      name: "Java Completo",
      institution: "Rocketseat",
      category: "Tecnologia",
      workload: "40h",
    },

    {
      id: 2,
      name: "React",
      institution: "Hashtag Treinamentos",
      category: "Tecnologia",
      workload: "30h",
    },

    {
      id: 3,
      name: "Oracle Database",
      institution: "Oracle",
      category: "Banco de Dados",
      workload: "20h",
    },

    {
      id: 4,
      name: "JavaScript",
      institution: "Rocketseat",
      category: "Tecnologia",
      workload: "35h",
    },
  ];

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* HEADER */}

        <div className={styles.header}>
          <h1>Meus Certificados</h1>

          <p>Gerencie todos os seus certificados em um só lugar.</p>
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

        {/* CERTIFICADOS */}

        <section className={styles.certificateGrid}>
          {certificates.map((certificate) => (
            <div
              className={styles.certificateCard}
              key={certificate.id}
              onClick={() => handleCertificate(certificate.id)}
            >
              {/* IMAGEM / PREVIEW */}

              <div className={styles.certificateImage}>
                <span>📜</span>
              </div>

              {/* INFORMAÇÕES */}

              <div className={styles.certificateInfo}>
                <h3>{certificate.name}</h3>

                <p>{certificate.institution}</p>

                <div className={styles.certificateDetails}>
                  <span>{certificate.category}</span>

                  <span>{certificate.workload}</span>
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
      </main>
    </div>
  );
}

export default Certificates;
