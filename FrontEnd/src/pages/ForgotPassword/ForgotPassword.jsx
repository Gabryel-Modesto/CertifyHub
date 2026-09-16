import styles from "./ForgotPassword.module.css";

import { Link } from "react-router-dom";

import Footer from "../../components/Footer/Footer.jsx";

import { useState } from "react";

import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      const response = await axios.post(
        "http://localhost:3000/users/forgot-password",
        {
          email: normalizedEmail,
        },
      );

      alert(response.data.message);

      setEmail("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Erro ao solicitar recuperação de senha.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.forgotPassword}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Esqueceu sua senha?</h2>

            <p>Informe seu email para recuperar sua senha.</p>
          </div>

          <form className={styles.form} onSubmit={handleForgotPassword}>
            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

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
