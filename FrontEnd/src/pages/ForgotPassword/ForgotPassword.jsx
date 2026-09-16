import styles from "./ForgotPassword.module.css";

import { Link } from "react-router-dom";

import Footer from "../../components/Footer/Footer.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import Loading from "../../components/Loading/Loading.jsx";

import { useState } from "react";

import api from "../../services/api.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setAlert(null);

    // =========================================
    // NORMALIZAÇÃO
    // =========================================

    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // VALIDAÇÕES
    // =========================================

    if (!normalizedEmail) {
      setAlert({
        message: "Informe seu e-mail.",
        type: "warning",
      });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setAlert({
        message: "Informe um e-mail válido.",
        type: "warning",
      });

      return;
    }

    // =========================================
    // RECUPERAÇÃO
    // =========================================

    try {
      setLoading(true);

      const response = await api.post("/users/forgot-password", {
        email: normalizedEmail,
      });

      // Limpar campo
      setEmail("");

      // Mensagem do backend
      setAlert({
        message: response.data.message || "Solicitação enviada com sucesso.",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Erro ao solicitar recuperação de senha:",
        error.response?.data || error.message,
      );

      setAlert({
        message:
          error.response?.data?.message ||
          "Erro ao solicitar recuperação de senha.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LOADING */}
      {loading && <Loading message="Enviando link..." />}

      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <main className={styles.forgotPassword}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Esqueceu sua senha?</h2>

            <p>Informe seu email para recuperar sua senha.</p>
          </div>

          <form className={styles.form} onSubmit={handleForgotPassword}>
            {/* EMAIL */}
            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* BOTÃO */}
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>

          <div className={styles.loginLink}>
            <Link to="/">Voltar para o login</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ForgotPassword;
