import styles from "./ResetPassword.module.css";

import Footer from "../../components/Footer/Footer.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import Loading from "../../components/Loading/Loading.jsx";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useState } from "react";

import api from "../../services/api.js";

function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setAlert(null);

    // =========================================
    // VALIDAR TOKEN
    // =========================================

    if (!token || !token.trim()) {
      setAlert({
        message: "Token de recuperação inválido.",
        type: "error",
      });

      return;
    }

    // =========================================
    // VALIDAR CAMPOS
    // =========================================

    if (!password) {
      setAlert({
        message: "Informe sua nova senha.",
        type: "warning",
      });

      return;
    }

    if (!confirmPassword) {
      setAlert({
        message: "Confirme sua nova senha.",
        type: "warning",
      });

      return;
    }

    // =========================================
    // VALIDAR TAMANHO DA SENHA
    // =========================================

    if (password.length < 6) {
      setAlert({
        message: "A senha deve possuir pelo menos 6 caracteres.",
        type: "warning",
      });

      return;
    }

    // =========================================
    // VALIDAR CONFIRMAÇÃO
    // =========================================

    if (password !== confirmPassword) {
      setAlert({
        message: "As senhas não coincidem.",
        type: "error",
      });

      return;
    }

    // =========================================
    // REDEFINIR SENHA
    // =========================================

    setLoading(true);

    try {
      const response = await api.post("/users/reset-password", {
        token,
        password,
      });

      // Limpar campos
      setPassword("");
      setConfirmPassword("");

      // Alert de sucesso
      setAlert({
        message: response.data.message || "Senha redefinida com sucesso!",
        type: "success",
      });

      // Voltar para o login
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(
        "Erro ao redefinir senha:",
        error.response?.data || error.message,
      );

      // Token inválido ou expirado
      if (error.response?.status === 400) {
        setAlert({
          message:
            error.response?.data?.message || "Token inválido ou expirado.",
          type: "error",
        });

        return;
      }

      // Erro do servidor
      setAlert({
        message: error.response?.data?.message || "Erro ao redefinir senha.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LOADING */}
      {loading && <Loading message="Redefinindo senha..." />}

      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <main className={styles.resetPassword}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Redefinir senha</h2>

            <p>Informe sua nova senha para recuperar o acesso à sua conta.</p>
          </div>

          <form className={styles.form} onSubmit={handleResetPassword}>
            {/* NOVA SENHA */}
            <div className={styles.inputGroup}>
              <label>Nova senha</label>

              <input
                type="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            {/* CONFIRMAR SENHA */}
            <div className={styles.inputGroup}>
              <label>Confirmar senha</label>

              <input
                type="password"
                placeholder="Digite sua senha novamente"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            {/* BOTÃO */}
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
