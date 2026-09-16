import styles from "./Register.module.css";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import Footer from "../../components/Footer/Footer.jsx";

import Alert from "../../components/Alert/Alert.jsx";

import Loading from "../../components/Loading/Loading.jsx";

import api from "../../services/api.js";

function Register() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    setAlert(null);

    // =========================================
    // NORMALIZAÇÃO
    // =========================================

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // =========================================
    // VALIDAÇÕES
    // =========================================

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

    // Senha obrigatória
    if (!password) {
      setAlert({
        message: "Informe uma senha.",
        type: "warning",
      });

      return;
    }

    // Senha mínima
    if (password.length < 6) {
      setAlert({
        message: "A senha deve possuir pelo menos 6 caracteres.",
        type: "warning",
      });

      return;
    }

    // Confirmar senha
    if (!confirmPassword) {
      setAlert({
        message: "Confirme sua senha.",
        type: "warning",
      });

      return;
    }

    // Senhas iguais
    if (password !== confirmPassword) {
      setAlert({
        message: "As senhas precisam ser iguais!",
        type: "error",
      });

      return;
    }

    // =========================================
    // CADASTRO
    // =========================================

    setLoading(true);

    try {
      await api.post("/users", {
        name: normalizedName,
        email: normalizedEmail,
        password,
      });

      // Limpar formulário
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Mensagem de sucesso
      setAlert({
        message: "Usuário criado com sucesso!",
        type: "success",
      });

      // Ir para login
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error(
        "Erro ao cadastrar usuário:",
        error.response?.data || error.message,
      );

      // Erro de validação
      if (error.response?.status === 400) {
        setAlert({
          message:
            error.response?.data?.message || "Não foi possível criar a conta.",
          type: "error",
        });

        return;
      }

      // E-mail já utilizado
      if (error.response?.status === 409) {
        setAlert({
          message:
            error.response?.data?.message ||
            "Este e-mail já está sendo utilizado.",
          type: "error",
        });

        return;
      }

      // Timeout
      if (error.code === "ECONNABORTED") {
        setAlert({
          message: "O servidor demorou para responder. Verifique o backend.",
          type: "error",
        });

        return;
      }

      // Outros erros
      setAlert({
        message:
          error.response?.data?.message || "Erro ao conectar com o servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LOADING */}
      {loading && <Loading message="Criando conta..." />}

      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <main className={styles.register}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Crie sua conta</h2>

            <p>Comece a organizar seus certificados em um só lugar.</p>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            {/* NOME */}
            <div className={styles.inputGroup}>
              <label>Nome</label>

              <input
                type="text"
                placeholder="Informe seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={150}
                required
                disabled={loading}
              />
            </div>

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

            {/* SENHA */}
            <div className={styles.inputGroup}>
              <label>Senha</label>

              <input
                type="password"
                placeholder="Crie uma senha"
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
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            {/* BOTÃO */}
            <button type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <div className={styles.loginLink}>
            <p>Já possui uma conta?</p>

            <Link to="/">Entrar</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Register;
