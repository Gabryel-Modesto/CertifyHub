import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer/Footer.jsx";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
      alert("As senhas precisam ser iguais!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      alert("Usuário criado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor!");
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.register}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>
            <h2>Crie sua conta</h2>
            <p>Comece a organizar seus certificados em um só lugar.</p>
          </div>

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <label>Nome</label>
              <input
                type="text"
                placeholder="Informe seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Senha</label>
              <input
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirmar senha</label>
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit">Criar conta</button>
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
