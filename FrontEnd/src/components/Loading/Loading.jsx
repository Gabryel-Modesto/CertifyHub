import styles from "./Loading.module.css";

const Loading = ({ message = "Carregando..." }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>

        <span>{message}</span>
      </div>
    </div>
  );
};

export default Loading;