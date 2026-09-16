import { useState } from "react";
import axios from "axios";
import styles from "./BtnChangePassword.module.css";

function BtnChangePassword({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOpen = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setIsOpen(true);
  };

  const handleClose = () => {
    if (loading) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setIsOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As novas senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `http://localhost:3000/users/${user.id}/password`,
        {
          currentPassword,
          newPassword,
        },
      );

      setSuccess(response.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.passwordButton}
        onClick={handleOpen}
      >
        🔐 Alterar senha
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
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
              <div className={styles.formGroup}>
                <label>Senha atual</label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nova senha</label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirmar nova senha</label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              {success && <p className={styles.success}>{success}</p>}

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
