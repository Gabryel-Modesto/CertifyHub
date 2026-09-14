import styles from "./RegisterCertificate.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const RegisterCertificate = () => {
  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        <div className={styles.header}>
          <h1>Cadastrar certificado</h1>

          <p>Adicione um novo certificado à sua conta.</p>
        </div>

        <div className={styles.card}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Nome do certificado</label>

              <input type="text" placeholder="Ex: Java Completo" />
            </div>

            <div className={styles.inputGroup}>
              <label>Instituição</label>

              <input type="text" placeholder="Ex: Rocketseat" />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Data de emissão</label>

                <input type="date" />
              </div>

              <div className={styles.inputGroup}>
                <label>Data de validade</label>

                <input type="date" />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Carga horária</label>

                <input type="number" placeholder="Ex: 40" />
              </div>

              <div className={styles.inputGroup}>
                <label>Categoria</label>

                <select>
                  <option value="">Selecione uma categoria</option>

                  <option value="tecnologia">Tecnologia</option>

                  <option value="idiomas">Idiomas</option>

                  <option value="gestao">Gestão</option>

                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>

            {/* ARQUIVO */}

            <div className={styles.inputGroup}>
              <label>Arquivo do certificado</label>

              <input type="file" accept=".pdf,.png,.jpg,.jpeg" />
            </div>

            <button type="submit">Cadastrar certificado</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterCertificate;
