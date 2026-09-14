import styles from "./ForgotPassword.module.css";
import { Link } from "react-router-dom";

import Footer from "../../components/Footer/Footer.jsx";

function ForgotPassword() {
  return (
    <div className={styles.container}>
      <main className={styles.forgotPassword}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>CertifyHub</h1>

            <h2>Esqueceu sua senha?</h2>

            <p>Informe seu email para recuperar sua senha.</p>
          </div>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email</label>

              <input type="email" placeholder="Informe seu email" />
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
