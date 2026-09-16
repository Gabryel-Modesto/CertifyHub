import styles from "./Login.module.css";

import Footer from "../../components/Footer/Footer.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import Loading from "../../components/Loading/Loading.jsx";

import Countdown from "../../components/Countdown/Countdown.jsx";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import api from "../../services/api.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [blockedUntil, setBlockedUntil] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setAlert(null);

    // =========================================
    // VALIDAÇÕES
    // =========================================

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

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

    if (!trimmedPassword) {
      setAlert({
        message: "Informe sua senha.",
        type: "warning",
      });

      return;
    }

    if (password.length < 6) {
      setAlert({
        message: "A senha deve possuir pelo menos 6 caracteres.",
        type: "warning",
      });

      return;
    }

    if (blockedUntil) {
      return;
    }

    // =========================================
    // LOGIN
    // =========================================

    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email: normalizedEmail,
        password,
      });

      const data = response.data;

      // Salva os dados do usuário
      localStorage.setItem("user", JSON.stringify(data.user));

      // Salva o JWT
      localStorage.setItem("token", data.token);

      // Remove bloqueio
      setBlockedUntil(null);

      // Limpar formulário
      setEmail("");
      setPassword("");

      // Mostrar sucesso
      setAlert({
        message: data.message || "Login realizado com sucesso!",
        type: "success",
      });

      // Ir para o Dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(
        "Erro ao realizar login:",
        error.response?.data || error.message,
      );

      // =========================================
      // CONTA/E-MAIL BLOQUEADO
      // =========================================

      if (error.response?.status === 403) {
        const blockedTime = error.response?.data?.blockedUntil;

        if (blockedTime) {
          setBlockedUntil(blockedTime);
        }

        setAlert({
          message:
            error.response?.data?.message ||
            "Acesso temporariamente bloqueado.",
          type: "error",
        });

        return;
      }

      // =========================================
      // OUTROS ERROS
      // =========================================

      setAlert({
        message:
          error.response?.data?.message || "Erro ao conectar com o servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountdownFinish = () => {
    setBlockedUntil(null);
    setAlert(null);
  };

  return (
    <div className={styles.container}>
      {/* LOADING */}
      {loading && <Loading message="Entrando..." />}

      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <main className={styles.login}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Acesse sua conta</h2>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading || blockedUntil}
              />
            </div>

            {/* SENHA */}
            <div className={styles.inputGroup}>
              <label>Senha</label>

              <input
                type="password"
                placeholder="Informe sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading || blockedUntil}
              />

              <div className={styles.forgotPassword}>
                <Link to="/forgot-password">Esqueci minha senha</Link>
              </div>
            </div>

            {/* CONTADOR */}
            {blockedUntil && (
              <Countdown
                blockedUntil={blockedUntil}
                onFinish={handleCountdownFinish}
              />
            )}

            {/* BOTÃO */}
            <button type="submit" disabled={loading || blockedUntil}>
              {loading ? "Entrando..." : blockedUntil ? "Aguarde..." : "Entrar"}
            </button>
          </form>

          <div className={styles.register}>
            <p>Não possui uma conta?</p>

            <Link to="/register">Cadastre-se</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
