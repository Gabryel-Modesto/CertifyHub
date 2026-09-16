import styles from "./Register.module.css";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alert.jsx";

import api from "../../services/api.js";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setAlert(null);

    // Verificar se as senhas são iguais
    if (password !== confirmPassword) {
      setAlert({
        message: "As senhas precisam ser iguais!",
        type: "error",
      });

      return;
    }

    setLoading(true);

    try {
      // Criar usuário
      await api.post("/users", {
        name,
        email,
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

      if (error.response?.status === 400) {
        setAlert({
          message:
            error.response?.data?.message || "Não foi possível criar a conta.",
          type: "error",
        });

        return;
      }

      if (error.code === "ECONNABORTED") {
        setAlert({
          message: "O servidor demorou para responder. Verifique o backend.",
          type: "error",
        });

        return;
      }

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
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className={styles.inputGroup}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* SENHA */}
            <div className={styles.inputGroup}>
              <label>Senha</label>

              <input
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* CONFIRMAR SENHA */}
            <div className={styles.inputGroup}>
              <label>Confirmar senha</label>

              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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
