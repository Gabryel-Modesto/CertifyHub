import { useState } from "react";
import axios from "axios";
import styles from "./BtnEditUser.module.css";

function BtnEditUser({ user, onUserUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setName(user.name);
    setEmail(user.email);
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.put(
        `http://localhost:3000/users/${user.id}`,
        {
          name: name.trim(),
          email: email.trim(),
        },
      );

      const updatedUser = response.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      onUserUpdated(updatedUser);

      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao atualizar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className={styles.editButton} onClick={handleOpen}>
        ✏️ Editar perfil
      </button>

      {isEditing && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Editar perfil</h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCancel}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nome</label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>E-mail</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

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
