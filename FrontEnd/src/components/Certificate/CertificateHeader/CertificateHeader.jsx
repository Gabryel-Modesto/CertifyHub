import styles from "./CertificateHeader.module.css";

function CertificateHeader({ onRegister }) {
  return (
    <div className={styles.header}>
      <div>
        <h1>Meus Certificados</h1>

        <p>Gerencie todos os seus certificados em um só lugar.</p>
      </div>

      <button
        type="button"
        className={styles.registerButton}
        onClick={onRegister}
      >
        + Cadastrar certificado
      </button>
    </div>
  );
}

export default CertificateHeader;
