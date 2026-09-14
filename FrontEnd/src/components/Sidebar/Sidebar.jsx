import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>CertifyHub</h1>
      </div>

      <nav className={styles.menu}>
        <a href="#">
          <span>🏠</span>
          Dashboard
        </a>

        <a href="#">
          <span>📜</span>
          Certificados
        </a>

        <a href="#">
          <span>👤</span>
          Perfil
        </a>
      </nav>

      <div className={styles.bottomMenu}>
        <a href="#">
          <span>🚪</span>
          Sair
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
