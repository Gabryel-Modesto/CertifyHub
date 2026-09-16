import styles from "./Certificates.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import CertificateCard from "../../components/Certificate/CertificateCard/CertificateCard.jsx";

import CertificateFilters from "../../components/Certificate/CertificateFilters/CertificateFilters.jsx";

import CertificateHeader from "../../components/Certificate/CertificateHeader/CertificateHeader.jsx";

import CertificateEmptyState from "../../components/Certificate/CertificateEmptyState/CertificateEmptyState.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../../services/api.js";

function Certificates() {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState(null);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("Todas");

  const [sort, setSort] = useState("recentes");

  // =====================================================
  // BUSCAR CERTIFICADOS
  // =====================================================

  useEffect(() => {
    const fetchCertificates = async () => {
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

        setAlert({
          message:
            error.response?.data?.message || "Erro ao carregar certificados.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  // =====================================================
  // BUSCAR CATEGORIAS
  // =====================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        const categoriesData = Array.isArray(response.data)
          ? response.data
          : response.data.categories || [];

        setCategories(categoriesData);
      } catch (error) {
        console.error(
          "Erro ao buscar categorias:",
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
            navigate("/");
          }, 1500);

          return;
        }

        setAlert({
          message:
            error.response?.data?.message || "Erro ao carregar categorias.",
          type: "error",
        });
      }
    };

    fetchCategories();
  }, [navigate]);

  // =====================================================
  // ABRIR DETALHES DO CERTIFICADO
  // =====================================================

  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  // =====================================================
  // ABRIR TELA DE CADASTRO
  // =====================================================

  const handleRegister = () => {
    navigate("/registerCertificate");
  };

  // =====================================================
  // FILTRAR E ORDENAR CERTIFICADOS
  // =====================================================

  const filteredCertificates = certificates
    .filter((certificate) => {
      const searchText = search.toLowerCase();

      const certificateName = (
        certificate.name_certificate || ""
      ).toLowerCase();

      const institutionName = (
        certificate.institution_certificate || ""
      ).toLowerCase();

      const categoryName = (certificate.name_category || "").toLowerCase();

      return (
        certificateName.includes(searchText) ||
        institutionName.includes(searchText) ||
        categoryName.includes(searchText)
      );
    })
    .filter((certificate) => {
      if (category === "Todas") {
        return true;
      }

      return certificate.name_category === category;
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

  // =====================================================
  // RENDERIZAÇÃO
  // =====================================================

  return (
    <div className={styles.container}>
      {/* ALERTA */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* SIDEBAR */}
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
          categories={categories}
        />

        {/* CARREGAMENTO */}
        {loading && <p>Carregando certificados...</p>}

        {/* LISTA DE CERTIFICADOS */}
        {!loading && filteredCertificates.length > 0 && (
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
          certificates.length > 0 &&
          filteredCertificates.length === 0 && (
            <CertificateEmptyState type="filter" />
          )}

        {/* NENHUM CERTIFICADO CADASTRADO */}
        {!loading && certificates.length === 0 && (
          <CertificateEmptyState type="empty" onRegister={handleRegister} />
        )}
      </main>
    </div>
  );
}

export default Certificates;
