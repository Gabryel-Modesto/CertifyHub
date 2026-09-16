import { useState } from "react";

import api from "../../../services/api.js";

import Alert from "../../Alert/Alert.jsx";
import Loading from "../../Loading/Loading.jsx";

import styles from "./BtnEditUser.module.css";

function BtnEditUser({ user, onUserUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleOpen = () => {
    setName(user.name);
    setEmail(user.email);
    setAlert(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (loading) return;

    setName(user.name);
    setEmail(user.email);
    setAlert(null);
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert(null);

    // Validar campos
    if (!name.trim() || !email.trim()) {
      setAlert({
        message: "Preencha todos os campos.",
        type: "warning",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.put(`/users/${user.id}`, {
        name: name.trim(),
        email: email.trim(),
      });

      const updatedUser = response.data.user;

      // Atualizar usuário salvo
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Atualizar usuário no Profile
      onUserUpdated(updatedUser);

      // Fechar modal
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Erro ao atualizar usuário:",
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

      // Outros erros
      setAlert({
        message: error.response?.data?.message || "Erro ao atualizar usuário.",
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
        className={styles.editButton}
        onClick={handleOpen}
        disabled={loading}
      >
        ✏️ Editar perfil
      </button>

      {/* LOADING */}
      {loading && <Loading message="Salvando alterações..." />}

      {/* MODAL */}
      {isEditing && (
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
              <h2>Editar perfil</h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCancel}
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NOME */}
              <div className={styles.formGroup}>
                <label>Nome</label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* E-MAIL */}
              <div className={styles.formGroup}>
                <label>E-mail</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* AÇÕES */}
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.saveButton}
                >
                  {loading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BtnEditUser;
