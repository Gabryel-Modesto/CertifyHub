import styles from "./CertificateEmptyState.module.css";

function CertificateEmptyState({ type, onRegister }) {
  const isFilter = type === "filter";

  return (
    <div className={styles.emptyState}>
      <span>{isFilter ? "🔍" : "📜"}</span>

      <h2>
        {isFilter
          ? "Nenhum certificado encontrado"
          : "Nenhum certificado cadastrado"}
      </h2>

      <p>
        {isFilter
          ? "Tente alterar os filtros ou realizar outra busca."
          : "Comece cadastrando seu primeiro certificado."}
      </p>

      {!isFilter && (
        <button
          type="button"
          className={styles.registerButton}
          onClick={onRegister}
        >
          + Cadastrar certificado
        </button>
      )}
    </div>
  );
}

export default CertificateEmptyState;
