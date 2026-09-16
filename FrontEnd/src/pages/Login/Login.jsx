import styles from "./Login.module.css";

import Footer from "../../components/Footer/Footer.jsx";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Salva os dados do usuário logado
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(data.message);

      setEmail("");
      setPassword("");

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);

      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.login}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>
            <h2>Acesse sua conta</h2>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
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

            <div className={styles.inputGroup}>
              <label>Senha</label>

              <input
                type="password"
                placeholder="Informe sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <div className={styles.forgotPassword}>
                <Link to="/forgot-password">Esqueci minha senha</Link>
              </div>
            </div>

            <button type="submit">Entrar</button>
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
