import styles from "./ResetPassword.module.css";
import Footer from "../components/Footer/Footer.jsx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Token de recuperação inválido.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/users/reset-password",
        {
          token,
          password,
        },
      );

      setSuccess(response.data.message);

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.resetPassword}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Redefinir senha</h2>

            <p>Informe sua nova senha para recuperar o acesso à sua conta.</p>
          </div>

          <form className={styles.form} onSubmit={handleResetPassword}>
            <div className={styles.inputGroup}>
              <label>Nova senha</label>

              <input
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirmar senha</label>

              <input
                type="password"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Redefinindo..." : "Redefinir senha"}
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

export default ResetPassword;
