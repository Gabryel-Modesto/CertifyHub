import styles from "./Dashboard.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

function Dashboard() {
  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        <h1>Dashboard</h1>

        <p>Bem-vindo ao CertifyHub!</p>
      </main>
    </div>
  );
}

export default Dashboard;
