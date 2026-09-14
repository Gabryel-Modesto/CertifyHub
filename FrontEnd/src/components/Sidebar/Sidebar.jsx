import styles from "./Sidebar.module.css";

import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>CertifyHub</h1>
      </div>

      {/* MENU PRINCIPAL */}

      <nav className={styles.menu}>
        <Link to="/dashboard">
          <span>🏠</span>
          Dashboard
        </Link>

        <Link to="/certificates">
          <span>📜</span>
          Certificados
        </Link>
      </nav>

      {/* MENU INFERIOR */}

      <div className={styles.bottomMenu}>
        <button onClick={() => navigate("/profile")}>
          <span>👤</span>
          Perfil
        </button>

        <button onClick={handleLogout}>
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
