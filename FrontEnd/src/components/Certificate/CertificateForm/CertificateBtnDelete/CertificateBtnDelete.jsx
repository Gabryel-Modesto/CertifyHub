import axios from "axios";
import { useNavigate } from "react-router-dom";

import styles from "./CertificateBtnDelete.module.css";

function CertificateBtnDelete({ id }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este certificado?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/certificates/${id}`);

      navigate("/certificates");
    } catch (error) {
      console.error(error);

      alert("Erro ao excluir o certificado.");
    }
  };

  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={handleDelete}
    >
      🗑️ Excluir
    </button>
  );
}

export default CertificateBtnDelete;
