import styles from "./RegisterCertificate.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Alert from "../../components/Alert/Alert.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";

const RegisterCertificate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name_certificate: "",
    institution_certificate: "",
    date_conclusion: "",
    date_validity: "",
    hours_certificate: "",
    category_certificate: "",
    certification_code: "",
    validation_link: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  // Alterar campos
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Selecionar arquivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile || null);
  };

  // Cadastrar certificado
  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert(null);
    setLoading(true);

    try {
      // Verifica se existe token
      const token = localStorage.getItem("token");

      if (!token) {
        setAlert({
          message: "Sua sessão não foi encontrada. Faça login novamente.",
          type: "error",
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }

      // Criar FormData
      const data = new FormData();

      data.append("name_certificate", formData.name_certificate);

      data.append("institution_certificate", formData.institution_certificate);

      data.append("category_certificate", formData.category_certificate);

      data.append("date_conclusion", formData.date_conclusion);

      if (formData.date_validity) {
        data.append("date_validity", formData.date_validity);
      }

      data.append("hours_certificate", formData.hours_certificate);

      if (formData.certification_code) {
        data.append("certification_code", formData.certification_code);
      }

      if (formData.validation_link) {
        data.append("validation_link", formData.validation_link);
      }

      if (formData.description) {
        data.append("description", formData.description);
      }

      // Adicionar arquivo
      if (file) {
        data.append("file", file);
      }

      // Enviar para a API
      await api.post("/certificates", data, {
        timeout: 10000,
      });

      // Alert de sucesso
      setAlert({
        message: "Certificado cadastrado com sucesso!",
        type: "success",
      });

      // Limpar formulário
      setFormData({
        name_certificate: "",
        institution_certificate: "",
        date_conclusion: "",
        date_validity: "",
        hours_certificate: "",
        category_certificate: "",
        certification_code: "",
        validation_link: "",
        description: "",
      });

      setFile(null);

      // Redirecionar para certificados
      setTimeout(() => {
        navigate("/certificates");
      }, 1500);
    } catch (error) {
      console.error(
        "Erro ao cadastrar certificado:",
        error.response?.data || error.message,
      );

      // Token inválido ou expirado
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAlert({
          message: "Sua sessão expirou. Faça login novamente.",
          type: "error",
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }

      // Timeout
      if (error.code === "ECONNABORTED") {
        setAlert({
          message: "O servidor demorou para responder. Verifique o backend.",
          type: "error",
        });

        return;
      }

      // Outros erros
      setAlert({
        message:
          error.response?.data?.message || "Erro ao cadastrar certificado.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <Sidebar />

      <main className={styles.content}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1>Cadastrar certificado</h1>

          <p>Adicione um novo certificado à sua conta.</p>
        </div>

        {/* CARD */}
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* NOME */}
            <div className={styles.inputGroup}>
              <label>Nome do certificado</label>

              <input
                type="text"
                name="name_certificate"
                placeholder="Ex: Java Completo"
                value={formData.name_certificate}
                onChange={handleChange}
                required
              />
            </div>

            {/* INSTITUIÇÃO */}
            <div className={styles.inputGroup}>
              <label>Instituição</label>

              <input
                type="text"
                name="institution_certificate"
                placeholder="Ex: Rocketseat"
                value={formData.institution_certificate}
                onChange={handleChange}
                required
              />
            </div>

            {/* DATAS */}
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Data de emissão</label>

                <input
                  type="date"
                  name="date_conclusion"
                  value={formData.date_conclusion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Data de validade</label>

                <input
                  type="date"
                  name="date_validity"
                  value={formData.date_validity}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CARGA HORÁRIA + CATEGORIA */}
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Carga horária</label>

                <input
                  type="number"
                  name="hours_certificate"
                  placeholder="Ex: 40"
                  value={formData.hours_certificate}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Categoria</label>

                <select
                  name="category_certificate"
                  value={formData.category_certificate}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>

                  <option value="Tecnologia">Tecnologia</option>

                  <option value="Idiomas">Idiomas</option>

                  <option value="Gestão">Gestão</option>

                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            {/* CÓDIGO DE CERTIFICAÇÃO */}
            <div className={styles.inputGroup}>
              <label>Código de certificação</label>

              <input
                type="text"
                name="certification_code"
                placeholder="Ex: CERT-2026-001"
                value={formData.certification_code}
                onChange={handleChange}
              />
            </div>

            {/* LINK DE VALIDAÇÃO */}
            <div className={styles.inputGroup}>
              <label>Link de validação</label>

              <input
                type="url"
                name="validation_link"
                placeholder="https://exemplo.com/validar"
                value={formData.validation_link}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className={styles.inputGroup}>
              <label>Descrição</label>

              <textarea
                name="description"
                placeholder="Descreva o certificado..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            {/* ARQUIVO */}
            <div className={styles.inputGroup}>
              <label>Arquivo do certificado</label>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </div>

            {/* ARQUIVO SELECIONADO */}
            {file && <p>Arquivo selecionado: {file.name}</p>}

            {/* BOTÃO */}
            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar certificado"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterCertificate;
