import styles from "./ForgotPassword.module.css";

import { Link } from "react-router-dom";

import Footer from "../../components/Footer/Footer.jsx";

import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/users/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);

        return;
      }

      alert(data.message);

      setEmail("");
    } catch (error) {
      console.error(error);

      alert("Erro ao conectar com o servidor");
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

            <button type="submit">Enviar link de recuperação</button>
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
