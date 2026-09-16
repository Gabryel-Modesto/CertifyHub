import styles from "./Sidebar.module.css";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import Loading from "../Loading/Loading.jsx";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";

function Sidebar() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Abrir confirmação
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Cancelar logout
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Confirmar logout
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/");
    }, 500);
  };

  return (
    <>
      {/* LOADING */}
      {loading && <Loading message="Encerrando sessão..." />}

      {/* CONFIRMAÇÃO */}
      {showLogoutModal && (
        <ConfirmModal
          title="Sair do CertifyHub?"
          message="Tem certeza que deseja encerrar sua sessão?"
          confirmText="Sair"
          cancelText="Cancelar"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}

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
          <button onClick={() => navigate("/profile")} disabled={loading}>
            <span>👤</span>
            Perfil
          </button>

          <button onClick={handleLogout} disabled={loading}>
            <span>🚪</span>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
