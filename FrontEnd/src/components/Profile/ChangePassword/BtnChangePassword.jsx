import { useState } from "react";

import api from "../../../services/api.js";

import Alert from "../../Alert/Alert.jsx";

import Loading from "../../Loading/Loading.jsx";

import styles from "./BtnChangePassword.module.css";

function BtnChangePassword({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  // =========================================
  // ABRIR MODAL
  // =========================================

  const handleOpen = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAlert(null);

    setIsOpen(true);
  };

  // =========================================
  // FECHAR MODAL
  // =========================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAlert(null);

    setIsOpen(false);
  };

  // =========================================
  // ALTERAR SENHA
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert(null);

    // =========================================
    // VALIDAÇÕES
    // =========================================

    if (!currentPassword || !newPassword || !confirmPassword) {
      setAlert({
        message: "Preencha todos os campos.",
        type: "warning",
      });

      return;
    }

    if (newPassword.length < 6) {
      setAlert({
        message: "A nova senha deve possuir pelo menos 6 caracteres.",
        type: "warning",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({
        message: "As novas senhas não coincidem.",
        type: "error",
      });

      return;
    }

    if (newPassword === currentPassword) {
      setAlert({
        message: "A nova senha deve ser diferente da senha atual.",
        type: "warning",
      });

      return;
    }

    // =========================================
    // REQUISIÇÃO
    // =========================================

    try {
      setLoading(true);

      const response = await api.put(`/users/${user.id}/password`, {
        currentPassword,
        newPassword,
      });

      // Limpar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Mostrar sucesso
      setAlert({
        message: response.data.message || "Senha alterada com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Erro ao alterar senha:",
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
          window.location.href = "/";
        }, 1500);

        return;
      }

      // Erro de validação
      if (error.response?.status === 400) {
        setAlert({
          message: error.response?.data?.message || "Dados inválidos.",
          type: "warning",
        });

        return;
      }

      // Outros erros
      setAlert({
        message: error.response?.data?.message || "Erro ao alterar senha.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÃO */}
      <button
        type="button"
        className={styles.passwordButton}
        onClick={handleOpen}
        disabled={loading}
      >
        🔐 Alterar senha
      </button>

      {/* LOADING */}
      {loading && <Loading message="Alterando senha..." />}

      {/* MODAL */}
      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            {/* ALERT */}
            {alert && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
              />
            )}

            {/* HEADER */}
            <div className={styles.modalHeader}>
              <h2>Alterar senha</h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* SENHA ATUAL */}
              <div className={styles.formGroup}>
                <label>Senha atual</label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* NOVA SENHA */}
              <div className={styles.formGroup}>
                <label>Nova senha</label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              {/* CONFIRMAR NOVA SENHA */}
              <div className={styles.formGroup}>
                <label>Confirmar nova senha</label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              {/* AÇÕES */}
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className={styles.cancelButton}
                >
                  Fechar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.saveButton}
                >
                  {loading ? "Alterando..." : "Alterar senha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BtnChangePassword;
