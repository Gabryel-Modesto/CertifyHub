import styles from "./Certificates.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import CertificateCard from "../../components/Certificate/CertificateCard/CertificateCard.jsx";
import CertificateFilters from "../../components/Certificate/CertificateFilters/CertificateFilters.jsx";
import CertificateHeader from "../../components/Certificate/CertificateHeader/CertificateHeader.jsx";
import CertificateEmptyState from "../../components/Certificate/CertificateEmptyState/CertificateEmptyState.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("recentes");

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

  const handleCertificate = (id) => {
    navigate(`/certificates/${id}`);
  };

  const handleRegister = () => {
    navigate("/registerCertificate");
  };

  const filteredCertificates = certificates
    .filter((certificate) => {
      const searchText = search.toLowerCase();

      return (
        certificate.name_certificate.toLowerCase().includes(searchText) ||
        certificate.institution_certificate.toLowerCase().includes(searchText)
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
        return a.name_certificate.localeCompare(b.name_certificate);
      }

      if (sort === "za") {
        return b.name_certificate.localeCompare(a.name_certificate);
      }

      return 0;
    });

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        <CertificateHeader onRegister={handleRegister} />
        <CertificateFilters search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort}/>

        {loading && <p>Carregando certificados...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && filteredCertificates.length > 0 && (
          <section className={styles.certificateGrid}>
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id_certificate} certificate={certificate} onClick={handleCertificate} /> 
              ))} </section> )}

        {!loading &&
          !error &&
          certificates.length > 0 &&
          filteredCertificates.length === 0 && (
            <CertificateEmptyState type="filter" />
          )}

        {!loading && !error && certificates.length === 0 && (
          <CertificateEmptyState type="empty" onRegister={handleRegister} />
        )}
      </main>
    </div>
  );
}

export default Certificates;
