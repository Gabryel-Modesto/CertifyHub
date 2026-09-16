import styles from "./Profile.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import BtnChangePassword from "../../components/Profile/ChangePassword/BtnChangePassword.jsx";
import BtnEditUser from "../../components/Profile/EditUser/BtnEditUser.jsx";

import Loading from "../../components/Loading/Loading.jsx";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const token = localStorage.getItem("token");

    if (!loggedUser || !token) {
      navigate("/");
      return;
    }

    setUser(loggedUser);
    setLoading(false);
  }, [navigate]);

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return <Loading message="Carregando perfil..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* CABEÇALHO */}
        <div className={styles.header}>
          <h1>Meu perfil</h1>

          <p>Visualize e gerencie seus dados pessoais.</p>
        </div>

        {/* CARD DO PERFIL */}
        <div className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className={styles.profileName}>{user.name}</h2>

              <p>{user.email}</p>
            </div>
          </div>

          {/* INFORMAÇÕES PESSOAIS */}
          <section className={styles.section}>
            <h3>Informações pessoais</h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Nome</span>

                <strong>{user.name}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>E-mail</span>

                <strong>{user.email}</strong>
              </div>
            </div>
          </section>

          {/* AÇÕES */}
          <section className={styles.actions}>
            <BtnEditUser user={user} onUserUpdated={handleUserUpdated} />

            <BtnChangePassword user={user} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;
