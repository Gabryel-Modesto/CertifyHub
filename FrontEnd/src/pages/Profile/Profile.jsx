import styles from "./Profile.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

function Profile() {
  const user = {
    name: "Gabryel Souza",
    email: "gabryel@email.com",
  };

  const handleEdit = () => {
    console.log("Editar perfil");
  };

  const handleChangePassword = () => {
    console.log("Alterar senha");
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* HEADER */}

        <div className={styles.header}>
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e sua conta.</p>
        </div>

        {/* PERFIL */}

        <div className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <span>👤</span>
            </div>

            <div className={styles.profileName}>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          {/* INFORMAÇÕES */}

          <div className={styles.section}>
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
          </div>

          {/* AÇÕES */}

          <div className={styles.actions}>
            <button className={styles.editButton} onClick={handleEdit}>
              ✏️ Editar perfil
            </button>

            <button
              className={styles.passwordButton}
              onClick={handleChangePassword}
            >
              🔒 Alterar senha
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
