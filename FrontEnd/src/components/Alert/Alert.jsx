import styles from "./Alert.module.css";

const Alert = ({ message, type = "info", onClose }) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>

      {onClose && (
        <button className={styles.close} onClick={onClose} type="button">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
