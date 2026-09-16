import styles from "./Certificates.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import CertificateCard from "../../components/Certificate/CertificateCard/CertificateCard.jsx";

import CertificateFilters from "../../components/Certificate/CertificateFilters/CertificateFilters.jsx";

import CertificateHeader from "../../components/Certificate/CertificateHeader/CertificateHeader.jsx";

import CertificateEmptyState from "../../components/Certificate/CertificateEmptyState/CertificateEmptyState.jsx";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../services/api.js";

function Certificates() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("Todas");

  const [sort, setSort] = useState("recentes");

  // Buscar certificados do usuário logado
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
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

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/");
          return;
        }

        setError("Erro ao carregar certificados.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  // Abrir detalhes do certificado
  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  // Abrir tela de cadastro
  const handleRegister = () => {
    navigate("/registerCertificate");
  };

  // Filtrar e ordenar certificados
  const filteredCertificates = certificates
    .filter((certificate) => {
      const searchText = search.toLowerCase();

      const certificateName = (
        certificate.name_certificate || ""
      ).toLowerCase();

      const institutionName = (
        certificate.institution_certificate || ""
      ).toLowerCase();

      return (
        certificateName.includes(searchText) ||
        institutionName.includes(searchText)
      );
    })

    .filter((certificate) => {
      if (category === "Todas") {
        return true;
      }

      return certificate.category_certificate === category;
    })

    .sort((a, b) => {
      if (sort === "recentes") {
        return new Date(b.date_conclusion) - new Date(a.date_conclusion);
      }

      if (sort === "antigos") {
        return new Date(a.date_conclusion) - new Date(b.date_conclusion);
      }

      if (sort === "az") {
        return (a.name_certificate || "").localeCompare(
          b.name_certificate || "",
        );
      }

      if (sort === "za") {
        return (b.name_certificate || "").localeCompare(
          a.name_certificate || "",
        );
      }

      return 0;
    });

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* CABEÇALHO */}
        <CertificateHeader onRegister={handleRegister} />

        {/* FILTROS */}
        <CertificateFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />

        {/* CARREGAMENTO */}
        {loading && <p>Carregando certificados...</p>}

        {/* ERRO */}
        {!loading && error && <p>{error}</p>}

        {/* LISTA DE CERTIFICADOS */}
        {!loading && !error && filteredCertificates.length > 0 && (
          <section className={styles.certificateGrid}>
            {filteredCertificates.map((certificate) => (
              <CertificateCard
                key={certificate.id_certificate}
                certificate={certificate}
                onClick={handleCertificate}
              />
            ))}
          </section>
        )}

        {/* NENHUM RESULTADO NOS FILTROS */}
        {!loading &&
          !error &&
          certificates.length > 0 &&
          filteredCertificates.length === 0 && (
            <CertificateEmptyState type="filter" />
          )}

        {/* NENHUM CERTIFICADO CADASTRADO */}
        {!loading && !error && certificates.length === 0 && (
          <CertificateEmptyState type="empty" onRegister={handleRegister} />
        )}
      </main>
    </div>
  );
}

export default Certificates;
