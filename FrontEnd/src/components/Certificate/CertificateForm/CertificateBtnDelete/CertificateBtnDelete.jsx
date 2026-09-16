import api from "../../../../services/api.js";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ConfirmModal from "../../../ConfirmModal/ConfirmModal.jsx";
import Loading from "../../../Loading/Loading.jsx";
import Alert from "../../../Alert/Alert.jsx";

import styles from "./CertificateBtnDelete.module.css";

function CertificateBtnDelete({ id }) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Abrir confirmação
  const handleDelete = () => {
    setShowModal(true);
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    if (loading) {
      return;
    }

    setShowModal(false);
  };

  // Confirmar exclusão
  const handleConfirmDelete = async () => {
    setShowModal(false);
    setLoading(true);
    setAlert(null);

    try {
      await api.delete(`/certificates/${id}`);

      // Exclusão realizada
      setAlert({
        message: "Certificado excluído com sucesso!",
        type: "success",
      });

      // Voltar para certificados
      setTimeout(() => {
        navigate("/certificates");
      }, 1000);
    } catch (error) {
      console.error(
        "Erro ao excluir certificado:",
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

      // Outros erros
      setAlert({
        message:
          error.response?.data?.message || "Erro ao excluir o certificado.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* LOADING */}
      {loading && <Loading message="Excluindo certificado..." />}

      {/* BOTÃO */}
      <button
        type="button"
        className={styles.deleteButton}
        onClick={handleDelete}
        disabled={loading}
      >
        🗑️ Excluir
      </button>

      {/* CONFIRMAÇÃO */}
      {showModal && (
        <ConfirmModal
          title="Excluir certificado?"
          message="Tem certeza que deseja excluir este certificado? Essa ação não poderá ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}

export default CertificateBtnDelete;
