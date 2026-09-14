import styles from "./CertificateDetails.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import { useNavigate, useParams } from "react-router-dom";

function CertificateDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const certificates = [
    {
      id: "1",
      name: "Java Completo",
      institution: "Rocketseat",
      category: "Tecnologia",
      workload: "40h",
      issueDate: "10/09/2026",
      expirationDate: "10/09/2028",
    },
    {
      id: "2",
      name: "React",
      institution: "Hashtag Treinamentos",
      category: "Tecnologia",
      workload: "30h",
      issueDate: "05/08/2026",
      expirationDate: "05/08/2028",
    },
    {
      id: "3",
      name: "Oracle Database",
      institution: "Oracle",
      category: "Banco de Dados",
      workload: "20h",
      issueDate: "15/07/2026",
      expirationDate: "15/07/2028",
    },
    {
      id: "4",
      name: "JavaScript",
      institution: "Rocketseat",
      category: "Tecnologia",
      workload: "35h",
      issueDate: "20/06/2026",
      expirationDate: "20/06/2028",
    },
  ];

  const certificate = certificates.find((item) => item.id === id);

  const handleBack = () => {
    navigate("/certificates");
  };

  const handleDownload = () => {
    console.log("Baixar certificado:", certificate.id);
  };

  const handleEdit = () => {
    console.log("Editar certificado:", certificate.id);
  };

  const handleDelete = () => {
    console.log("Excluir certificado:", certificate.id);
  };

  if (!certificate) {
    return (
      <div className={styles.container}>
        <Sidebar />

        <main className={styles.content}>
          <h1>Certificado não encontrado</h1>

          <button className={styles.backButton} onClick={handleBack}>
            ← Voltar para certificados
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        <button className={styles.backButton} onClick={handleBack}>
          ← Voltar para certificados
        </button>

        <div className={styles.header}>
          <h1>{certificate.name}</h1>
          <p>{certificate.institution}</p>
        </div>

        <div className={styles.card}>
          {/* PREVIEW DO CERTIFICADO */}

          <div className={styles.certificatePreview}>
            <div className={styles.placeholder}>
              <span>📜</span>
              <p>Preview do certificado</p>
            </div>
          </div>

          {/* INFORMAÇÕES */}

          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span>Instituição</span>
              <strong>{certificate.institution}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Categoria</span>
              <strong>{certificate.category}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Carga horária</span>
              <strong>{certificate.workload}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Data de emissão</span>
              <strong>{certificate.issueDate}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Data de validade</span>
              <strong>{certificate.expirationDate}</strong>
            </div>
          </div>

          {/* AÇÕES */}

          <div className={styles.actions}>
            <button className={styles.downloadButton} onClick={handleDownload}>
              ⬇ Baixar certificado
            </button>

            <button className={styles.editButton} onClick={handleEdit}>
              ✏️ Editar
            </button>

            <button className={styles.deleteButton} onClick={handleDelete}>
              🗑️ Excluir
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CertificateDetails;
