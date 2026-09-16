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
    if (loading) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setAlert(null);
    setIsEditing(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert(null);

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Nome obrigatório
    if (!normalizedName) {
      setAlert({
        message: "Informe seu nome.",
        type: "warning",
      });

      return;
    }

    // Nome mínimo
    if (normalizedName.length < 3) {
      setAlert({
        message: "O nome deve possuir pelo menos 3 caracteres.",
        type: "warning",
      });

      return;
    }

    // Nome máximo
    if (normalizedName.length > 150) {
      setAlert({
        message: "O nome deve possuir no máximo 150 caracteres.",
        type: "warning",
      });

      return;
    }

    // E-mail obrigatório
    if (!normalizedEmail) {
      setAlert({
        message: "Informe seu e-mail.",
        type: "warning",
      });

      return;
    }

    // E-mail válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setAlert({
        message: "Informe um e-mail válido.",
        type: "warning",
      });

      return;
    }

    // E-mail máximo
    if (normalizedEmail.length > 250) {
      setAlert({
        message: "O e-mail deve possuir no máximo 250 caracteres.",
        type: "warning",
      });

      return;
    }

    const currentName = user.name.trim();
    const currentEmail = user.email.trim().toLowerCase();

    if (normalizedName === currentName && normalizedEmail === currentEmail) {
      setAlert({
        message: "Nenhuma alteração foi realizada.",
        type: "info",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.put(`/users/${user.id}`, {
        name: normalizedName,
        email: normalizedEmail,
      });

      const updatedUser = response.data.user;

      // Atualizar usuário salvo
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Atualizar Profile
      onUserUpdated(updatedUser);

      // Fechar modal
      setIsEditing(false);

      // Alert de sucesso
      setAlert({
        message: response.data.message || "Usuário atualizado com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar usuário:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsEditing(false);

        setAlert({
          message: "Sua sessão expirou. Faça login novamente.",
          type: "error",
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);

        return;
      }

      if (error.response?.status === 409) {
        setAlert({
          message:
            error.response?.data?.message ||
            "Este e-mail já está sendo utilizado.",
          type: "error",
        });

        return;
      }

      if (error.response?.status === 400) {
        setAlert({
          message: error.response?.data?.message || "Dados inválidos.",
          type: "warning",
        });

        return;
      }

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

      <button
        type="button"
        className={styles.editButton}
        onClick={handleOpen}
        disabled={loading}
      >
        ✏️ Editar perfil
      </button>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {loading && <Loading message="Salvando alterações..." />}


      {isEditing && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
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
                  maxLength={150}
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
                  maxLength={250}
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
